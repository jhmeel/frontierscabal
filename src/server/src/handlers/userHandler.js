import { User } from "../models/userModel.js";
import catchAsync from "../middlewares/catchAsync.js";
import { ErrorHandler } from "../handlers/errorHandler.js";
import { createSession } from "../providers/sessionProvider.js";
import cloudinary from "cloudinary";
import { resetPasswordMessage } from "../utils/templates.js";
import crypto from "crypto";
import { sendNotification } from "../utils/sendNotification.js";

// Connect with a user
export const connectWithUser = catchAsync(async (req, res, next) => {
  const userToConnectWithId = req.params.id;

  const currentUser = await User.findById(req.user._id).select("connections");
  const userToConnectWith = await User.findById(userToConnectWithId).select(
    "connections"
  );

  if (!currentUser || !userToConnectWith) {
    return res.status(404).json({ error: "User not found" });
  }

  if (currentUser.connections.includes(userToConnectWithId)) {
    const userToConnectIndex =
      currentUser.connections.indexOf(userToConnectWithId);
    const currentUserIndex = userToConnectWith.connections.indexOf(
      req.user._id
    );
    userToConnectWith.connections.splice(currentUserIndex, 1);
    currentUser.connections.splice(userToConnectIndex, 1);

    await Promise.all([currentUser.save(), userToConnectWith.save()]);

    return res
      .status(201)
      .json({ success: true, message: "Unconnected successfully" });
  }

  currentUser.connections.push(userToConnectWithId);
  userToConnectWith.connections.push(req.user._id);

  await Promise.all([currentUser.save(), userToConnectWith.save()]);

  res.status(200).json({
    success: true,
    message: "User connected successfully",
  });
});

export const getAccountDetails = catchAsync(async (req, res, next) => {
  const details = await User.findById(req.user?._id);

  res.status(201).json({ success: true, details });
});

// Get User Details
export const getUserDetails = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ username: req.params.username });

  res.status(200).json({
    success: true,
    user,
  });
});

// Get User Details By Id
export const getUserDetailsById = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  res.status(200).json({
    success: true,
    user,
  });
});

// Get All Users
export const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  //const suggestedUsers = users.filter((u) => !u.followers.includes(req.user._id) && u._id.toString() !== req.user._id.toString()).slice(-5)

  res.status(200).json({
    success: true,
    users,
  });
});

// Update Password
export const updatePassword = catchAsync(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id).select("+password");

  const isPasswordMatched = await user.comparePassword(oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Old Password", 401));
  }

  user.password = newPassword;
  await user.save();
  createSession(user, 201, res, next);
});

// Update Profile
export const updateProfile = catchAsync(async (req, res, next) => {
  const { username, phonenumber, bio, email, school } = req.body;

  const newUserData = {
    username,
    phonenumber,
    bio,
    email,
    school,
  };

  const userExists = await User.findOne({ username });
  if (userExists && userExists?._id.toString() !== req.user?._id.toString()) {
    return next(new ErrorHandler("Username already exist", 422));
  }

  if (req.body?.avatar !== "") {
    const imageId = userExists.avatar.public_id;
    if (imageId) {
      await cloudinary.v2.uploader.destroy(imageId);
    }

    const myCloud = await cloudinary.v2.uploader.upload(req?.body?.avatar, {
      folder: "UserAvatars",
      width: 200,
      crop: "scale",
    });

    newUserData.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

  await User.findByIdAndUpdate(req.user._id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: true,
  });

  res.status(200).json({
    success: true,
    user: userExists,
  });
});

// Forgot Password
export const forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email?.toLowerCase() });

  if (!user) {
    return next(new ErrorHandler("Account Not Found", 404));
  }

  const resetPasswordToken = await user.generateResetPasswordToken();

  await user.save();

  const resetPasswordUrl = `https://frontierscabal.com/#/password/reset/${resetPasswordToken}`;

  try {
    await sendNotification(user, resetPasswordMessage(resetPasswordUrl), [
      `email`,
    ]);

    res.status(200).json({
      success: true,
      message: `Mail sent to ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;

    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error, 500));
  }
});

// Reset Password
export const resetPassword = catchAsync(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpiry: { $gte: Date.now() },
  });

  if (!user) {
    return next(new ErrorHandler("Account Not Found", 404));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpiry = undefined;

  await user.save();
  createSession(user, 201, res, next);
});

// User Search
export const searchUsers = catchAsync(async (req, res, next) => {
  if (req.query?.username) {
    const users = await User.find({
      $or: [
        {
          username: {
            $regex: req.query.username,
            $options: "i",
          },
        },
      ],
    });

    res.status(200).json({
      success: true,
      users,
    });
  }
});

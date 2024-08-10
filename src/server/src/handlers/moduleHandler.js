import { User } from "../models/userModel.js";
import { Module } from "../models/moduleModel.js";
import { Lesson } from "../models/lessonModel.js";
import catchAsync from "../middlewares/catchAsync.js";
import cloudinary from "cloudinary";
import { ErrorHandler } from "./errorHandler.js";

export const createModule = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new ErrorHandler("User not found!", 404));
  }

  const { title, level, description, avatar } = req.body;

  if (!title || !description || !level || !avatar) {
    return next(
      new ErrorHandler(
        "Missing Module Props– title, level, description, and avatar are all required!",
        400
      )
    );
  }

  try {
    const { secure_url, public_id } = await cloudinary.v2.uploader.upload(
      avatar,
      {
        folder: "ModuleAvatar",
        resource_type: "auto",
      }
    );

    const module = await Module.create({
      title,
      description,
      level,
      avatar: {
        secureUrl: secure_url,
        publicId: public_id,
      },
      createdBy: req.user._id,
    });

    res.status(200).json({
      success: true,
      message: "Module created successfully!",
    });
  } catch (error) {
    return next(new ErrorHandler("Error creating module", 500));
  }
});

export const updateModule = catchAsync(async (req, res, next) => {
  const module = await Module.findById(req.params?.moduleId);

  if (!module) {
    return next(new ErrorHandler("Module Not Found!", 404));
  }

  const { title, level, description } = req.body;

  if (!title || !description || !level) {
    return next(
      new ErrorHandler(
        "Missing Module Props– title, level, and description are all required!",
        400
      )
    );
  }

  const newData = {
    title,
    description,
    level,
  };

  if (req.body?.avatar) {
    await cloudinary.v2.uploader.destroy(module.avatar.publicId);

    const myCloud = await cloudinary.v2.uploader.upload(req.body?.avatar, {
      folder: "ModuleAvatar",
    });

    newData.avatar = {
      publicId: myCloud.public_id,
      secureUrl: myCloud.secure_url,
    };
  }

  await Module.findByIdAndUpdate(req.params.moduleId, newData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Module updated successfully",
  });
});

export const deleteModule = catchAsync(async (req, res, next) => {
  const { moduleId } = req.params;

  if (!moduleId) {
    return next(new ErrorHandler("Module id is required!", 400));
  }

  const module = await Module.findById(moduleId);

  if (!module) {
    return next(new ErrorHandler("Module Not Found!", 404));
  }

  const userId = req.user._id.toString();
  const creatorId = module.createdBy.toString();

  const superAdmin = await User.findOne({ role: "FC:SUPER:ADMIN" });

  if (creatorId !== userId && userId !== superAdmin?._id.toString()) {
    return next(new ErrorHandler("Unauthorized", 401));
  }

  await module.deleteAllLessons();

  if (module.avatar && module.avatar.publicId) {
    await cloudinary.v2.uploader.destroy(module.avatar.publicId);
  }

  await Module.findByIdAndDelete(moduleId);

  res.status(200).json({
    success: true,
    message: "Module Deleted Successfully!",
  });
});

export const getModuleLessons = catchAsync(async (req, res, next) => {
  const module = await Module.findById(req.params?.moduleId);

  if (!module) {
    return next(new ErrorHandler("Module Not Found!", 404));
  }

  const lessons = await Lesson.find({ _id: { $in: module.lessons } }).populate(
    "tutor"
  );

  res.status(200).json({
    success: true,
    lessons: lessons || [],
  });
});

export const getModules = catchAsync(async (req, res, next) => {
  const modules = await Module.find();
  res.status(200).json({
    success: true,
    modules: modules || [],
  });
});

export const getModuleById = catchAsync(async (req, res, next) => {
  const module = await Module.findById(req.params.moduleId);
  const lessons = await Lesson.find({ _id: { $in: module.lessons } });
  res.status(200).json({
    success: true,
    module,
    lessons,
  });
});

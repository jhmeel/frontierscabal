import { User } from "../../models/userModel.js";
import catchAsync from "../../middlewares/catchAsync.js";
import { ErrorHandler } from "../errorHandler.js";
import { createSession } from "../../providers/sessionProvider.js";
import { welcomeMsg } from "../../utils/templates.js";
import { sendNotification } from "../../utils/sendNotification.js";
import { logger } from "../../utils/logger.js";

const ref_signup = catchAsync(async (req, res, next) => {
  const { username, email, phonenumber, password } = req.body;

  const { referralCode } = req.params;

  // Check if referral code exists
  const referrer = await User.findOne({ referralCode });
  if (!referrer) {
    return next(new ErrorHandler("Invalid referral code", 401));
  }
  const newUser = {
    username,
    password,
    email,
    phonenumber,
    referredBy: referrer._id,
  };
  // Create new user with referral code
  const user = await User.create(newUser);

  // Update referrer's referredUsers list and bonus
  referrer.referredUsers.push(user._id);
  referrer.tokenBalance += 3;
  await referrer.save();
  try {
    await sendNotification(user, welcomeMsg(user.username), [`email`]);
  } catch (err) {
    logger.error(err);
  } finally {
    return createSession(user, 200, res, next);
  }
});

export { ref_signup };

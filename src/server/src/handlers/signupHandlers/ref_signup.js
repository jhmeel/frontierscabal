import {User} from "../../models/userModel.js";
import catchAsync from "../../middlewares/catchAsync.js";
import {ErrorHandler} from "../errorHandler.js";
import {
  createSession,
} from "../../providers/sessionProvider.js";
import {SendMail} from "../../utils/mailer.js";
import { welcomeMsg } from "../../utils/templates.js";

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

  createSession(user, 200, res, next);
  //notify newuser for successful signup!
  

});

export {ref_signup};

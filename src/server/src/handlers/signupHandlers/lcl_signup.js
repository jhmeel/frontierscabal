
import {User} from "../../models/userModel.js";
import catchAsync from "../../middlewares/catchAsync.js";
import {ErrorHandler} from "../errorHandler.js";
import {
  createSession,
} from "../../providers/sessionProvider.js";
import {SendMail} from "../../utils/mailer.js";
import { welcomeMsg } from "../../utils/templates.js";

const lcl_signup = catchAsync(async (req, res, next) => {
  const { username, email, phonenumber, password } = req.body;

  // Check if user exists
  const userExist = await User.findOne({
    $or: [{ email }, { username }],
  });
  if (userExist) {
    if (userExist.username === username) {
      return next(new ErrorHandler("username already exist", 400));
    }
    return next(new ErrorHandler("Email already exist", 400));
  }

  const newUser = {
    username,
    password,
    email,
    phonenumber,
  };

  // Create new user
  const user = await User.create(newUser);

  createSession(user, 200, res, next);
  //notify newuser for successful signup!
});

export {lcl_signup};

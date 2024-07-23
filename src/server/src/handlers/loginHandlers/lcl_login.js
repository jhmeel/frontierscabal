import {User} from "../../models/userModel.js";
import catchAsync from "../../middlewares/catchAsync.js";
import {ErrorHandler} from "../errorHandler.js";
import {
  createSession,
  deleteSession,
} from "../../providers/sessionProvider.js";

export const loginUser = catchAsync(async (req, res, next) => {

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorHandler("Account not found", 401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
      return next(new ErrorHandler("Incorrect Password", 401));
    }
 
    return createSession(user, 200, res, next);
});

// Logout User
export const logoutUser = catchAsync(async (req, res, next) => {
  return deleteSession(req, res, next)
});

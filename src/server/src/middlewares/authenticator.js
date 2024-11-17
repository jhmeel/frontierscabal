import jwt from "jsonwebtoken";
import { promisify } from "util";
import {Config} from "../config/config.js";
import catchAsync from "../middlewares/catchAsync.js";
import {ErrorHandler} from "../handlers/errorHandler.js";
import {User} from "../models/userModel.js";

const { SECRET_KEY } = Config.JWT;
const authenticator = catchAsync(async (req, res, next) => {
  let token;
  let headers = req.headers.authorization;

  if (headers?.startsWith("Bearer")) {
    token = headers.split(":")[1];
  } else if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    return next(new ErrorHandler('Missing auth token', 400));
  }

  try {
    const verified = await promisify(jwt.verify)(token, SECRET_KEY);
    req.user = await User.findById(verified.id);
  } catch (error) {
    return next(new ErrorHandler(error.message, 401));
  }

  next();
});
export {authenticator};

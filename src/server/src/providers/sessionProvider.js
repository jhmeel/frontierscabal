import { createToken } from "../providers/tokenProvider.js";
import { Config } from "../config/config.js";
import { ErrorHandler } from "../handlers/errorHandler.js";
const { SESSION_MAX_AGE } = Config.SESSION;

export const createSession = async (user, status, res, next) => {
  try {
    const accessToken = createToken(user);

    if ((process.env.NODE_ENV = "development")) {
      res.status(status).json({
        success: true,
        user,
        accessToken,
      });
    } else {
      res.status(status).json({
        success: true,
        user,
        accessToken,
      });
    }
  } catch (err) {
    next(new ErrorHandler(err.message, 500));
  }
};

export const deleteSession = async (req, res) => {
  res.clearCookie("accessToken").json({
    success: true,
    message: "logout successfully",
  });
};

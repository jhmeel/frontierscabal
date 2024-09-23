import { createToken } from "../providers/tokenProvider.js";
import { Config } from "../config/config.js";
import { ErrorHandler } from "../handlers/errorHandler.js";
const { SESSION_MAX_AGE } = Config.SESSION;

export const createSession = async (user, status, res, next) => {
  try {
    const accessToken = createToken(user);
<<<<<<< HEAD
    if ((process.env.NODE_ENV = "development")) {
      res
        .cookie("accessToken", accessToken, {
          httpOnly: true,
          expires: new Date(
            Date.now() + Number(SESSION_MAX_AGE) * 24 * 60 * 60 * 1000
          ),
        })
        .status(status) 
        .json({
          success: true,
          user,
          accessToken,
        });
    } else {
      res
        .cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: true,
          sameSite: "lax",
          expires: new Date(
            Date.now() + Number(s_maxAge) * 24 * 60 * 60 * 1000
          ),
        })
        .status(status)
        .json({
          success: true,
          user,
          accessToken,
        });
    }
  } catch (err) {
    next(new ErrorHandler(err.message, 500))
=======

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
>>>>>>> 832ce1e54523d6df4550e5927e27d5ea4093fd7e
  }
};

export const deleteSession = async (req, res) => {
  res.clearCookie("accessToken").json({
    success: true,
    message: "logout successfully",
<<<<<<< HEAD
  })
=======
  });
>>>>>>> 832ce1e54523d6df4550e5927e27d5ea4093fd7e
};

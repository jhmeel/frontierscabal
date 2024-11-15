import jwt from "jsonwebtoken";
import { Config } from "../config/config.js";
import { encrypt } from "../utils/cryptic.js";
const { SECRET_KEY, EXPIRES_IN } = Config.JWT;

export const createToken = (user) => {
  
  if (!user)
    throw new Error(`Missing user; got– ${user}`);

  try {
    const payload = {
      id: user?._id,
      role: encrypt(user?.role),
    };


    const accessToken = jwt.sign(payload, SECRET_KEY, {
      expiresIn: EXPIRES_IN
    });
 
    return accessToken;
  } catch (err) {
    throw err
  }
};

import jwt from "jsonwebtoken";
import { Config } from "../config/config.js";
import { encrypt } from "../utils/cryptic.js";
const { JWT_SECRETE_KEY, JWT_EXPIRES_IN } = Config.JWT;

export const createToken = (user) => {
<<<<<<< HEAD
=======
  
>>>>>>> 832ce1e54523d6df4550e5927e27d5ea4093fd7e
  if (!user)
    throw new Error(`Missing user; got– ${user}`);

  try {
    const payload = {
      id: user?._id,
      role: encrypt(user?.role),
    };

    // Create a new token using the payload and secret key
    const accessToken = jwt.sign(payload, JWT_SECRETE_KEY, {
      expiresIn: JWT_EXPIRES_IN
    });
 
    return accessToken;
  } catch (err) {
    throw err
  }
};

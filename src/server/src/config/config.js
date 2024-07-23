import dotenv from "dotenv";
dotenv.config();


const Config = {
  NAME: process.env.NAME || "<FRONTIERSCABAL>",
  BASE_URL: process.env.BASE_URL,
  PORT: process.env.PORT || 8000,
  VERSION: process.env.VERSION,
  ADMIN: {
    USERNAME: process.env.ADMIN_USER_NAME,
    PASSWORD: process.env.ADMIN_PASSWORD,
    ADMIN_ID: process.env.AMIN_ID,
    ADMIN_TITLE: process.env.AMIN_TITLE,
  },
  USER: {
    USER_ID: process.env.USER_ROLE_ID,
    USER_TITLE: process.env.USER_TITLE,
  },
  JWT: {
    JWT_SECRETE_KEY: process.env.JWT_SECRET_KEY||'FC:JWT:SECRETE:99',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN||'7d', 
  },
  SESSION: {
    SESSION_SECRET_KEY: process.env.SESSION_SECRET_KEY,
    SESSION_MAX_AGE: process.env.SESSION_MAX_AGE,
  },
  RESET_PASSWORD: {
    RESET_PASSWORD_EXPIRY: Date.now() + 5 * 60 * 1000, //5mins
  },
  VERIFY_TOKEN: {
    VERIFY_TOKEN_EXPIRY: Date.now() + 10 * 60 * 1000, //10mins
  },
 CACHE:{

 },
  LOGGER: {
    MAX_FILE_SIZE: 10 << 20, //,10mb
    LOG_STORAGE_PATH: "./server.log",
    MAX_FILES: 5,
  },
  MAILER: {
    API_KEY: process.env.API_KEY,
    EMAIL: process.env.EMAIL,
  },
  CRYPTO: {
    KEY: process.env.CRYPTIC_Key||'qwertyuiujhgfbivndcxjbhtyrtertryui',
  },
  RATE_LIMITER: { 
    WINDOW_MS: 5 * 60 * 1000, // 5 minute
    MAX: 1000, // limit each IP to 100 requests per 5minute
    MESSAGE: "Too many requests, please try again later",
  },
  MAX_ASYNC_RETRY: 3,

  DB: {
    URL: process.env.DB_URL||'mongodb+srv://Jhmeel:08081434%40Jh@cluster0.ujgpkxo.mongodb.net',
  },
  CLOUDINARY: {
    CLOUDINARY_NAME: process.env.CLOUDINARY_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  },
  WEBPUSH: {
    VAPID_PUBLIC_KEY: process.env.VAPID_PUBLIC_KEY||'BP_zBx8Se411U33MhcPWFMPwurhn9mP7YLnQI8CRUJXp35hk3lnYM6ZPfAZ0L4g7Ws7EhBSdqGlcE_nreH7YZNw',
    VAPID_PRIVATE_KEY: process.env.VAPID_PRIVATE_KEY||'_wOrekYu6Gn_XwN0GLlysbwaXhoMbsoZkoONIAgtBrI',
    VAPID_SUBJECT: process.env.VAPID_SUBJECT||'mailto:frontierscabal@gmail.com',
  },
  REDIS: {
    TTL: 60,
  },
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
};

export { Config };

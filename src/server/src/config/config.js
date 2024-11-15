import dotenv from "dotenv";
dotenv.config();

const Config = {
  APP: {
    NAME: process.env.NAME || "FRONTIERSCABAL",
    BASE_URL: process.env.BASE_URL,
    PORT: process.env.PORT || 8000,
    VERSION: process.env.VERSION || "1.0.0",
  },

  // ADMIN SETTINGS
  ADMIN: {
    USERNAME: process.env.ADMIN_USER_NAME,
    PASSWORD: process.env.ADMIN_PASSWORD,
    ID: process.env.ADMIN_ID,
    TITLE: process.env.ADMIN_TITLE,
  },

  // USER SETTINGS
  USER: {
    ID: process.env.USER_ROLE_ID,
    TITLE: process.env.USER_TITLE,
  },

  // JWT CONFIGURATION
  JWT: {
    SECRET_KEY: process.env.JWT_SECRET_KEY || "FC:JWT:SECRET:99",
    EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  },

  // SESSION SETTINGS
  SESSION: {
    SECRET_KEY: process.env.SESSION_SECRET_KEY || `0987543WERTYUIKJHGFDSDFGHJK`,
    MAX_AGE: parseInt(process.env.SESSION_MAX_AGE, 10) || 24 * 60 * 60 * 1000, // Default: 1 day in ms
  },

  NOTIFICATION_COOLDOWN_DAYS: 2,

  // PASSWORD RESET CONFIGURATION
  PASSWORD_RESET: {
    EXPIRY: parseInt(process.env.PASSWORD_RESET_EXPIRY, 10) || 5 * 60 * 1000, // 5 minutes
  },

  // TOKEN VERIFICATION SETTINGS
  TOKEN_VERIFICATION: {
    EXPIRY: parseInt(process.env.VERIFY_TOKEN_EXPIRY, 10) || 10 * 60 * 1000, // 10 minutes
  },

  // CACHE SETTINGS
  CACHE: {
    TTL: 60, // Time to live in seconds
  },

  // LOGGER CONFIGURATION
  LOGGER: {
    MAX_FILE_SIZE: 10 << 20, // 10 MB
    STORAGE_PATH: process.env.LOG_PATH || "./logs/server.log",
    MAX_FILES: parseInt(process.env.LOG_MAX_FILES, 10) || 5,
  },

  // MAILER SETTINGS
  MAILER: {
    API_KEY: process.env.MAIL_API_KEY,
    EMAIL: process.env.EMAIL || "frontierscabal@gmail.com",
  },

  // CRYPTO CONFIGURATION
  CRYPTO: {
    KEY: process.env.CRYPTO_KEY || "qwertyuiujhgfbivndcxjbhtyrtertryui",
  },

  // RATE LIMITING SETTINGS
  RATE_LIMITER: {
    WINDOW_MS:
      parseInt(process.env.RATE_LIMITER_WINDOW_MS, 10) || 5 * 60 * 1000, // 5 minutes
    MAX_REQUESTS: parseInt(process.env.RATE_LIMITER_MAX, 10) || 1000, // limit per window
    MESSAGE:
      process.env.RATE_LIMITER_MESSAGE ||
      "Too many requests, please try again later",
  },

  // DATABASE CONFIGURATION
  DB: {
    URL:
      process.env.DB_URL ||
      "mongodb+srv://Jhmeel:08081434%40Jh@cluster0.ujgpkxo.mongodb.net",
  },

  // CLOUDINARY SETTINGS
  CLOUDINARY: {
    NAME: process.env.CLOUDINARY_NAME || "fcstore",
    API_KEY: process.env.CLOUDINARY_API_KEY || "779893887235886",
    API_SECRET:
      process.env.CLOUDINARY_API_SECRET || "sf0M9K2EDJY3_EUrHnXFmUkLrMs",
  },

  // WEB PUSH NOTIFICATIONS
  WEBPUSH: {
    VAPID_PUBLIC_KEY:
      process.env.VAPID_PUBLIC_KEY ||
      "BOxh7Wy4nDeWLSGi9BWUzzvfJw0EFDub2iDU0HoWLQ9PAX6DwwAx8yKtXBL3P5XkwaSMgXXye-odg69N_ui_2QM",
    VAPID_PRIVATE_KEY:
      process.env.VAPID_PRIVATE_KEY ||
      "X_H6btbT1O8l2LJ0cKlDTXfSUrrSgLFNS9LQlBuTsXs",
    VAPID_SUBJECT:
      process.env.VAPID_SUBJECT || "mailto:frontierscabal@gmail.com",
  },

  // REDIS CONFIGURATION
  REDIS: {
    TTL: parseInt(process.env.REDIS_TTL, 10) || 60,
  },

  // TELEGRAM BOT SETTINGS
  TELEGRAM: {
    BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
  },

  // SUBSCRIPTION AND BILLING CONFIGURATION
  SUBSCRIPTION: {
    ACTIVE: false,
    PLANS: {
      FREE: {
        DAILY_MAX_DOWNLOADS: 5,
        ADS_ENABLED: true,
      },
      WEEKLY: {
        PRICE: "1250",
        DURATION: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
      },
      MONTHLY: {
        PRICE: "4500",
        DURATION: 30 * 24 * 60 * 60 * 1000, // 30 days in ms
      },
      ANNUAL: {
        PRICE: "24500",
        DURATION: 365 * 24 * 60 * 60 * 1000, // 365 days in ms
      },
    },
    BILLING: {
      NOTIFICATION_BEFORE_DUE: 3 * 24 * 60 * 60 * 1000, // Notify 3 days before due date
      GRACE_PERIOD: 7 * 24 * 60 * 60 * 1000, // Grace period after expiry
    },
  },

  // ASYNCHRONOUS TASKS CONFIG
  ASYNC_RETRY: {
    MAX_RETRIES: parseInt(process.env.ASYNC_MAX_RETRIES, 10) || 3,
  },
};

export { Config };

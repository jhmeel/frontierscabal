import { logger } from "../utils/logger.js";

class ErrorHandler extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;

    logger.error(`${message}`);
    Error.captureStackTrace(this, this.constructor);
  }
}

export { ErrorHandler };

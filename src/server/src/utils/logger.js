import winston from 'winston';
import {Config} from '../config/config.js'

const { createLogger, transports } = winston;
const { combine, colorize, timestamp, printf } = winston.format;

const {LOG_STORAGE_PATH, MAX_FILE_SIZE, MAX_FILES}  = Config.LOGGER;

const logFormat = combine(
   colorize({
        all: true,
    }),
  timestamp(),
  printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
);

// Create logger with a rotating file transport
const logger = createLogger({
  level: 'debug',
  format: logFormat,
  transports: [
    new transports.Console(),
    new transports.File({
      filename: LOG_STORAGE_PATH,
      maxFiles: MAX_FILES,
      maxsize: MAX_FILE_SIZE
    })
  ]
});







export {logger};
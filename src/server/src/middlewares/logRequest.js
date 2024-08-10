import {logger} from '../utils/logger.js'

// Log a request middlewear
const logRequest = (req, res, next) => {
  let ip_address = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  if (['::ffff:127.0.0.1', '::1'].includes(ip_address)) {
    ip_address = '127.0.0.1'
  }

  const logMessage = `${ip_address} => ${req.method}:${req.url}:${res.statusCode}`;
  logger.info(logMessage);
  next();
}

export { logRequest }
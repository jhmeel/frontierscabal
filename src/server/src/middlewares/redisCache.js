import redis from 'redis';
import { logger } from '../utils/logger.js';

// Create a Redis client
const cache = redis.createClient();

const cacheMiddleware = (expirationTime) => {
  return (req, res, next) => {
    const cacheKey = req.originalUrl;

    // Check if the data exists in the cache
    cache.get(cacheKey, (err, cachedData) => {
      if (err) {
        logger.error(err);
        next();
      } else if (cachedData) {
        // If data exists in the cache, return it as the response
        res.json(JSON.parse(cachedData));
      } else {
        // Override the res.json method to cache the response
        res.jsonResponse = res.json;
        res.json = (body) => {
          // Set the response body in the cache with an expiration time
          cache.setex(cacheKey, expirationTime, JSON.stringify(body));
          res.jsonResponse(body);
        };
        next();
      }
    });
  };
};

export { cacheMiddleware };

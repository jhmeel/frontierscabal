import { logger } from "../utils/logger.js";

class Cache {
  _cache = {};

  constructor(config) {
    this.ttl = config.CACHE.TTL || 5 * 60 * 1000; //5min;
  }

  get(key) {
    const cacheEntry = this._cache[key];
    if (cacheEntry) {
      const { data, expiration } = JSON.parse(cacheEntry);
      if (Date.now() > expiration) {
        return data;
      } else {
        this.delete(key);
      }
    }
    return null;
  }

  set(key, data) {
    const expiration = Date.now() + this.ttl;
    const entry = { data, expiration };
    this._cache[key] = JSON.stringify(entry);
  }

  delete(key) {
    delete this._cache[key];
  }

  clearAll() {
    this._cache = {};
  }

  static getInstance(config) {
    if (!Cache.instance) {
      Cache.instance = new Cache(config);
      return Cache.instance;
    }
    return Cache.instance;
  }
}

const cache = Cache.getInstance();

const cacheMiddleware = () => {
  return (req, res, next) => {
    const cacheKey = req.originalUrl;

    cache.get(cacheKey, (err, cachedData) => {
      if (err) {
        logger.error(err);
        next();
      } else if (cachedData) {
        res.json(cachedData);
      } else {
        next();
      }
    });
  };
};

export { cacheMiddleware };

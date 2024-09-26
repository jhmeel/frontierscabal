import compression from "compression";
import cors from "cors";
import bodyParser from "body-parser";
import { Config } from "../config/config.js";
import { logRequest } from "../middlewares/logRequest.js";
import rateLimit from "express-rate-limit";
import { logger } from "../utils/logger.js";
import { Emitter } from "../utils/emitter.js";

const { WINDOW_MS, MAX, MESSAGE } = Config.RATE_LIMITER

const { TTL } = Config.REDIS

class MiddlewaresProvider {
  constructor(app) {
    this._name = "<MIDDLEWARES_PROVIDER>";
    this.app = app;
    this.emitter = Emitter.getInstance();
  }
  async init() {
    const limiter = rateLimit({ 
      windowMs: WINDOW_MS,
      max: MAX,
      message: MESSAGE,
      standardHeaders: true,
      legacyHeaders: false,
    });

    try {
      logger.info(`initializing ${this._name}...`);
      this.app.use(bodyParser.json({ limit: '50mb' }));
      this.app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
      this.app.use(cors());
      this.app.disable("x-powered-by");

      this.app.use(logRequest);
      this.app.use(limiter);

      this.app.use(compression());


      //this.app.use(cacheMiddleware(TTL))

      this.emitter.emit(`${this._name}Ready`);
      logger.info(` ${this._name} initialized!`);
    } catch (err) {
      throw err
    }
  } 
}
export { MiddlewaresProvider }; 

import { logger } from "../utils/logger.js";
import { Emitter } from "../utils/emitter.js";
import { Event } from "../routes/eventRoutes.js";
import { Module } from "../routes/moduleRoutes.js";
import { CourseMaterial } from "../routes/courseMaterialRoutes.js";
import { Misc } from "../routes/miscRoutes.js";
import { User } from "../routes/userRoutes.js";
import { Article } from "../routes/articleRoutes.js";
import { PastQuestion } from "../routes/pastQuestionRoutes.js";
import { Bot } from "../routes/botRoute.js";

import os from "os";
import {errorMiddleware} from "../middlewares/error.js";


class RouteProvider {
  constructor(app) {
    this._name = "<ROUTES_PROVIDER>";
    this.app = app;
    this.emitter = Emitter.getInstance();
  }
  async init() {
    try {
      logger.info(`initializing ${this._name}...`);

      this.app.use("/api/v1", User);
      this.app.use("/api/v1", Article);
      this.app.use("/api/v1", PastQuestion);
      this.app.use("/api/v1", CourseMaterial);
      this.app.use("/api/v1", Module);
      this.app.use("/api/v1", Event);
      this.app.use("/api/v1", Misc);
      this.app.use("/api/v1", Bot);
      this.app.use(errorMiddleware);

      this.app.route("/healthz").get(async (req, res, next) => {
        const MIN_UP_TIME = 60;
        const uptime = process.uptime();
        const is_healthy = uptime >= MIN_UP_TIME;
        const status = {
          status: is_healthy
            ? "UP"
            : uptime < MIN_UP_TIME && uptime > 0
              ? "INITIALIZING..."
              : "DOWN",
          timestamp: new Date().toISOString(),
          uptime: process.uptime(),
          hostname: os.hostname(),
          cpu: os.cpus,
          cpuUsage: process.cpuUsage,
          memoryUsage: process.memoryUsage,
          loadAverage: os.loadavg(),
          freeMemory: os.freemem(),
          totalMemory: os.totalmem(),
        };
        res.status(200).json(status);
      });

      this.emitter.emit(`${this._name}Ready`);

      logger.info(`${this._name} initialized! `);
    } catch (err) {
      throw err
    }
  }
}

export {RouteProvider};

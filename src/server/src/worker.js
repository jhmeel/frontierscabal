import { asyncRetry } from "./utils/retryAsync.js";
import { logger } from "./utils/logger.js";
import { Emitter } from "./utils/emitter.js";
import { notifyforOngoingEvent } from "./handlers/webpushHandler.js";
import { ErrorHandler } from "./handlers/errorHandler.js";
import ViteExpress from "vite-express";

class Worker {
  constructor(app, config) {
    logger.debug(`Starting Worker... V${config.APP.VERSION}`);
    this.dependencies = {};
    this.readyPercentage = 0;
    this.config = config;
    this.retries = this.config.ASYNC_RETRY.MAX_RETRIES;
    this.emitter = Emitter.getInstance();
    this.port = this.config.APP.PORT;
    this.app = app;
  }

  initServer() {
    ViteExpress.listen(this.app, this.port, () => {
      this.emitter.emit("SYSTEM:READY:STATE", "100");
      logger.info(`server running on port ${this.port}`);
    });

    notifyforOngoingEvent();
  }

  addDependency(dependencies) {
    for (const dependency of dependencies) {
      this.dependencies[dependency._name] = dependency;
      this.listenForDependencyReady(dependency._name);
    }
  }

  listenForDependencyReady(name) {
    logger.debug(`[Worker] Listening for ${name} ready state...`);
    this.emitter.on(`${name}Ready`, () => {
      this.dependencies[name] = true;
      logger.info(`${name} is ready`);
      this.updateReadyPercentage();
    });
  } 

  startPolling() {
    const intervalId = setInterval(() => {
      if (this.readyPercentage === 100) {
        logger.info("System is 100% ready!!");
        logger.info("Boostrapping System...");
        this.initServer();
        clearInterval(intervalId);
      } else {
        logger.debug(`[Worker] System is ${this.readyPercentage}% ready...`);
      }
    }, 500);
    return this;
  }

  updateReadyPercentage() {
    const numOfDependencies = Object.keys(this.dependencies).length;
    const numOfReadyDependencies = Object.values(this.dependencies).filter(
      (status) => status === true
    ).length;
    this.readyPercentage = Math.round(
      (numOfReadyDependencies / numOfDependencies) * 100
    );
  }

  static getInstance(app, config) {
    if (!Worker.instance) {
      Worker.instance = new Worker(app, config);
    }
    return Worker.instance;
  }

  async initializeDependencies() {
    if (!this.dependencies) {
      throw new ErrorHandler("[Worker]: Missing dependencies... ");
    }

    try {
      for (const [name, dependency] of Object.entries(this.dependencies)) {
        await asyncRetry(this.retries)(dependency.init());
      }
      return this;
    } catch (error) {
      throw new ErrorHandler(
        `[Worker]: Error initializing dependencies: ${error}`
      );
    }
  }
}

export { Worker };

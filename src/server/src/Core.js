import { asyncRetry } from "./utils/retryAsync.js";
import { logger } from "./utils/logger.js";
import { Emitter } from "./utils/emitter.js";
import { notifyforOngoingEvent } from "./handlers/webpushHandler.js";
import { ErrorHandler } from "./handlers/errorHandler.js";
import ViteExpress from "vite-express";

class Core {
  constructor(app, config) {
    logger.info(`Starting Core... V${config.VERSION}`);
    this.dependencies = {};
    this.readyPercentage = 0;
    this.config = config;
    this.RETRIES = this.config.MAX_ASYNC_RETRY;
    this.emitter = Emitter.getInstance();
    this.port = this.config.PORT;
    this.app = app;
  }

  initServer() {
    ViteExpress.listen(this.app, this.port, () => {
      this.emitter.emit("SYSTEM:READY:STATE", "100");
      logger.info(`server running on port ${this.port}`);
    });

    //Notify users for ongoing event at evry 12.00am
    notifyforOngoingEvent();
  }

  addDependency(dependencies) {
    for (const dependency of dependencies) {
      this.dependencies[dependency._name] = dependency;
      this.listenForDependencyReady(dependency._name);
    }
  }

  listenForDependencyReady(name) {
    logger.info(`[Core] Listening for ${name} ready state...`);
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
        logger.info(`[Core] System is ${this.readyPercentage}% ready...`);
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
    if (!Core.instance) {
      Core.instance = new Core(app, config);
    }
    return Core.instance;
  }

  async initializeDependencies() {
    if (!this.dependencies) {
      throw new ErrorHandler("[CORE]: Missing dependencies... ");
    }

    try {
      for (const [name, dependency] of Object.entries(this.dependencies)) {
        await asyncRetry(this.RETRIES)(dependency.init());
      }
      return this;
    } catch (error) {
      throw new ErrorHandler(
        `[CORE]: Error initializing dependencies: ${error}`
      );
    }
  }
}

export { Core };

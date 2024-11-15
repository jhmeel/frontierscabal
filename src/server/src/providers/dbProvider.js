import { logger } from "../utils/logger.js";
import { Emitter } from "../utils/emitter.js";
import mongoose from "mongoose";

class DbProvider {
  constructor(config) {
    this.mongoose = mongoose;
    this._name = "<DATABASE_PROVIDER>";
    this.db_url = config.DB.URL;
    this.emitter = Emitter.getInstance();
    this.connection = null
  }

  async init() {
    try {
      logger.info(`initializing ${this._name}...`);

      this.connection = await this.mongoose.connect(this.db_url);
 
      this.emitter.emit(`${this._name}Ready`);

      logger.info(`${this._name} initialized! `);
    } catch (err) {
      throw err
    }
  }

  async cleanUp() {
    try {
      await this.mongoose.close();
      logger.info("MongoDB connection closed.");
    } catch (err) {
      throw err
    }
  }
  static getInstance(config) {
    if (!DbProvider.instance) {
      DbProvider.instance = new DbProvider(config);
      return DbProvider.instance;
    }
    return DbProvider.instance;
  }
}

export { DbProvider };


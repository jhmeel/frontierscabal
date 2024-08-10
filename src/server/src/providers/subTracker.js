import cron from "node-cron";
import {User} from "../models/userModel.js";
import { logger } from "../utils/logger.js";
import { Emitter } from "../utils/emitter.js";

class SubTracker {
  constructor() {
    this._name = "<SUBSCRIPTION_TRACKER>";
    this.emitter = Emitter.getInstance();
  }
  async init() {
    try {
      logger.info(`initializing ${this._name}...`);
      this.start();
      this.emitter.emit(`${this._name}Ready`);
      logger.info(`${this._name} initialized! `);
    } catch (err) {
      throw err
    }
  }

  start() {
    // Cron job to check and update subscription status
    cron.schedule("0 0 * * *", async () => {
      try {
    
        // Update subscription status for users with due subscription
        await User.updateMany(
          {
            subscriptionDue: false,
            tokenBalance: 0,
          },
          { $set: { subscriptionDue: true } }
        );

        logger.info("@SUBTRACKER:Subscription statuses updated successfully!.");
      } catch (error) {
        logger.error("@SUBTRACKER:Error updating subscription status:", error);
      }
    },{
      scheduled: true,
      timezone:'Africa/Lagos'
    });
  }
}

export {SubTracker};

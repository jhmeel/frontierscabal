import dayjs from "dayjs";
import { User } from "../models/userModel.js";
import { generateNotification } from "./notificationGen.js";
import { Config } from "../config/config.js";
import { logger } from "./logger.js";
import { sendNotification } from "./sendNotification.js";

const isSubscriptionDue = (user) => {
  const latestSubscription =
    user.subscriptionRef[user.subscriptionRef.length - 1];
  if (!latestSubscription) return true;

  const planConfig = Config.SUBSCRIPTION.PLANS[latestSubscription.plan];
  if (!planConfig || !planConfig.DURATION) return true;

  const subscriptionEndDate = dayjs(latestSubscription.date).add(
    planConfig.DURATION,
    "milliseconds"
  );
  return dayjs().isAfter(subscriptionEndDate);
};

class SubscriptionQueue {
  constructor() {
    this.queue = [];
    this.isProcessing = false;
  }

  addJob(userId) {
    this.queue.push({ userId });
    this.processQueue();
  }

  async processQueue() {
    if (this.isProcessing) return;
    this.isProcessing = true;

    while (this.queue.length > 0) {
      const job = this.queue.shift();
      await this.processJob(job);
    }

    this.isProcessing = false;
  }

  async processJob({ userId }) {
    const user = await User.findById(userId);
    if (!user) return;

    user.dailyFreeDownloadCount = 0; // Reset free download count every 24 hours

    const latestSubscription =
      user.subscriptionRef[user.subscriptionRef.length - 1];
    const hasSubscribedBefore = !!latestSubscription;

    if (!hasSubscribedBefore) {
      await this.notifyFreemiumToSubscribe(user);
      return;
    }

    const isDue = isSubscriptionDue(user);

    if (isDue && !user.subscriptionDue) {
      // Check if user is not already downgraded
      await this.downgradeSubscription(user);
    } else {
      await this.remindSubscribersForSubscriptionDue(user, latestSubscription);
    }
  }

  async downgradeSubscription(user) {
    user.subscriptionDue = true;
    await user.save();

    const lastNotificationDate =
      user.lastSubscriptionNotificationSentAt || dayjs(0);
    if (
      dayjs().diff(lastNotificationDate, "day") >=
      Config.NOTIFICATION_COOLDOWN_DAYS
    ) {
      const downgradeNotification = generateNotification(
        "SUBSCRIPTION:DOWNGRADE",
        { username: user.username }
      );
      await sendNotification(user, downgradeNotification, ["email", "push"]);
      user.lastSubscriptionNotificationSentAt = dayjs().toDate();
      await user.save();
    }
  }

  async remindSubscribersForSubscriptionDue(user, latestSubscription) {
    const planConfig = Config.SUBSCRIPTION.PLANS[latestSubscription.plan];
    const subscriptionEndDate = dayjs(latestSubscription.date).add(
      planConfig.DURATION,
      "milliseconds"
    );
    const daysUntilDue = subscriptionEndDate.diff(dayjs(), "day");

    if (daysUntilDue <= 3) {
      const lastNotificationDate =
        user.lastSubscriptionNotificationSentAt || dayjs(0);
      if (
        dayjs().diff(lastNotificationDate, "day") >=
        Config.NOTIFICATION_COOLDOWN_DAYS
      ) {
        const reminderNotification = generateNotification(
          "SUBSCRIPTION:DUE_REMINDER",
          { username: user.username }
        );
        await sendNotification(user, reminderNotification, ["email", "push"]);
        user.lastSubscriptionNotificationSentAt = dayjs().toDate();
        await user.save();
      }
    }
  }

  async notifyFreemiumToSubscribe(user) {
    const lastNotificationDate =
      user.lastSubscriptionNotificationSentAt || dayjs(0);
    if (
      dayjs().diff(lastNotificationDate, "day") >=
      Config.NOTIFICATION_COOLDOWN_DAYS
    ) {
      const inviteNotification = generateNotification("SUBSCRIPTION:INVITE", {
        username: user.username,
      });
      await sendNotification(user, inviteNotification, ["email", "push"]);
      user.lastSubscriptionNotificationSentAt = dayjs().toDate();
      await user.save();
    }
  }
}

const subscriptionQueue = new SubscriptionQueue();

setInterval(async () => {
  if (Config.SUBSCRIPTION.ACTIVE) {
    logger.debug(
      `Running subscription checks at ${new Date().toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      })}`
    );
    const users = await User.find({});
    users.forEach((user) => {
      subscriptionQueue.addJob(user._id);
    });
  }
}, 24 * 60 * 60 * 1000); // Every 24 hours

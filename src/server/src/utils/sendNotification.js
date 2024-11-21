import admin from "firebase-admin";
import sgMail from "@sendgrid/mail";
import { Config } from "../config/config.js";
import { PushSubscription } from "../models/pushSubscriptionModel.js";
import { logger } from "./logger.js";

export const sendNotification = async (
  user,
  notificationData,
  methods = ["email", "push"]
) => {
  const { title, message, slug, avatar, image, date, subject, content } =
    notificationData;
  const userSub = await PushSubscription.findOne({ username: user?.username });
  if (!userSub && !methods.includes("email")) {
    return;
  }

  const pushToken = JSON.parse(userSub.subscription);

  if (methods.includes("push") && pushToken) {
    await admin.messaging().send({
      token: pushToken,
      notification: { title, body: message },
      data: { slug, avatar, image, date: date.toString() },
    });
  }

  if (methods.includes("email") && user.email) {
    const msg = {
      to: user.email,
      from: Config.MAILER.EMAIL,
      subject: title || subject,
      html: !content
        ? `<p>${message}</p><p><a href="${slug}">Learn more</a></p>`
        : content,
    };
    await sgMail.send(msg);
  }
};

export const notifyAllUser = async (payload, methods = ["email", "push"]) => {
  const users = await PushSubscription.find();
  const { title, message, slug, avatar, image, date } = payload;
  try {
    await Promise.all(
      users
        .filter(
          (user) =>
            user.username !==
            (payload?.postedBy?.username || payload?.createdBy?.username)
        )
        .map(async (user) => {
          const pushToken = JSON.parse(user.subscription);

          if (methods.includes("push") && pushToken) {
            await admin.messaging().send({
              token: pushToken,
              notification: { title, body: message },
              data: { slug, avatar, image, date: date.toString() },
            });
          }

          if (methods.includes("email") && user?.email) {
            const msg = {
              to: user.email,
              from: Config.MAILER.EMAIL,
              subject: title,
              html: `<p>${message}</p><p><a href="${slug}">Learn more</a></p>`,
            };
            await sgMail.send(msg);
          }

          logger.info(`Done notifying ${user.username}`);
        })
    );
    logger.info("Done notifying all frontiers");
  } catch (err) {
    logger.error(err);
  }
};

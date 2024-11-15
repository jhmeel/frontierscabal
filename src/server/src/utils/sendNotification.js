import admin from "firebase-admin";
import sgMail from "@sendgrid/mail";
import { Config } from "../config/config.js";

export const sendNotification = async (
  user,
  notificationData,
  methods = ["email", "push"]
) => {
  const { title, message, slug, avatar, image, date } = notificationData;

  if (methods.includes("push") && user.pushToken) {
    await admin.messaging().send({
      token: user.pushToken,
      notification: { title, body: message },
      data: { slug, avatar, image, date: date.toString() },
    });
  }

  if (methods.includes("email") && user.email) {
    const msg = {
      to: user.email,
      from: Config.MAILER.EMAIL,
      subject: title,
      html: `<p>${message}</p><p><a href="${slug}">Learn more</a></p>`,
    };
    await sgMail.send(msg);
  }
};

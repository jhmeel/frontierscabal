import webPush from "web-push";
import { Config } from "../config/config.js";
import catchAsync  from "../middlewares/catchAsync.js";
import cron from "node-cron";
import { User} from "../models/userModel.js";
import { Event} from "../models/eventModel.js";
import { PushSubscription } from "../models/pushSubscriptionModel.js";
import { logger} from "../utils/logger.js";
import { generateNotification } from "../utils/notificationGen.js";

webPush.setVapidDetails(
  Config.WEBPUSH.VAPID_SUBJECT,
  Config.WEBPUSH.VAPID_PUBLIC_KEY,
  Config.WEBPUSH.VAPID_PRIVATE_KEY
); 
export const newPushSubscription = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    logger.info("user not found for new push subscription"); 
    return;
  } else if (!req.body.endpoint) {
    logger.info(`Invalid push subscription payload from ${user.username}`);
    return res.sendStatus(400); 
  }
  const subExist = await PushSubscription.findOne({ username: user.username });

  if (subExist) {
    subExist.subscription = JSON.stringify(req.body)
    await subExist.save()
    return res.sendStatus(201);
  } else {
    const subPayload = {
      username: user.username,
      subscription: JSON.stringify(req.body),
    };
    await PushSubscription.create(subPayload);
    res.sendStatus(200);
  }

});

export const notifyUser = async (username, payload) => {
  try {
    const user = await PushSubscription.findOne({ username });
    if (!user || !user?.subscription) {
      return;
    }
    const pushSub = JSON.parse(user.subscription);
    const parsedUrl = new URL(pushSub.endpoint);
    const ent = `${parsedUrl.protocol}//${parsedUrl.hostname}`;
    const vapidHeader = webPush.getVapidHeaders(
      ent,
      Config.WEBPUSH.VAPID_SUBJECT,
      Config.WEBPUSH.VAPID_PUBLIC_KEY,
      Config.WEBPUSH.VAPID_PRIVATE_KEY,
      "aes128gcm"
    );
    await webPush
      .sendNotification(pushSub, JSON.stringify(payload), {
        headers: vapidHeader,
      })
      .then(() => {
        logger.info(`Done notifying ${user.username}`);
      });
  } catch (err) {
    logger.error(err)
  }

};

export const notifyAll = async (payload) => {
  const users = await PushSubscription.find();

  try {
    await Promise.all(
      users
        .filter(
          (user) =>
            user.username !==
            (payload?.postedBy?.username || payload?.createdBy?.username)
        )
        .map(async (user) => {
          const pushSub = JSON.parse(user.subscription);
          const parsedUrl = new URL(pushSub.endpoint);
          const ent = `${parsedUrl.protocol}//${parsedUrl.hostname}`;
          const vapidHeader = webPush.getVapidHeaders(
            ent,
            Config.WEBPUSH.VAPID_SUBJECT,
            Config.WEBPUSH.VAPID_PUBLIC_KEY,
            Config.WEBPUSH.VAPID_PRIVATE_KEY,
            "aes128gcm"
          );
          await webPush
            .sendNotification(pushSub, JSON.stringify(payload), {
              headers: vapidHeader,
            })
            .then(() => {
              logger.info(`Done notifying ${user.username}`);
            });
        })
    );
    logger.info("Done notifying all frontiers");
  } catch (err) {
    logger.error(err);
  }
};

export const notifyforOngoingEvent = () => {
  cron.schedule(
    "0 0 * * *",
    async () => {
      try {
        const currentDate = new Date();
        const events = await Event.find({
          startDate: { $gte: currentDate },
          endDate: { $gt: currentDate },
        })
          .populate("createdBy")
          .sort({ startDate: -1 });
        events &&
          events.map((event) => {
            const notPayload = generateNotification("ONGOING:EVENT", event);
            notifyAll(notPayload);
          });
        logger.info(
          `Done notifying frontiers for ${events?.length} ongoing events`
        );
      } catch (err) {
        logger.error(err);
      }
    },
    {
      scheduled: true,
      timezone: "Africa/Lagos",
    }
  );
};

export const parseNotificationPayload = (payload) => {
  return {
    title: payload.username,
    options: {
      body: payload.body,
      icon: payload.userAvatar,
      image: payload?.image,
      timestamp: payload.date || Date.now(),
      actions: [
        {
          action: payload.action || "view",
          type: payload.actionType || "button",
          title: payload.actionTitle || "View",
          icon: payload?.actionIcon,
        },
      ],
    },
  };
};




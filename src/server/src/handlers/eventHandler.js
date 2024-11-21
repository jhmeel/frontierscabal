import { User } from "../models/userModel.js";
import { Event } from "../models/eventModel.js";
import catchAsync from "../middlewares/catchAsync.js";
import cloudinary from "cloudinary";
import { ErrorHandler } from "./errorHandler.js";
import { generateNotification } from "../utils/notificationGen.js";
import { notifyAllUser } from "../utils/sendNotification.js";
import cron from "node-cron";
import { logger } from "../utils/logger.js";

export const newEvent = catchAsync(async (req, res, next) => {
  const { title, description, category, startDate, endDate, avenue } = req.body;

  const myCloud = await cloudinary.v2.uploader.upload(req?.body?.avatar, {
    folder: "EventAvatars",
    resource_type: "auto",
  });

  const event = await Event.create({
    title,
    description,
    category,
    startDate,
    endDate,
    avenue,
    createdBy: req?.user._id,
    avatar: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
  });

  const user = await User.findById(req?.user._id);
  user.events.push(event._id);
  await user.save();

  const populatedEvent = await Event.findById(event._id).populate("createdBy");

  res.status(201).json({
    success: true,
    message: "Event created successfully",
    event,
  });

  const notPayload = generateNotification("NEW:EVENT", populatedEvent);

  await notifyAllUser(notPayload, [`email`, `push`]);
});

export const getUpcomingEvents = catchAsync(async (req, res, next) => {
  const currentDate = new Date();
  const event = await Event.find({
    startDate: { $gt: currentDate },
    endDate: { $gt: currentDate },
  }).populate("createdBy");
  res.status(200).json({
    success: true,
    event,
  });
});

export const getEventDetails = catchAsync(async (req, res, next) => {
  const event = await Event.findOne({ slug: req.params.slug }).populate(
    "createdBy"
  );
  res.status(200).json({
    success: true,
    event,
  });
});

export const getOngoingEvents = catchAsync(async (req, res, next) => {
  const currentDate = new Date();
  const event = await Event.find({
    startDate: { $lte: currentDate },
    endDate: { $gte: currentDate },
  })
    .populate("createdBy")
    .sort({ startDate: -1 });

  res.status(200).json({ success: true, event });
});

export const getRecentEvents = catchAsync(async (req, res, next) => {
  //get events with endDate less than one week ago
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const event = await Event.find({
    startDate: { $lte: new Date() },
    endDate: { $gte: oneWeekAgo },
  })
    .populate("createdBy")
    .sort({ endDate: -1 });

  res.status(200).json({ success: true, event });
});

export const getEventByCategory = catchAsync(async (req, res, next) => {
  const category = req.params.category;
  const event = await Event.find({ category }).populate("createdBy");
  res.status(200).json(event);
});

export const updateEventById = catchAsync(async (req, res, next) => {
  const event = await Event.findById(req.params?.id);
  if (!event) {
    return next(new ErrorHandler("Event Not Found", 404));
  }
  const { title, description, category, date, avenue } = req.body;

  const newData = {
    title,
    description,
    category,
    avenue,
    date,
  };
  if (req.body?.avatar && !req?.body?.avatar?.startsWith("http")) {
    await cloudinary.v2.uploader.destroy(event.avatar.public_id);

    const myCloud = await cloudinary.v2.uploader.upload(req.body?.avatar, {
      folder: "EventAvatars",
    });

    newData.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

  await Event.findByIdAndUpdate(req.params.id, newData, {
    new: true,
    runValidators: true,
    useFindAndModify: true,
  });
  res.status(200).json({
    success: true,
    message: "updated successfully",
  });
});

export const deleteEventById = catchAsync(async (req, res, next) => {
  const event = await Event.findById(req.params.id);

  const userId = req.user._id.toString();
  const postedById = event.createdBy.toString();
  const superAdmin = await User.findOne({ role: "FC:SUPER:ADMIN" });
  if (postedById !== userId && userId !== superAdmin._id.toString()) {
    return next(new ErrorHandler("Unauthorized", 401));
  }
  if (event.avatar && event.avatar.public_id) {
    await cloudinary.v2.uploader.destroy(event.avatar.public_id);
  }

  await Event.findByIdAndDelete(req.params.id);
  const user = await User.findById(req?.user._id);
  const evIndex = user.events.indexOf(req.params.id);
  user.events.splice(evIndex, 1);
  await user.save();

  res.status(200).json({ success: true });
});

export const initOngoingEventNotificationJob = () => {
  logger.debug(
    `Initialzed ongoing events notification job at ${new Date().toLocaleString(
      "en-US",
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    )}`
  );
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
          events.map(async (event) => {
            const notPayload = generateNotification("ONGOING:EVENT", event);
            await notifyAllUser(notPayload, [`email`, `push`]);
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

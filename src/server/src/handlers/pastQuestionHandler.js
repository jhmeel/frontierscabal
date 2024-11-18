import catchAsync from "../middlewares/catchAsync.js";
import { ErrorHandler } from "./errorHandler.js";
import { pdfGen } from "../utils/pdfGen.js";
import cloudinary from "cloudinary";
import axios from "axios";
import { User } from "../models/userModel.js";
import { PastQuestion } from "../models/pastQuestionModel.js";
import { Config } from "../config/config.js";

export const newPastQuestion = catchAsync(async (req, res, next) => {
  const {
    courseTitle,
    level,
    courseCode,
    school,
    session,
    pqImg,
    answer,
    reference,
    logo,
    pqImgTotal,
  } = req.body;
  const pqImages = [];

  for (let i = 0; i < pqImgTotal; i++) {
    pqImages.push(req.body[`pqImg${i}`]);
  }
  const result = await pdfGen(
    pqImg ? pqImg : pqImages,
    courseTitle,
    courseCode,
    level,
    session,
    school,
    answer,
    reference,
    logo
  );

  const pastQuestionData = {
    courseTitle,
    courseCode,
    school,
    level,
    session,
    isAnswered: answer ? true : false,
    pdfFile: {
      public_id: result.public_id,
      url: result.secure_url,
    },
    postedBy: req?.user._id,
  };

  const pastQuestion = await PastQuestion.create(pastQuestionData);
  const user = await User.findById(req?.user._id);
  user.pastquestions.push(pastQuestion._id);
  await user.save();

  res.status(200).json({
    success: true,
    message: "pastQuestion created successfully.",
    pastQuestion,
  });
});

export const downloadPastQuestionById = catchAsync(async (req, res, next) => {
  const pastQuestion = await PastQuestion.findById(req.params.id);
  if (!pastQuestion) {
    return next(new ErrorHandler("Past question not found", 404));
  }
  const user = await User.findById(req.user._id);

  if (Config.SUBSCRIPTION.ACTIVE) {
    if (
      user.subscriptionDue !== false &&
      user.dailyFreeDownloadCount >=
        Config.SUBSCRIPTION.PLANS.FREE.DAILY_MAX_DOWNLOADS &&
      !["FC:SUPER:ADMIN", "FC:ADMIN"].includes(user.role)
    ) {
      return next(
        new ErrorHandler("Please Subscribe To download The Document!", 401)
      );
    }
  }

  const publicId = pastQuestion?.pdfFile.public_id;
  if (!publicId) {
    return next(
      new ErrorHandler("PDF file not found for this past question", 404)
    );
  }

  cloudinary.v2.api.resource(publicId, async (error, result) => {
    if (error) {
      return next(new ErrorHandler(error.message));
    }

    const pdfUrl = result.secure_url;

    try {
      const response = await axios({
        method: "GET",
        url: pdfUrl,
        responseType: "stream",
      });
      pastQuestion.downloads += 1;
      await pastQuestion.save();


      //update daily free count for freemium users
      if (Config.SUBSCRIPTION.ACTIVE && user.subscriptionDue !== false) {
        user.dailyFreeDownloadCount += 1;
        await user.save();
      }

      res.set("Content-Disposition", `attachment; filename=${publicId}`);
      res.set("Content-Type", "application/pdf");
      res.set("Content-Length", response.headers["content-length"]);
      response.data.pipe(res);
    } catch (error) {
      return next(new ErrorHandler(error.message));
    }
  });
});

export const deletePastQuestionById = catchAsync(async (req, res, next) => {
  const pastQuestion = await PastQuestion.findById(req.params.id);
  if (!pastQuestion) {
    return next(new ErrorHandler("Past question not found", 404));
  }
  const superAdmin = await User.findOne({ role: "FC:SUPER:ADMIN" });
  // Check if the user is authorized to delete the past question
  if (
    pastQuestion.postedBy.toString() !== req?.user._id.toString() &&
    req?.user._id.toString() !== superAdmin._id.toString()
  ) {
    return next(
      new ErrorHandler("Unauthorized to delete this past question", 401)
    );
  }

  await cloudinary.v2.uploader.destroy(pastQuestion.pdfFile?.public_id);
  // Delete the past question entry
  await PastQuestion.findByIdAndDelete(req.params.id);
  const user = await User.findById(req?.user._id);
  const pqIndex = user.pastquestions.indexOf(req.params.id);
  user.pastquestions.splice(pqIndex, 1);
  await user.save();

  res.status(200).json({
    success: true,
    message: "Past question deleted successfully",
  });
});

export const pastQuestionDetails = catchAsync(async (req, res, next) => {
  const pqDetails = await PastQuestion.findById(req.params?.id);
  if (!pqDetails) {
    return next(new ErrorHandler("pastQuestion Not found", 404));
  }
  res.status(200).json({
    success: true,
    details: pqDetails,
  });
});
// Define the search route
export const searchPastQuestionByCourseSessionAndLevel = catchAsync(
  async (req, res, next) => {
    const { courseTitle, session, level, page } = req.query;
    const pageSize = 15; // Number of results per page

    const query = await PastQuestion.find({
      courseTitle: { $in: courseTitle },
      session: { $in: session },
      level: { $in: level },
    })
      .populate("postedBy")
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .exec();

    const totalResults = query.length;
    const totalPages = Math.ceil(totalResults / pageSize);

    res.status(200).json({
      pastQuestions: query,
      totalPages: totalPages,
    });
  }
);

export const searchByCourseTitle = catchAsync(async (req, res, next) => {
  const courseTitle = req.query?.courseTitle;

  const pageSize = 15;

  const query = await PastQuestion.find({
    courseTitle: { $in: courseTitle },
  })
    .populate("postedBy")
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .exec();

  const totalResults = query.length;
  const totalPages = Math.ceil(totalResults / pageSize);

  res.status(200).json({
    pastQuestions: query,
    totalPages: totalPages,
  });
});

export const searchByCourseTitleAndSession = catchAsync(
  async (req, res, next) => {
    const { courseTitle, session, page } = req.query;
    const pageSize = 15;

    const query = await PastQuestion.find({
      courseTitle: { $in: courseTitle },
      session: { $in: session },
    })
      .populate("postedBy")
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .exec();

    const totalResults = query.length;
    const totalPages = Math.ceil(totalResults / pageSize);

    res.status(200).json({
      pastQuestions: query,
      totalPages: totalPages,
    });
  }
);

export const searchByCourseTitleAndLevel = catchAsync(
  async (req, res, next) => {
    const { courseTitle, level, page } = req.query;
    const pageSize = 15;

    const query = await PastQuestion.find({
      courseTitle: { $in: courseTitle },
      level: { $in: level },
    })
      .populate("postedBy")
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .exec();

    const totalResults = query.length;
    const totalPages = Math.ceil(totalResults / pageSize);

    res.status(200).json({
      pastQuestions: query,
      totalPages: totalPages,
    });
  }
);

export const getMostRecents = catchAsync(async (req, res, next) => {
  const { page } = req.query;
  const pageSize = 15;

  const query = await PastQuestion.find()
    .populate("postedBy")
    .sort({ createdAt: -1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .exec();

  const totalResults = query.length;
  const totalPages = Math.ceil(totalResults / pageSize);

  res.status(200).json({
    pastQuestions: query,
    totalPages: totalPages,
  });
});

import { User} from "../models/userModel.js";
import { CourseMaterial} from "../models/courseMaterialModel.js";
import catchAsync from "../middlewares/catchAsync.js";
import {ErrorHandler} from "./errorHandler.js";
import cloudinary from "cloudinary";
import axios from "axios";


export const newCourseMaterial = catchAsync(async (req, res, next) => {
  const { courseTitle, level, courseCode, session, file } = req.body;

  const result = await cloudinary.v2.uploader.upload(file, {
    folder: "courseMaterial",
    overwrite: true,
  });

  const courseMaterialData = {
    courseTitle,
    courseCode,
    level,
    session,
    file: {
      public_id: result?.public_id,
      url: result?.secure_url,
    },
    postedBy: req?.user._id,
  };

  const courseMaterial = await CourseMaterial.create(courseMaterialData);
  const user = await User.findById(req?.user._id);
  user.courseMaterial.push(courseMaterial._id);
  await user.save();

  res.status(200).json({
    success: true,
    message: "course material created successfully.",
    courseMaterial,
  });
});

export const downloadCourseMaterialById = catchAsync(async (req, res, next) => {
  const courseMaterial = await CourseMaterial.findById(req.params.id);
  if (!courseMaterial) {
    return next(new ErrorHandler("Document not found", 404));
  }

  // const user = await User.findById(req.user._id);

  // if (
  //   user.subscriptionDue !== false &&
  //   user.tokenBalance <= 0 &&
  //   !["FC:SUPER:ADMIN", "FC:ADMIN"].includes(user.role)
  // ) {
  //   return next(
  //     new ErrorHandler("Please Subscribe To Access The Document!", 401)
  //   );
  // }

  const publicId = courseMaterial?.file.public_id;
  if (!publicId) {
    return next(new ErrorHandler("Document not found", 404));
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
      courseMaterial.downloads += 1;
      await courseMaterial.save();

      // if (
      //   !["FC:SUPER:ADMIN", "FC:ADMIN"].includes(user.role) &&
      //   user.tokenBalance > 0
      // ) {
      //   user.tokenBalance -= 3;
      // }

      // await user.save();

      res.set("Content-Disposition", `attachment; filename=${publicId}`);
      res.set("Content-Length", response.headers['content-length'])
      res.set("Content-Type", "application/pdf");
      response.data.pipe(res);
    } catch (error) {
      return next(new ErrorHandler(error.message));
    }
  });
});

export const deleteCourseMaterialById = catchAsync(async (req, res, next) => {
  const courseMaterial = await CourseMaterial.findById(req.params.id);
  if (!courseMaterial) {
    return next(new ErrorHandler("Document not found", 404));
  }
  const superAdmin = await User.findOne({ role: "FC:SUPER:ADMIN" });
  // Check if the user is authorized to delete the past question
  if (
    courseMaterial.postedBy.toString() !== req?.user._id.toString() &&
    req?.user._id.toString() !== superAdmin._id.toString()
  ) {
    return next(
      new ErrorHandler('"Unauthorized to delete this document"', 401)
    );
  }

  await cloudinary.v2.uploader.destroy(courseMaterial.file?.public_id);

  // Delete the past question entry
  await CourseMaterial.findByIdAndDelete(req.params.id);

  const user = await User.findById(req?.user._id);
  const courseIndex = user.courseMaterial.indexOf(req.params.id);
  user.courseMaterial.splice(courseIndex, 1);
  await user.save();

  res.status(200).json({
    success: true,
    message: "Document deleted successfully",
  });
});

export const CourseMaterialDetails = catchAsync(async (req, res, next) => {
  const courseMaterial = await CourseMaterial.findById(req.params?.id);
  if (!courseMaterial) {
    return next(new ErrorHandler("Document Not found", 404));
  }
  res.status(200).json({
    success: true,
    details: courseMaterial,
  });
});
// Define the search route
export const searchCourseMaterialByCourseSessionAndLevel = catchAsync(
  async (req, res, next) => {
    const { courseTitle, session, level, page } = req.query;
    const pageSize = 15; // Number of results per page

    const query = await CourseMaterial.find({
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
      courseMaterial: query,
      totalPages: totalPages,
    });
  }
);

export const getMostRecentsDoc = catchAsync(async (req, res, next) => {
  const { page } = req.query;
  const pageSize = 15;

  const query = await CourseMaterial.find()
    .populate("postedBy")
    .sort({ createdAt: -1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .exec();

  const totalResults = query.length;
  const totalPages = Math.ceil(totalResults / pageSize);

  res.status(200).json({
    courseMaterial: query,
    totalPages: totalPages,
  });
});

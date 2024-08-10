import { User} from "../models/userModel.js";
import { Module} from "../models/moduleModel.js";
import {Lesson} from "../models/lessonModel.js";
import catchAsync from "../middlewares/catchAsync.js";
import cloudinary from "cloudinary";
import { ErrorHandler} from "./errorHandler.js"
import axios from 'axios';


export const createLesson = catchAsync(async (req, res, next) => {

  const user = await User.findById(req.user._id)

  if (!user) {
    return next(new ErrorHandler('user not found!', 404))
  }

  const { moduleId } = req.params;
  if (!moduleId) {
    return next(new ErrorHandler('Module id is required!', 400))
  }
  const module = await Module.findById(moduleId)

  if (!module) {
    return next(new ErrorHandler('Module not found!', 404))
  }

  const { lessonTitle, lessonIndex, lessonAim, lessonUrl, lessonMaterial } = req.body;

  if (!lessonTitle || !lessonIndex || !lessonUrl || !lessonAim) {
    return next(new ErrorHandler(`Missing Lesson Props– lessonTitle, lessonIndex, lessonAim and lessonUrl, are all required!`, 400))
  }


  const { secure_url, public_id } = await cloudinary.v2.uploader.upload(lessonMaterial, {
    folder: 'LessonMaterials',
    resource_type: "auto",
  })

  if (secure_url && public_id) {
    const lesson = await Lesson.create({
      lessonTitle,
      lessonIndex,
      lessonAim,
      lessonUrl,
      lessonMaterial: {
        secureUrl: secure_url,
        publicId: public_id
      },
      tutor: user._id,
    })

    lesson && await module.newLesson(lesson);

    user.lessons.push(lesson._id)

    await user.save()
  }

  res.status(200).json({
    success: true,
    message: 'Lesson created successfully!'
  })

})



export const updateLesson = catchAsync(async (req, res, next) => {

  const lesson = await Lesson.findById(req.params?.lessonId);
  if (!lesson) {
    return next(new ErrorHandler("Lesson Not Found!", 404));
  }
  const { lessonTitle, lessonIndex, lessonAim, lessonUrl } = req.body;

  if (!lessonTitle || !lessonIndex || !lessonUrl || !lessonAim) {
    return next(new ErrorHandler(`Missing Lesson Props– lessonTitle, lessonIndex, lessonAim and lessonUrl, are all required!`, 400))
  }

  const newData = {
    lessonTitle,
    lessonIndex,
    lessonAim,
    lessonUrl,
  };

  if (req.body?.lessonMaterial) {
    await cloudinary.v2.uploader.destroy(lesson.lessonMaterial.publicId);

    const myCloud = await cloudinary.v2.uploader.upload(req.body?.lessonMaterial, {
      folder: "lessonMaterials",
    });

    newData.lessonMaterial = {
      publicId: myCloud.public_id,
      secureUrl: myCloud.secure_url,
    };
  }

  await Lesson.findByIdAndUpdate(req.params.lessonId, newData, {
    new: true,
    runValidators: true,
    useFindAndModify: true,
  });

  res.status(200).json({
    success: true,
    message: "Lesson updated successfully",
  });
});





export const deleteLesson = catchAsync(async (req, res, next) => {
  const { moduleId, lessonId } = req.query;
  if (!moduleId || !lessonId) {
    return next(new ErrorHandler("LessonId and ModuleId are both required!", 400));
  }

  const lesson = await Lesson.findById(lessonId);

  if (!lesson) {
    return next(new ErrorHandler("Lesson Not Found!", 404));
  }

  const module = await Module.findById(moduleId)

  if (!module) {
    return next(new ErrorHandler("Lesson Not Found!", 404));
  }


  const userId = req.user._id.toString();
  const tutorId = lesson.tutor.toString();

  const superAdmin = await User.findOne({ role: "FC:SUPER:ADMIN" });

  if (tutorId !== userId && userId !== superAdmin._id.toString()) {
    return next(new ErrorHandler("Unauthorized", 401));
  }

  if (lesson.lessonMaterial && lesson.lessonMaterial.publicId) {
    await cloudinary.v2.uploader.destroy(lesson.lessonMaterial.publicId);
  }

  await Lesson.findByIdAndDelete(lessonId);

  const user = await User.findById(userId);
  user.lessons.pull(lessonId);
  await user.save();

  await module.deleteLesson(lessonId)


  res.status(200).json({
    success: true,
    message: "Lesson Deleted Successfully!"
  })
})

//lessonId
export const getLessonById = catchAsync(async (req, res, next) => {

  const lesson = await Lesson.findById(req.params?.lessonId).populate('tutor')

  res.status(200).json({
    success: true,
    lesson: lesson 
  })
})


export const downloadLessonMaterial = catchAsync(async (req, res, next) => {
  const { lessonId } = req.params

  if (!lessonId) {
    return next(new ErrorHandler('lesson id is required!', 400))
  }

  const lesson = await Lesson.findById(lessonId);
  if (!lesson) {
    return next(new ErrorHandler("Lesson not found", 404));
  }

  const publicId = lesson.lessonMaterial.publicId;

  if (!publicId) {
    return next(
      new ErrorHandler("Material not found for this lesson", 404)
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

      res.set("Content-Disposition", `attachment; filename=${publicId}`);

      res.set("Content-Type", "application/pdf");
      res.set("Content-Length", response.headers['content-length'])
      response.data.pipe(res);
    } catch (error) {
      return next(new ErrorHandler(error.message));
    }

  });

})


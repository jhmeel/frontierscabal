import catchAsync from "../middlewares/catchAsync.js";
import { User } from "../models/userModel.js";
import { Article } from "../models/articleModel.js";
import { Event } from "../models/eventModel.js";
import { PastQuestion } from "../models/pastQuestionModel.js";
import { CourseMaterial } from "../models/courseMaterialModel.js";
import { Module } from "../models/moduleModel.js";
import { Lesson } from "../models/lessonModel.js";
import { ErrorHandler } from "./errorHandler.js";
import { Config } from "../config/config.js";

export const getActiveUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    users,
  });
});

export const newAdmin = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ username: req.params.username });
  if (!user) {
    return next(ErrorHandler("user not found", 404));
  }
  user.role = "FC:ADMIN";
  await user.save();
  res.status(200).json({
    success: true,
  });
});

export const getAdmins = catchAsync(async (req, res, next) => {
  const admins = await User.find({ role: "FC:ADMIN" }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    admins,
  });
});

export const removeAdmin = catchAsync(async (req, res, next) => {
  const admin = await User.findOne({ username: req.params.username });
  if (!admin) {
    return next(ErrorHandler("Admin not found", 404));
  }
  admin.role = "FC:USER";
  await admin.save();
  res.status(200).json({
    success: true,
  });
});

export const aggregate = catchAsync(async (req, res, next) => {
  const totalUsers = await User.countDocuments();
  const totalPastquestions = await Pastquestion.countDocuments();
  const totalEvents = await Event.countDocuments();
  const totalArticles = await Article.countDocuments();
  const totalCourseMaterials = await CourseMaterial.countDocuments();
  res.status(200).json({
    success: true,
    totalEvents,
    totalUsers,
    totalArticles,
    totalPastquestions,
    totalCourseMaterials,
    billerStatus: Config.BILLER.is_active,
  });
});

export const getSuggestion = catchAsync(async (req, res, next) => {
  const suggestions = new Set();

  // Fetch data concurrently
  const [users, pastQuestions, modules, lessons, courses] = await Promise.all([
    User.find().select("username"),
    PastQuestion.find().select("courseTitle"),
    Module.find().select("title"),
    Lesson.find().select("lessonTitle"),
    CourseMaterial.find().select("courseTitle"),
  ]);

  users.forEach((user) => suggestions.add(user.username));
  pastQuestions.forEach((pq) => suggestions.add(pq.courseTitle));
  modules.forEach((module) => suggestions.add(module.title));
  lessons.forEach((lesson) => suggestions.add(lesson.lessonTitle));
  courses.forEach((course) => suggestions.add(course.courseTitle));

  res.status(200).json({
    success: true,
    suggestions: Array.from(suggestions),
  });
});

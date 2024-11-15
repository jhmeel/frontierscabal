import express from "express";
import { authenticator } from "../middlewares/authenticator.js";
import {
  downloadLessonMaterial,
  getLessonById,
  updateLesson,
  createLesson,
  deleteLesson,
} from "../handlers/lessonHandler.js";
import {
  deleteModule,
  getModules,
  getModuleById,
  getModuleLessons,
  updateModule,
  createModule,
} from "../handlers/moduleHandler.js";

const Module = express();


Module.route("/module/new").post(authenticator, createModule);

Module.route("/module/update/:moduleId").put(authenticator, updateModule);

Module.route("/module/:moduleId").get(authenticator, getModuleById);

Module.route("/module/delete/:moduleId").delete(authenticator, deleteModule);

Module.route("/module/lessons/:moduleId").get(getModuleLessons);

Module.route("/modules").get(getModules);

Module.route("/module/lesson/new/:moduleId").post(authenticator, createLesson);

Module.route("/module/lesson/update/:lessonId").put(
  authenticator,
  updateLesson
);

//?moduleId=&lessonId=
Module.route("/module/lesson/delete").delete(authenticator, deleteLesson);

Module.route("/module/lesson/:lessonId").get(getLessonById);

Module.route("/module/lesson/download/:lessonId").get(
  authenticator,
  downloadLessonMaterial
);

export { Module };

import express from "express";
import { newCourseMaterial } from "../handlers/courseMaterialHandler.js";
import { downloadCourseMaterialById } from "../handlers/courseMaterialHandler.js";
import { deleteCourseMaterialById } from "../handlers/courseMaterialHandler.js";
import { getMostRecentsDoc } from "../handlers/courseMaterialHandler.js";
import { CourseMaterialDetails } from "../handlers/courseMaterialHandler.js";
import { searchCourseMaterialByCourseSessionAndLevel } from "../handlers/courseMaterialHandler.js";
import { RestrictTo } from "../middlewares/restrictTo.js";
import { authenticator } from "../middlewares/authenticator.js";




const CourseMaterial = express();
CourseMaterial.route("/course-material/new").post(
  authenticator,
  RestrictTo("FC:ADMIN", "FC:SUPER:ADMIN"),
  newCourseMaterial
);

CourseMaterial.route("/course-material/download/:id").get(
  downloadCourseMaterialById
);

CourseMaterial.route("/course-material/:id").delete(
  authenticator,
  deleteCourseMaterialById
);

CourseMaterial.route("/course-material/detail/:id").get(
  authenticator,
  CourseMaterialDetails
);

//GET /search?courseTitle=biology&session=2019/2022&level=200&page=1
CourseMaterial.route("/search/course-material/CTSAL").get(
  searchCourseMaterialByCourseSessionAndLevel
);

CourseMaterial.route("/search/course-material/recent").get(getMostRecentsDoc);
export { CourseMaterial };

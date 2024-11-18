import express from "express";
import { newPastQuestion } from "../handlers/pastQuestionHandler.js";
import { pastQuestionDetails } from "../handlers/pastQuestionHandler.js";
import { downloadPastQuestionById } from "../handlers/pastQuestionHandler.js";
import { deletePastQuestionById } from "../handlers/pastQuestionHandler.js";
import { searchByCourseTitle } from "../handlers/pastQuestionHandler.js";
import { searchByCourseTitleAndLevel } from "../handlers/pastQuestionHandler.js";
import { searchByCourseTitleAndSession } from "../handlers/pastQuestionHandler.js";
import { getMostRecents } from "../handlers/pastQuestionHandler.js";
import { searchPastQuestionByCourseSessionAndLevel } from "../handlers/pastQuestionHandler.js";
import { authenticator } from "../middlewares/authenticator.js";
import { RestrictTo } from "../middlewares/restrictTo.js";
import { checkmateSubscription } from "../middlewares/subMiddleware.js";

const PastQuestion = express();

PastQuestion.route("/past-question/new").post(
  authenticator,
  RestrictTo("FC:ADMIN", "FC:SUPER:ADMIN"),
  newPastQuestion
);

PastQuestion.route("/past-question/download/:id").get(
  authenticator,
  downloadPastQuestionById
);

PastQuestion.route("/past-question/:id").delete(
  authenticator,
  deletePastQuestionById
);

PastQuestion.route("/past-question/detail/:pastQuestionId").get(
  authenticator,
  pastQuestionDetails
);

//GET /search?courseTitle=biology&session=2019/2022&level=200&page=1
PastQuestion.route("/past-question/search/CTSAL").get(
  searchPastQuestionByCourseSessionAndLevel
);
//GET /search?courseTitle=biology&session=2009/2010&page=1
PastQuestion.route("/past-question/search/CTAL").get(
  searchByCourseTitleAndLevel
);
//GET /search?courseTitle=biology&session=2019/2022&level=200&page=1
PastQuestion.route("/past-question/search/CTAS").get(
  searchByCourseTitleAndSession
);
//GET /search?courseTitle=anatomy&page=1
PastQuestion.route("/past-question/search/title").get(searchByCourseTitle);
//GET /search?categories=anatomy,biochemistry,physics&page=1
PastQuestion.route("/past-question/search/recent").get(getMostRecents);
export { PastQuestion };

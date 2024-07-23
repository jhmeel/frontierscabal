import { User} from "../models/userModel.js";
import { Article} from "../models/articleModel.js";
import { Event} from "../models/eventModel.js";
import { PastQuestion} from "../models/pastQuestionModel.js";
import { CourseMaterial} from "../models/courseMaterialModel.js";
import { Module} from "../models/moduleModel.js";
import {Lesson} from "../models/lessonModel.js";
import  catchAsync from "../middlewares/catchAsync.js";


const searchCabal = catchAsync(async (req, res, next) => {
  const query = req.query?.q;
  const users = await User.find({ $text: { $search: query } });
  const articles = await Article.find({ $text: { $search: query } }).populate(
    "postedBy"
  );
  const events = await Event.find({ $text: { $search: query } }).populate(
    "createdBy"
  );
  const courseMaterials = await CourseMaterial.find({ $text: { $search: query } }).populate(
    "postedBy"
  );
  const pastQuestions = await PastQuestion.find({ $text: { $search: query } }).populate(
    "postedBy"
  );

  const modules = await Module.find({ $text: { $search: query } }).populate("createdBy");

  const lessons = await Lesson.find({ $text: { $search: query } }).populate("tutor");


  res.status(200).json({
    users,
    articles,
    events,
    pastQuestions,
    courseMaterials,
    modules,
    lessons,
  });
});

export default searchCabal;

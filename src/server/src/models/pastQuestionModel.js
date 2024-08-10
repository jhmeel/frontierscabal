import mongoose from "mongoose";

const pastQuestionSchema = new mongoose.Schema({
  courseTitle: {
    type: String,
    required: true,
    trim: true,
  },
  courseCode: {
    type: String,
    trim: true,
  },
  level: {
    type: String,
    required: true,
    trim: true,
  },
  session: {
    type: String,
    required: true,
    trim: true,
  },
  school: {
    type: String,
    required: true,
    trim: true,
  },
  pdfFile: {
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  isAnswered: {
    type: Boolean,
    default: false,
  },
  downloads: {
    type: Number,
    default: 0,
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
pastQuestionSchema.index({
  courseTitle: "text",
  courseCode: "text",
  school: "text",
  session: "text",
  level: "text",
});
const PastQuestion = mongoose.model("PastQuestionModel", pastQuestionSchema);
export { PastQuestion };

import mongoose from "mongoose";

const courseMaterialSchema = new mongoose.Schema({
  courseTitle: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  courseCode: {
    type: String,
    trim: true,
  },
  session: {
    type: String,
    required: true,
    trim: true,
  },
  level: {
    type: String,
    required: true,
    trim: true,
  },
  file: {
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
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

courseMaterialSchema.index({
  courseTitle: "text",
  courseCode: "text",
  level: "text",
  session: "text",
});
const CourseMaterial = mongoose.model("CourseMaterial", courseMaterialSchema);
export { CourseMaterial };

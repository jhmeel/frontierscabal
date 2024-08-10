import mongoose, { Schema } from "mongoose";
import slugify from "slugify";

const EventSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  avenue: {
    type: String,
    required: true,
  },
  avatar: {
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});
EventSchema.pre("validate", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, {
      lower: true,
      strict: true,
    });
  }
  next();
});

EventSchema.index({
  title: "text",
  description: "text",
  avenue: "text",
  category: "text",
});
const Event = mongoose.model("Event", EventSchema);
export {Event};

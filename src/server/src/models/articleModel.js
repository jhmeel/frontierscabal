import mongoose, { Schema } from "mongoose";
import { marked } from "marked";
import slugify from "slugify";
import createDomPurify from "dompurify";
import { JSDOM } from "jsdom";
const dompurify = createDomPurify(new JSDOM().window);
import { readingTime } from "reading-time-estimator";
import { nestedCommentSchema } from "./nestedCommentModel.js";
import { ErrorHandler } from "../handlers/errorHandler.js";

const options = {
  mangle: false,
  headerIds: false,
};

marked.setOptions(options);

const articleSchema = new Schema({
  title: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  description: {
    type: String,
    trim: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["Custom", "Markdown"],
  },
  sanitizedHtml: {
    type: String,
    required: true,
  },
  readDuration: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  pinnedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  savedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  views: {
    type: Number,
    default: 0,
  },
  tags: {
    type: String,
    trim: true,
  },
  updatedAt: Date,
  comments: [nestedCommentSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

articleSchema.pre("validate", async function (next) {
  try {
    if (this.isModified("title")) {
      this.slug = slugify(this.title, {
        lower: true,
        strict: true,
      });
    }

    if (this.isModified("content")) {
      if (this.type === "Markdown") {
        const markdownContent = marked(this.content, { gfm: true });
        this.sanitizedHtml = await dompurify.sanitize(markdownContent);
      } else if (this.type === "Custom") {
        this.sanitizedHtml = await dompurify.sanitize(this.content);
      }
    }

    const { text } = readingTime(this.content);
    this.readDuration = text;
    next();
  } catch (err) {
    next(new ErrorHandler(err?.message));
  }
});
articleSchema.index({
  title: "text",
  category: "text",
  description: "text",
  content: "text",
  tags: "text",
});
const Article = mongoose.model("Article", articleSchema);
export { Article };

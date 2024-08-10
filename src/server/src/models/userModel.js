import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { Config } from "../config/config.js";
import crypto from "crypto"

const { RESET_PASSWORD_EXPIRY } = Config.RESET_PASSWORD

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true, 
    minlength: 3,
    maxlength: 15,
    trim: true,
  }, 
  email: { 
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please enter a valid email",
    ],
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    trim: true,
  },
  phonenumber: {
    type: String,
    required: true,
    trim: true,
  },
  referralCode: {
    type: String,
    unique: true,
    default: () => crypto.randomBytes(10).toString("hex"),
  },
  role: {
    type: String,
    enum: ["FC:USER", "FC:ADMIN", "FC:SUPER:ADMIN"],
    default: "FC:USER",
  },
  referredBy: {
    type: String,
    default: Config.NAME,
  },
  referralBonus: {
    type: Number,
    default: 0,
  },
  referredUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  bio: {
    type: String,
    maxlength: 300,
    default: "Welcome to my profile 🤗",
    trim: true,
  },
  avatar: {
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  school: {
    type: String,
    trim: true,
  },
  courseMaterial: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "CourseMaterial",
  }],
  subscriptionRef: [
    {
      amount: String,
      reference: String,
      date: Date,
    },
  ],
  pqFreeDownloadCount: {
    type: Number,
    default: 0,
  },
  pastquestions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pastquestion",
    },
  ],
  events: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },
  ],
  pinnedArticles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Article",
    },
  ],
  articles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Article",
    },
  ],
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  connections: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  lessons: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
    },
  ],
  savedArticles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Article",
    },
  ],
  tokenBalance: {
    type: Number,
    default: 0,
  },
  subscriptionDue: Boolean,
  resetPasswordToken: String,
  resetPasswordExpiry: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password")) {
      this.password = await bcrypt.hash(this.password, 10);
    }
    next();
  } catch (err) {
    next(err);
  }
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (err) {
    throw err
  }
};

UserSchema.methods.generateResetPasswordToken = function () {
  try {
    const resetToken = crypto.randomBytes(20).toString("hex");
    this.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    this.resetPasswordExpiry = RESET_PASSWORD_EXPIRY
    return resetToken;
  } catch (err) {
    throw err
  }
};

UserSchema.index({
  username: "text",
  bio: "text",
  school: "text",
  role: "text",
  phonenumber: "text",
});
const User = mongoose.model("User", UserSchema);

export { User };

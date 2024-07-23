import mongoose, { Schema } from 'mongoose';

const replySchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  replyText: {
    type: String,
    trim: true,
  },
  date: {
    type: Date,
    default: Date.now,
  }
});

const commentSchema = new Schema({
  commentText: {
    type: String,
    trim: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  replies: [replySchema],
});

const nestedCommentSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  comment: [commentSchema],
});

export {nestedCommentSchema };



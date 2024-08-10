import mongoose, { Schema } from 'mongoose';

const lessonSchema = new Schema({
  lessonTitle: {
    type: String,
    required: true,
  },
  lessonIndex: {
    type: Number,
    required: true,
  },
  lessonAim: {
    type: String, 
    required: true,
  },
  tutor: {
    type: mongoose.Types.ObjectId,
    ref: "User"
  },
  lessonMaterial: {
    secureUrl: String,
    publicId: String,
  },
  lessonUrl: {
    type: String,
    required: true,
  }
}, { timestamps: true });

lessonSchema.methods.getTutor = async function() {
  return this.populate('tutor').execPopulate();
};

lessonSchema.index({
  lessonTitle: "text",
  lessonAim: "text",
});

const Lesson = mongoose.model("Lesson", lessonSchema);

export {Lesson};

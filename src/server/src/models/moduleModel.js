import mongoose, { Schema } from 'mongoose'
import cloudinary from 'cloudinary'
import { User } from './userModel.js'
import { Lesson } from './lessonModel.js'

const deleteLesson = async (lesson) => {
  try {
    const materialPublicId = lesson.lessonMaterial?.publicId;
    if (materialPublicId) {
      await cloudinary.v2.uploader.destroy(materialPublicId);
    }

    const tutor = await User.findById(lesson?.tutor)

    if (tutor) {
      const lessonIndx = tutor.lessons.indexOf(lesson._id)
      lessonIndx && tutor.lessons.splice(lessonIndx, 1)
      await tutor.save()
    }

    await Lesson.findByIdAndDelete(lesson._id)
    return true
  } catch (err) {
    throw err
  }

}

const moduleSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    required: true,
  },
  lessonCount: {
    type: Number,
    default: 0,
  },
  enrolledBy: [{
    type: mongoose.Types.ObjectId,
    ref: "User"
  }],
  description: {
    type: String,
    required: true
  },
  avatar: {
    secureUrl: String,
    publicId: String,
  },
  lessons: [{
    type: mongoose.Types.ObjectId,
    ref: "Lesson"
  }],

  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: "User"
  },
  tutors: [{
    type: mongoose.Types.ObjectId,
    ref: "User"
  }]

}, { timestamps: true })

moduleSchema.methods.newLesson = async function (lesson) {
  if (lesson) {
    this.lessons.push(lesson._id)
    this.lessonCount += 1;
    if (!this.tutors.includes(lesson.tutor)) {
      this.tutors.push(lesson.tutor)
    }
    await this.save()
    return true
  }
  return false
}

moduleSchema.methods.deleteLesson = async function (id) {
  const lessonId = this.lessons.indexOf(id)
  if (!lessonId) {
    return { success: false, message: 'lesson not found!' }
  }
  this.lessons.splice(lessonId, 1)
  this.lessonCount -= 1;
  await this.save()
  return { success: true, message: 'Lesson deleted successfully!' }
}

moduleSchema.methods.addEnrollee = async function (id) {
  this.enrolledBy.push(id);
  await this.save()

}

moduleSchema.methods.getEnrollee = async function () {
  const enrollees = await User.find({ _id: { $in: this.enrolledBy } });
  return enrollees;
}

moduleSchema.methods.deleteAllLessons = async function () {
  for (const lesson of this.lessons) {
    await deleteLesson(lesson)
  }

  return true
}


moduleSchema.index({
  title: "text",
  description: "text",
  level: "text",
});


const Module = mongoose.model("Module", moduleSchema)



export { Module };
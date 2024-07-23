import mongoose, { Schema } from 'mongoose'
  
const pushSubscription = new Schema({ 
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  subscription: {
    type: String,
    trim: true,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
})

const PushSubscription = mongoose.model('PushSubscription', pushSubscription);
export {PushSubscription};


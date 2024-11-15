import { User } from '../models/userModel.js'
import  catchAsync from './catchAsync.js';
import { ErrorHandler } from '../handlers/errorHandler.js';
import { Config } from '../config/config.js';

const checkmateSubscription = catchAsync(async (req, res, next) => {

  try {
    const userId = req.user._id;
    const role = req.user.role;
    if (userId && role === 'FC:ADMIN' || userId && role === 'FC:SUPER:ADMIN') {
      return next()
    }

    const user = await User.findOne({ _id: userId, subscriptionDue: false });

    if (!user && Config.SUBSCRIPTION.ACTIVE) {
      return res.status(403).redirect('https://frontierscabal.com/#/billing')
    }

    next();
  } catch (error) {
    next(new ErrorHandler(`Error checking subscription: ${error.message}`))
  }
});


export { checkmateSubscription }
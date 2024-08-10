import { User } from '../models/userModel.js'
import  catchAsync from './catchAsync.js';
import { ErrorHandler } from '../handlers/errorHandler.js';

const checkSubscriptionMiddleware = catchAsync(async (req, res, next) => {

  try {
    const userId = req.user._id;
    const role = req.user.role;
    if (userId && role === 'FC:ADMIN' || userId && role === 'FC:SUPER:ADMIN') {
      return next()
    }

    const user = await User.findOne({ _id: userId, subscriptionDue: false });

    if (!user) {
      return res.status(403).redirect('https://frontierscabal.onrender.com/#/subscription/new')
    }

    next();
  } catch (error) {
    next(new ErrorHandler('Error checking subscription:', error))
  }
});


export { checkSubscriptionMiddleware }
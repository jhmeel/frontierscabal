import { User } from "../models/userModel.js";
import catchAsync from "../middlewares/catchAsync.js";
import { generateNotification } from "../utils/notificationGen.js";
import { sendNotification } from "../utils/sendNotification.js";
import { logger } from "../utils/logger.js";

export const onPaymentSuccess = catchAsync(async (req, res, next) => {
  const { amount, ref, plan } = req.body;
  if (!ref) {
    return next(new ErrorHandler("Payment ref is not provided", 422));
  } else if (!amount) {
    return next(new ErrorHandler("Paid amount is not provided", 422));
  } else if (Number(amount) < 1250) {
    return next(new ErrorHandler("Invalid amount", 422));
  }

  const user = await User.findById(req.user._id);

  user.subscriptionRef.push({
    amount,
    plan,
    reference: ref,
    date: new Date(),
  });
  user.subscriptionDue = false;
  await user.save();

  const notPayload = generateNotification("NEW:SUBSCRIPTION", {
    username: user.username,
  });
  try {
    await sendNotification(user, notPayload, ["push"]);
  } catch (err) {
    logger.error(err);
  } finally {
    return res.status(200).json({
      success: true,
    });
  }
});

import { User } from "../models/userModel.js";
import catchAsync from "../middlewares/catchAsync.js";
import { generateNotification } from "../utils/notificationGen.js";
import { notifyUser } from "../handlers/webpushHandler.js";

// // Paystack API configuration
// const paystackApiUrl = "https://api.paystack.co";
// const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;

// // Endpoint for initiating a payment
// export const processPayment = catchAsync(async (req, res, next) => {
//   try {
//     const { amount, email, cardNumber, cvv, expiryMonth, expiryYear } =
//       req.body;
//     const userId = req.user._id;

//     // Create a payment on Paystack
//     const paymentResponse = await axios.post(
//       `${paystackApiUrl}/transaction/initialize`,
//       {
//         amount,
//         email,
//         card: {
//           number: cardNumber,
//           cvv,
//           expiry_month: expiryMonth,
//           expiry_year: expiryYear,
//         },
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${paystackSecretKey}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     const { reference, authorization_url } = paymentResponse.data.data;

//     // Redirect the user to the Paystack payment page
//     res.redirect(authorization_url);

//     await verifyPayment(reference, userId, res, next);
//   } catch (error) {
//     logger.error("Error initiating payment:", error);
//     next(new ErrorHandler("Payment initiation failed"));
//   }
// });

// // Function to verify the payment
// const verifyPayment = async (reference, userId, res, next) => {
//   try {
//     // Verify the payment on Paystack
//     const verifyResponse = await axios.get(
//       `${paystackApiUrl}/transaction/verify/${reference}`,
//       {
//         headers: {
//           Authorization: `Bearer ${paystackSecretKey}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     const { status, amount, metadata } = verifyResponse.data.data;

//     if (status === "success") {
//       const currentDate = new Date();
//       const paymentDueDate = new Date().setMonth(currentDate.getMonth() + 1);

//       await User.findByIdAndUpdate(
//         userId,
//         { subscriptionDue: false, subscriptionDueDate: paymentDueDate },
//         {
//           new: true,
//           runValidators: true,
//         }
//       );

//       logger.info("Payment successful:", amount, metadata);
//       const payload = generateNotification('NEW:SUBSCRIPTION', null)
//        socketInstance.sendNotification(payload)
//       res.status(200).json({
//         success: true,
//         subscription: { amount, metadata },
//       });
//     } else {
//       logger.error("Payment failed:", amount, metadata);
//       next(new ErrorHandler("Payment failed"));
//     }
//   } catch (error) {
//     logger.error("Error verifying payment:", error);
//     next(new ErrorHandler("Payment verification failed"));
//   }
// };

export const onPaymentSuccess = catchAsync(async (req, res, next) => {
  const { amount, ref } = req.query;
  if (!ref) {
    return next(new ErrorHandler("Payment ref is not provided", 422));
  } else if (!amount) {
    return next(new ErrorHandler("Paid amount is not provided", 422));
  } else if (Number(amount) < 550) {
    return next(new ErrorHandler("Invalid amount", 422));
  }
  const JTOKEN = Math.floor(Number(amount) - 50) / 100;

  const user = await User.findById(req.user._id);
  user.tokenBalance += JTOKEN;
  user.subscriptionRef.push({
    amount,
    reference: ref,
    date: new Date(),
  });
  user.subscriptionDue = false;
  await user.save();

  const notPayload = generateNotification("NEW:SUBSCRIPTION", {
    username: user.username,
  });
  notifyUser(user.username, notPayload);

  res.status(200).json({
    success: true,
  });
});

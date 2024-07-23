import { onPaymentSuccess } from "../providers/paymentProcessor.js";
import express from "express";
import { authenticator } from "../middlewares/authenticator.js";

const Payment = express();

Payment.route('/payment-success').get(authenticator, onPaymentSuccess)
export { Payment };

import express from "express";
import { processPastQuestionImage, respondToQuery } from "../handlers/botHandler.js";
import { checkmateSubscription } from "../middlewares/subMiddleware.js";
const Bot = express();

Bot.route("/bot/pq-answers").post(checkmateSubscription,processPastQuestionImage);
Bot.route("/bot/query").post(checkmateSubscription, respondToQuery);

export { Bot }; 

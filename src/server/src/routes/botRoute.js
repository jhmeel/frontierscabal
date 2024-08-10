import express from "express";
import { authenticator } from "../middlewares/authenticator.js";
import { processPastQuestionImage, respondToQuery } from "../handlers/Bot.js";

const Bot = express();

Bot.route("/bot/pq-answers").post(processPastQuestionImage);
Bot.route("/bot/query").post(respondToQuery);

export { Bot }; 

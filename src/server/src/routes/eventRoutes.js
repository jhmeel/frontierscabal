import express from "express";
import { getEventByCategory } from "../handlers/eventHandler.js";
import { newEvent } from "../handlers/eventHandler.js";
import { getOngoingEvents } from "../handlers/eventHandler.js";
import { getUpcomingEvents } from "../handlers/eventHandler.js";
import { getRecentEvents } from "../handlers/eventHandler.js";
import { deleteEventById } from "../handlers/eventHandler.js";
import { updateEventById } from "../handlers/eventHandler.js";
import { getEventDetails } from "../handlers/eventHandler.js";
import { authenticator } from "../middlewares/authenticator.js";
const Event = express();

Event.route("/event/new").post(authenticator, newEvent);
Event.route("/events/upcoming").get(getUpcomingEvents);
Event.route("/events/ongoing").get(getOngoingEvents);
Event.route("/events/recent").get(getRecentEvents);
Event.route("/events/category/:category").get(getEventByCategory);
Event.route("/event/update/:id").put(authenticator, updateEventById);
Event.route("/event/:id").delete(authenticator, deleteEventById);
Event.route("/event/:slug").get(getEventDetails);

export { Event };

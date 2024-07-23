import express from "express";
import {
  removeAdmin,
  getAdmins,
  newAdmin,
  aggregate,
  getSuggestion,
} from "../handlers/miscHandler.js";

import { newPushSubscription } from "../handlers/webpushHandler.js";
import { authenticator } from "../middlewares/authenticator.js";
import { RestrictTo } from "../middlewares/restrictTo.js";
import searchCabal from "../handlers/searchHandler.js";

const Misc = express();

Misc.route("/new-admin/:username").get(
  authenticator,
  RestrictTo("FC:SUPER:ADMIN"),
  newAdmin
);
Misc.route("/remove-admin/:username").get(
  authenticator,
  RestrictTo("FC:SUPER:ADMIN"),
  removeAdmin
);
Misc.route("/aggregate-all").get(
  authenticator,
  RestrictTo("FC:SUPER:ADMIN"),
  aggregate
);
Misc.route("/admins-all").get(
  authenticator,
  RestrictTo("FC:SUPER:ADMIN"),
  getAdmins
);
Misc.route("/suggestion-search").get(getSuggestion);
Misc.route("/search-cabal").get(searchCabal);
Misc.route("/push-subscription").post(authenticator, newPushSubscription);

export { Misc };

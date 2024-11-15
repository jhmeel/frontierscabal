import express from "express";
import { Worker } from "./src/worker.js";
import dotenv from "dotenv";
import { Config } from "./src/config/config.js";
import { CloudinaryProvider } from "./src/providers/cloudinaryProvider.js";
import { DbProvider } from "./src/providers/dbProvider.js";
import { MiddlewaresProvider } from "./src/providers/middlewaresProvider.js";
import { RouteProvider } from "./src/providers/routeProvider.js";
//import "./src/utils/subscription.js";


dotenv.config();
const app = express();
const dependencies = [
  DbProvider.getInstance(Config),
  new CloudinaryProvider(Config),
  new MiddlewaresProvider(app),
  new RouteProvider(app),
];

const worker = Worker.getInstance(app, Config); 

worker.addDependency(dependencies);
worker.initializeDependencies();
worker.startPolling();
 
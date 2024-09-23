import express from "express";
import {Core} from "./src/Core.js";
import dotenv from "dotenv";
import { Config } from "./src/config/config.js";
import { CloudinaryProvider } from "./src/providers/cloudinaryProvider.js";
import { DbProvider } from "./src/providers/dbProvider.js";
import { MiddlewaresProvider } from "./src/providers/middlewaresProvider.js";
import { RouteProvider } from "./src/providers/routeProvider.js";

dotenv.config();
const app = express();

const dependencyList = [
<<<<<<< HEAD
  DbProvider.getInstance(Config),
=======
 DbProvider.getInstance(Config),
>>>>>>> 832ce1e54523d6df4550e5927e27d5ea4093fd7e
  new CloudinaryProvider(Config), 
  new MiddlewaresProvider(app),
  new RouteProvider(app),
];

<<<<<<< HEAD

=======
 
>>>>>>> 832ce1e54523d6df4550e5927e27d5ea4093fd7e
const core = Core.getInstance(app, Config);

core.addDependency(dependencyList);
core.initializeDependencies();
core
  .startPolling()

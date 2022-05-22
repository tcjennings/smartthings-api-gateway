"use strict";

import { LoadConfig, Configuration } from "./config";

import Hapi from "@hapi/hapi";
import Pino from "hapi-pino";
const Monoprice = require("./plugins/monoprice");
const SmartThings = require("./plugins/smartthings");
const Swagger = require("./plugins/swagger");

interface DeploymentParameters {
  start: boolean;
  config: Configuration;
}

exports.deployment = async ({ start, config }: DeploymentParameters) => {
  const server = Hapi.server({
    port: parseInt(config.smartthings.port!) || 3000,
    host: "0.0.0.0",
  });

  // Pino Logging plugin
  await server.register({
    plugin: Pino,
    options: {
      level: process.env.NODE_ENV == "production" ? "error" : "info",
      redact: ["req.headers.authorization"],
    },
  });
  await server.register(Swagger);
  await server.register(SmartThings);

  // loop through configured plugins to load them?
  await server.register(
    { plugin: Monoprice, options: config.monoprice || {} },
    config.monoprice!.options || {}
  );

  if (start) {
    server.start();
    server.logger.info("Server running on %s", server.info.uri);
    return server;
  }

  await server.initialize();

  return server;
};

if (require.main === module) {
  const config = LoadConfig();

  exports.deployment({ start: true, config: config });

  process.on("unhandledRejection", (err) => {
    console.log("Unhandled Error", err);
    throw err;
  });
}

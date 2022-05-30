"use strict";

import { loadConfig, Configuration } from "./config";

import Hapi from "@hapi/hapi";
import Pino from "hapi-pino";
import { Plugin as Monoprice } from "./plugins/monoprice";
import { Plugin as SmartThings } from "./plugins/smartthings";
import { Plugin as Swagger } from "./plugins/swagger";

interface DeploymentParameters {
  start: boolean;
  config: Configuration;
}

exports.deployment = async ({ start, config }: DeploymentParameters) => {
  const server = Hapi.server({
    port: Number(config.smartthings.port) || 3000,
    host: "0.0.0.0",
  });

  // TODO use glue to manage plugins
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

  await server.register(
    {
      plugin: Monoprice,
      options: config.monoprice,
    },
    config.monoprice
      ? config.monoprice.options
      : { routes: { prefix: "/monoprice" } }
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
  const config = loadConfig();

  exports.deployment({ start: true, config: config });

  process.on("unhandledRejection", (err) => {
    console.log("Unhandled Error", err);
    throw err;
  });
}

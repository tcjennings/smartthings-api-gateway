"use strict";

const Config = require("./config");
const Hapi = require("@hapi/hapi");
const Monoprice = require("./plugins/monoprice");
const SmartThings = require("./plugins/smartthings");
const Swagger = require("./plugins/swagger");

exports.deployment = async ({ start, config } = {}) => {
  const server = Hapi.server({
    port: parseInt(config.smartthings.port),
    host: "0.0.0.0",
  });

  await server.register(Swagger);
  await server.register(SmartThings);

  // loop through configured plugins to load them?
  await server.register({ plugin: Monoprice, options: config.monoprice || {} });

  if (start) {
    server.start();
    console.log("Server running on %s", server.info.uri);
    return server;
  }

  await server.initialize();

  return server;
};

if (require.main === module) {
  const config = Config.LoadConfigs();

  exports.deployment({ start: true, config: config });

  process.on("unhandledRejection", (err) => {
    console.log("Unhandled Error", err);
    throw err;
  });
}

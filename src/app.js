"use strict";

const Config = require("./config");
const Hapi = require("@hapi/hapi");
const Monoprice = require("./plugins/monoprice");
const SmartThings = require("./plugins/smartthings");

const init = async (config) => {
  const server = Hapi.server({
    port: 3000,
    host: "0.0.0.0",
  });

  await server.register(SmartThings);

  // loop through configured plugins to load them?
  await server.register({ plugin: Monoprice, options: config.monoprice || {} });

  await server.start();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

const config = Config.LoadConfigs();
init(config);

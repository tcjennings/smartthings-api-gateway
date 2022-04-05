"use strict";

const Commands = require("./commands");
const Config = require("./config");
const Controller = require("./controller");
const Validate = require("./validate");

exports.plugin = {
  pkg: require("./package.json"),
  register: async function (server, options) {
    Config.set_config(options);
    console.log(Config);
    server.route({
      method: "GET",
      path: "/monoprice/zones",
      handler: Controller.ZoneDiscoveryHandler,
    }),
      server.route({
        method: "GET",
        path: "/monoprice/controller/{controller}/zone/{zone}/name",
        handler: Controller.ZoneNameDiscoveryHandler,
      }),
      server.route({
        method: "GET",
        path: "/monoprice/sources",
        handler: Controller.SourceNamesDiscoveryHandler,
      }),
      server.route({
        method: "GET",
        path: "/monoprice/source/{source}/name",
        handler: Controller.SourceNameDiscoveryHandler,
      }),
      server.route({
        method: "GET",
        path: "/monoprice/controller/{controller}/zone/{zone}/capability/{capability}",
        // validate: Validate.CapabilityCommand,
        handler: Controller.CapabilityCommand,
      });
  },
};

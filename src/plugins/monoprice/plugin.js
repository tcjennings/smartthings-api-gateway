"use strict";

const Joi = require("joi");

const Commands = require("./commands");
const Config = require("./config");
const Controller = require("./controller");
const Models = require("./models.js");
const Validate = require("./validate");

exports.plugin = {
  pkg: require("./package.json"),
  register: async function (server, options) {
    Config.set_config(options);
    console.log(Config);

    server.route({
      method: "GET",
      path: "/monoprice/sources",
      handler: Controller.SourceNamesDiscoveryHandler,
      options: {
        description: "Get a list of source channels",
        tags: ["api"],
        validate: Models.DefaultRequestModel,
        response: { schema: Models.SourceNamesDiscoveryResponseModel },
      },
    });

    server.route({
      method: "GET",
      path: "/monoprice/zones",
      handler: Controller.ZoneDiscoveryHandler,
      options: {
        description: "Get a list of zones",
        tags: ["api"],
        validate: Models.DefaultRequestModel,
        response: { schema: Models.ZoneDiscoveryResponseModel },
      },
    });

    server.route({
      method: "GET",
      path: "/monoprice/controller/{controller}/zone/{zone}/name",
      handler: Controller.ZoneNameDiscoveryHandler,
      options: {
        description: "Get the name of a specific zone",
        tags: ["api"],
        validate: Models.ZoneNameDiscoveryRequestModel,
        response: { schema: Models.ZoneNameDiscoveryResponseModel },
      },
    });

    server.route({
      method: "GET",
      path: "/monoprice/source/{source}/name",
      handler: Controller.SourceNameDiscoveryHandler,
      options: {
        description: "Get the name of a specific source channel",
        tags: ["api"],
        response: { schema: Models.SourceNameDiscoveryResponseModel },
      },
    });

    server.route({
      method: "GET",
      path: "/monoprice/controller/{controller}/zone/{zone}/capability/{capability}",
      handler: Controller.CapabilityCommand,
      options: {
        description: "Get the status for a capability at a specific zone",
        tags: ["api"],
        validate: Models.CapabilityCommandRequestModel,
        response: { schema: Models.CapabilityCommandResponseModel },
      },
    });
  },
};

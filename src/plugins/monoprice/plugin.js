"use strict";

const Joi = require("joi");
const {SerialPort} = require("serialport");

const Commands = require("./commands");
const Config = require("./config");
const Controller = require("./controller");
const Models = require("./models.js");
const Validate = require("./validate");
const Zone = require("./zone");
const Package = require("./package.json");

exports.plugin = {
  pkg: Package,
  register: async function (server, options) {
    Config.set_config(options);
    console.log(Config);

    // create an instance of the serial port
    const port = new SerialPort({
      path: Config.config.serial.device,
      baudRate: Config.config.serial.speed,
      autoOpen: false,
    });

    // set up all the Zone objects according to config
    let zones = [];
    for (let i in Config.config.controllers) {
      for (let j in Config.config.controllers[i].zones) {
        zones.push(
          new Zone.Zone(
            Config.config.controllers[i].controller,
            Config.config.controllers[i].zones[j].zone,
            port
          )
        );
      }
    }
    //console.log(zones)

    // Plugin Methods
    const getZone = (controller, zone) => {
      const zoneId = `${controller}${zone}`;
      for (let z in zones) {
        if (zones[z].id === zoneId) {
          return zones[z];
        }
      }
    };
    server.decorate("toolkit", "getZone", getZone);

    // Plugin Routes
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
      method: "PATCH",
      path: "/monoprice/source/{source}/name",
      handler: Controller.SourceNameUpdateHandler,
      options: {
        description: "Update the name of a specific source channel",
        tags: ["api"],
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

    server.route({
      method: "POST",
      path: "/monoprice/controller/{controller}/zone/{zone}",
      handler: Controller.CapabilityCallCommand,
      options: {
        description: "Call a command for a capability at a specific zone",
        tags: ["api"],
        validate: Models.CapabilityCallCommandRequestModel,
        response: { schema: Models.CapabilityCallCommandResponseModel },
      },
    });
  },
};

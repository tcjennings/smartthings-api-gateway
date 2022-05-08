"use strict";

const { SerialPort } = require("serialport");

const Config = require("./config");
const Controller = require("./controller");
const Models = require("./models.js");
const Package = require("./package.json");
const Zone = require("./zone");

function getPort() {
  try {
    const port = new SerialPort({
      path: Config.config.serial.device,
      baudRate: Config.config.serial.speed,
      autoOpen: false,
      lock: false,
    });
    port.open(function (e) {
      if (e) {
        return console.log("Error opening port: ", e.message);
      }
    });
    return port;
  } catch (e) {
    console.log(e);
    return undefined;
  }
}

function createZones(controllers, port) {
  const zones = [];
  for (const i in controllers) {
    for (const j in controllers[i].zones) {
      zones.push(
        new Zone.Zone(
          controllers[i].controller,
          controllers[i].zones[j].zone,
          port
        )
      );
    }
  }
  return zones;
}

exports.plugin = {
  pkg: Package,
  register: async function (server, options) {
    Config.set_config(options);
    server.logger.info(Config);

    // create an instance of the serial port
    // TODO serialport management should be a plugin that decorates the server
    const port = await getPort();

    // set up all the Zone objects according to config
    const zones = createZones(Config.config.controllers, port);

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
      path: "/sources",
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
      path: "/zones",
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
      path: "/controller/{controller}/zone/{zone}/name",
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
      path: "/source/{source}/name",
      handler: Controller.SourceNameDiscoveryHandler,
      options: {
        description: "Get the name of a specific source channel",
        tags: ["api"],
        response: { schema: Models.SourceNameDiscoveryResponseModel },
      },
    });

    server.route({
      method: "PATCH",
      path: "/source/{source}/name",
      handler: Controller.SourceNameUpdateHandler,
      options: {
        description: "Update the name of a specific source channel",
        tags: ["api"],
      },
    });

    server.route({
      method: "GET",
      path: "/controller/{controller}/zone/{zone}",
      handler: Controller.RefreshZoneCommand,
      options: {
        description: "Refresh and fetch state for a specific zone",
        tags: ["api"],
        validate: Models.CapabilityCallStatusRequestModel,
        // response: { schema: Models.CapabilityCallCommandResponseModel },
      },
    });

    server.route({
      method: "GET",
      path: "/controller/{controller}/zone/{zone}/capability/{capability}",
      handler: Controller.CapabilityCommand,
      options: {
        description: "Get the status for a capability at a specific zone",
        tags: ["api"],
        validate: Models.CapabilityCommandRequestModel,
        response: { schema: Models.CapabilityCommandResponseModel },
      },
    });

    server.route({
      method: "GET",
      path: "/controller/{controller}/zone/{zone}/capability/{capability}/attribute/{attribute}",
      handler: Controller.CapabilityAttributeHandler,
      options: {
        description: "Get the value of an attribute for a capability",
        tags: ["api"],
        validate: Models.CapabilityAttributeRequestModel,
      },
    });

    server.route({
      method: "POST",
      path: "/controller/{controller}/zone/{zone}",
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

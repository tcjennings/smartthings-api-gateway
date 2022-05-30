"use strict";

/**
 * The Monoprice Plugin Module
 *
 * @module monoprice
 */

import type Hapi from "@hapi/hapi";
import type { MonopriceConfiguration, MonopriceController } from "./types";

import { SerialPort } from "serialport";

import { Configuration } from "./config";
import * as Controller from "./controller";
import * as Models from "./models";
import Package from "./package.json";
import { Zone } from "./zone";

function getPort() {
  try {
    const port = new SerialPort({
      path: Configuration.config.serial.device,
      baudRate: Configuration.config.serial.speed,
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

function createZones(
  controllers: MonopriceController[],
  port: SerialPort | unknown
) {
  const zones = [];
  for (const i in controllers) {
    for (const j in controllers[i].zones) {
      zones.push(
        new Zone(
          controllers[i].controller,
          controllers[i].zones[j].zone,
          port as SerialPort
        )
      );
    }
  }
  return zones;
}

export const Plugin = {
  pkg: Package,
  register: async function (
    server: Hapi.Server,
    options: MonopriceConfiguration
  ) {
    Configuration.set_config(options);
    server.logger.info(Configuration);

    // create an instance of the serial port
    // TODO serialport management should be a plugin that decorates the server
    const port = getPort();

    // set up all the Zone objects according to config
    const zones = createZones(Configuration.config.controllers, port);

    // Plugin Methods
    const getZone = (controller: number | string, zone: number | string) => {
      const zoneId = `${controller}${zone}`;
      for (const z in zones) {
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

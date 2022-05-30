/**
 * Controller module for the Monoprice plugin. Contains handler functions for API routes.
 *
 * @module monoprice/controller
 */

import { Configuration } from "./config";
import type Hapi from "@hapi/hapi";
/**
 * Returns a list of zones available in the controller stack.
 * @param {*} request
 * @param {*} h
 *
 * @return {object} An object with a list of zones and metadata.
 */
export const ZoneDiscoveryHandler = (
  request: Hapi.Request,
  h: Hapi.ResponseToolkit // eslint-disable-line @typescript-eslint/no-unused-vars
) => {
  const controllers = [];
  const zones = [];
  for (const controller of Configuration.config.controllers) {
    controllers.push(`${controller.controller}`);
    for (const zone of controller.zones) {
      zones.push(`${controller.controller}${zone.zone}`);
    }
  }

  return {
    zones: zones,
    metadata: {
      controllers: controllers,
      id: request.query.id,
    },
  };
};

/**
 * Returns the configured name for a specific zone
 * @param {*} request
 * @param {*} h
 * @return  {object} Object with the controller, zone, and name
 */
export const ZoneNameDiscoveryHandler = (
  request: Hapi.Request,
  h: Hapi.ResponseToolkit // eslint-disable-line @typescript-eslint/no-unused-vars
) => {
  const controller =
    Configuration.config.controllers[Number(request.params.controller) - 1];

  return {
    controller: request.params.controller,
    zone: request.params.zone,
    name: controller.zones[Number(request.params.zone) - 1].name,
    metadata: {
      id: request.query.id,
    },
  };
};

export const CapabilityCommand = (
  request: Hapi.Request,
  h: Hapi.ResponseToolkit
) => {
  // request.params will include controller, zone, and capability
  const z = (h as any).getZone(request.params.controller, request.params.zone);

  return {
    capability: request.params.capability,
    attributes: z.capabilities.PR.on(),
    metadata: {
      controller: request.params.controller,
      zone: request.params.zone,
      id: request.query.id,
    },
  };
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const SourceNamesDiscoveryHandler = (
  request: Hapi.Request,
  h: Hapi.ResponseToolkit // eslint-disable-line @typescript-eslint/no-unused-vars
) => {
  const sources = [];
  for (const i in Configuration.config.sources) {
    sources.push({ id: i, name: Configuration.config.sources[i] });
  }
  return {
    sources: sources,
    metadata: {
      id: request.query.id,
    },
  };
};

export const SourceNameDiscoveryHandler = (
  request: Hapi.Request,
  h: Hapi.ResponseToolkit // eslint-disable-line @typescript-eslint/no-unused-vars
) => {
  return {
    source: request.params.source,
    name: Configuration.config.sources[Number(request.params.source) - 1],
    metadata: {
      id: request.query.id,
    },
  };
};

export const SourceNameUpdateHandler = (
  request: Hapi.Request, // eslint-disable-line @typescript-eslint/no-unused-vars
  h: Hapi.ResponseToolkit // eslint-disable-line @typescript-eslint/no-unused-vars
) => {
  return true;
};

export const CapabilityCallCommand = (
  request: Hapi.Request,
  h: Hapi.ResponseToolkit
) => {
  const zone = (h as any).getZone(request.params.controller, request.params.zone);
  const cmd = (request as any).payload.command;
  const hw = (request as any).payload.hw;
  return zone.capabilities[hw][cmd]();
};

export const RefreshZoneCommand = (
  request: Hapi.Request,
  h: Hapi.ResponseToolkit
) => {
  const zone = (h as any).getZone(request.params.controller, request.params.zone);
  return zone.refreshState();
};

export const CapabilityAttributeHandler = (
  request: Hapi.Request,
  h: Hapi.ResponseToolkit
) => {
  // return a state object for each hw in the zone that supplies
  // the given capability, or if a hw is requested in the query
  // return only that attribute
  const zone = (h as any).getZone(request.params.controller, request.params.zone);
  return zone.capabilities[request.query.hw][request.params.attribute];
};

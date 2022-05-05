const Config = require("./config");

/**
 * Returns a list of zones available in the controller stack.
 *
 * @return {object} An object with a list of zones and metadata.
 */
exports.ZoneDiscoveryHandler = (request, h) => {
  const controllers = [];
  const zones = [];
  for (const controller of Config.config.controllers) {
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
 * @returns  {object} Object with the controller, zone, and name
 */
exports.ZoneNameDiscoveryHandler = (request, h) => {
  const controller =
    Config.config.controllers[parseInt(request.params.controller) - 1];

  return {
    controller: request.params.controller,
    zone: request.params.zone,
    name: controller.zones[parseInt(request.params.zone) - 1].name,
    metadata: {
      id: request.query.id,
    },
  };
};

exports.CapabilityCommand = (request, h) => {
  // request.params will include controller, zone, and capability
  let z = h.getZone(request.params.controller, request.params.zone);

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

exports.SourceNamesDiscoveryHandler = (request, h) => {
  const sources = [];
  for (const i in Config.config.sources) {
    sources.push({ id: i, name: Config.config.sources[i] });
  }
  return {
    sources: sources,
    metadata: {
      id: request.query.id,
    },
  };
};

exports.SourceNameDiscoveryHandler = (request, h) => {
  return {
    source: request.params.source,
    name: Config.config.sources[parseInt(request.params.source) - 1],
    metadata: {
      id: request.query.id,
    },
  };
};

exports.SourceNameUpdateHandler = (request, h) => {
  return true;
};

exports.CapabilityCallCommand = (request, h) => {
  const zone = h.getZone(request.params.controller, request.params.zone);
  const cmd = request.payload.command;
  const hw = request.payload.hw;
  return zone.capabilities[hw][cmd]();
};

exports.RefreshZoneCommand = (request, h) => {
  const zone = h.getZone(request.params.controller, request.params.zone);
  return zone.refreshState();
}

exports.CapabilityAttributeHandler = (request, h) => {
  //return a state object for each hw in the zone that supplies
  //the given capability, or if a hw is requested in the query
  //return only that attribute
  const zone = h.getZone(request.params.controller, request.params.zone);
  return zone.capabilities[request.query.hw][request.params.attribute];
}
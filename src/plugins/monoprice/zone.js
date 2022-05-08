// Implements a class representing a Zone in a monoprice amp
// a system may have up to 18 zones, 6 on each of as many as
// 3 units in a stack.

// Each zone implements a set of capabilities, and each capability
// implements a set of supported commands and attributes

// Additionally, a zone may support commands outside the scope of
// any specific capability, such as STATUS
const { ReadlineParser } = require("@serialport/parser-readline");
const logger = require("pino")();

const Capabilities = require("./capabilities");
const { normalizeLevelConstraint } = require("./utility");
const Regexes = require("./regexes");

// Parses any serial command response
const serialResponseParser = (zone, data) => {
  try {
    const x = [...data.trim().matchAll(Regexes.reCommandResponse)];
    logger.info("Parsing: %s", data.trim());

    // return early if no groups
    if (!x.length || x[0].groups === undefined) {
      logger.warning("No groups found in data %s", data);
      return;
    }

    // if a RESP group is matched...
    if (
      x[0].groups.RESP !== undefined &&
      x[0].groups.ZONE == zone.zone &&
      x[0].groups.UNIT == zone.controller
    ) {
      // ... update state values
      const cmd = x[0].groups.CMD;
      zone.state[cmd] = x[0].groups.VAL;
      logger.info(`Zone ${zone.id} ${cmd} state: ${zone.state[cmd]}`);
    }
  } catch (e) {
    logger.error("Failed running command %s: %s", data, e.message);
  }
};

// Parses a zone status reponse string and update the state
const zoneStatusParser = (zone, data) => {
  try {
    const x = [...data.trim().matchAll(Regexes.reZoneStatus)];
    logger.info("Parsing: %s", data.trim());

    // return early if no groups
    if (!x.length || x[0].groups === undefined) {
      logger.warning("No groups found in data %s", data);
      return;
    }

    // if a RESP group is matched...
    if (
      x[0].groups.RESP !== undefined &&
      x[0].groups.ZONE == zone.zone &&
      x[0].groups.UNIT == zone.controller
    ) {
      for (const [k, v] of Object.entries(x[0].groups)) {
        // ... update all state values
        if (k === "RESP") {
          // Do not add the RESP group to the state object
          continue;
        }
        zone.state[k] = v;
      }
      logger.info(`Zone ${zone.id} state: ${JSON.stringify(zone.state)}`);
    }
  } catch (e) {
    logger.error("Failed updating status for message %s: %s", data, e.message);
  }
};

exports.Zone = class {
  constructor(controller, zone, port) {
    this.controller = controller;
    this.zone = zone;
    this.id = `${controller}${zone}`;
    this.port = port;
    this.parser = new ReadlineParser();
    this.state = {
      UNIT: null,
      ZONE: null,
      PR: null,
      CH: null,
      VO: null,
      BS: null,
      TR: null,
      BL: null,
      DT: null,
      MU: null,
      LS: null,
    };
    this.capabilities = {
      PR: new Capabilities.Switch(this, "PR"),
      MU: new Capabilities.audioMute(this),
      VO: new Capabilities.audioVolume(this, {
        minimum: 0,
        maximum: 38,
        median: 19,
      }),
      CH: new Capabilities.tvChannel(this),
      LS: new Capabilities.remoteControlStatus(this),
      DT: new Capabilities.Switch(this, "DT"),
      BS: new Capabilities.switchLevel(this, "BS", {
        minimum: -10,
        maximum: 10,
        median: 0,
      }),
      TR: new Capabilities.switchLevel(this, "TR", {
        minimum: -10,
        maximum: 10,
        median: 0,
      }),
      BL: new Capabilities.switchLevel(this, "BL", {
        minimum: 0,
        maximum: 20,
        median: 10,
      }),
    };
    this.port.pipe(this.parser);
    this.refreshState();
  }

  // TODO separate from Zone class!
  // queries the serial port to refresh the state of the zone.
  async refreshState() {
    this.parser.on("data", (data) => {
      zoneStatusParser(this, data);
    });
    await this.port.write(`?${this.id}\r`);
    return this.state;
  } // end refreshState

  async sendCommand(hw, val) {
    this.parser.on("data", (data) => {
      serialResponseParser(this, data);
    });
    await this.port.write(`<${this.id}${hw}${val}\r`);
    return this.state;
  }

  async sendQuery(hw) {
    this.parser.on("data", (data) => {
      serialResponseParser(this, data);
    });
    await this.port.write(`?${this.id}${hw}\r`);
    return this.state;
  }
}; // end Zone

// Implements a class representing a Zone in a monoprice amp
// a system may have up to 18 zones, 6 on each of as many as
// 3 units in a stack.

// Each zone implements a set of capabilities, and each capability
// implements a set of supported commands and attributes

// Additionally, a zone may support commands outside the scope of
// any specific capability, such as STATUS
const { ReadlineParser } = require("@serialport/parser-readline");
const { normalizeLevelConstraint } = require("./validate.js");

const logger = require("pino")()
const Regexes = require("./regexes");

const Switch = class {
  // Constructor binds an instance of the Switch to a Zone
  constructor(zone, hw = null) {
    this.zone = zone;
    this.hw = hw;
  }

  // attribute getter for switch
  get switch() {
    if (this.zone.state[this.hw] === "01") {
      return "on";
    } else {
      return "off";
    }
  }
  // implements the Switch.On command
  on() {
    logger.info("Turning ON switch for Zone.");
    this.zone.sendCommand(this.hw, "01");
    return this.zone.state;
  }
  // implements the Switch.Off command
  off() {
    logger.info("Turning OFF switch for Zone.");
    this.zone.sendCommand(this.hw, "00");
    return this.zone.state;
  }
};

const switchLevel = class {
  constructor(zone, hw = null, constraints = { minimum: 0, maximum: 100 }) {
    this.zone = zone;
    this.hw = hw;
    this.constraints = constraints;
  }

  // attribute getter for current level
  get level() {
    return true;
  }

  setLevel(level, rate = 1) {
    // rate is ignored in this hardware
    level = normalizeLevelConstraint(level, this.constraints);
    this.zone.sendCommand(this.hw, `${x}`.padStart(2, 0));
    return this.zone.state;
  }
};

const audioMute = class {
  constructor(zone) {
    this.zone = zone;
    this.hw = "MU";
  }

  get mute() {
    if (this.zone.state["MU"] === "01") {
      return "muted";
    } else {
      return "unmuted";
    }
  }

  // command to set mute
  set mute(value = null) {
    logger.info("Muting Zone");
    this.zone.sendCommand("MU", "01");
    return this.zone.state;
  }

  // command to set unmute
  unmute() {
    logger.info("Unmuting Zone");
    this.zone.sendCommand("MU", "00");
    return this.zone.state;
  }

  setMute(state) {
    if (state === "muted") {
      this.mute();
    } else if (state === "unmuted") {
      this.unmute();
    }
    return this.zone.state;
  }
};

const audioVolume = class {
  constructor(zone, constraints = { minimum: 0, maximum: 100 }) {
    this.zone = zone;
    this.constraints = constraints;
    this.hw = "VO";
  }

  // Increases volume by 1 up to the constraint max
  volumeUp() {
    let level = parseInt(this.zone.state.VO);
    if (level < this.constraints.maximum) {
      level += 1;
    }
    this.zone.sendCommand(this.hw, `${level}`.padStart(2, 0));
    return this.zone.state;
  }

  // Decreases volume by 1 down to the constraint min
  volumeDown() {
    let level = parseInt(this.zone.state.VO);
    if (level > this.constraints.minimum) {
      level -= 1;
    }
    this.zone.sendCommand(this.hw, `${level}`.padStart(2, 0));
    return this.zone.state;
  }

  // Set the volume to a specified value, scaled to the constraint range
  setVolume(volume) {
    volume = normalizeLevelConstraint(volume, this.constraints);
    this.zone.sendCommand(this.hw, `${volume}`.padStart(2, 0));
    return this.zone.state;
  }
};

const tvChannel = class {
  constructor(zone) {
    this.zone = zone;
    this.hw = "CH";
    this.constraints = { minimum: 1, maximum: 6 };
  }

  // attribute getter for current channel
  tvChannel() {
    return true;
  }

  // attribute getter for current channel name
  tvChannelName() {
    return true;
  }

  // Changes the source to the next higher value, wrapping at maximum
  channelUp() {
    let channel = parseInt(this.zone.state.CH);
    channel += 1;
    if (channel > this.constraints.maximum) {
      channel = this.constraints.minimum;
    }
    this.zone.sendCommand(this.hw, `${channel}`.padStart(2, 0));
    return this.zone.state.CH;
  }

  // Changes the source to the next lower value, wrapping at minimum
  channelDown() {
    let channel = parseInt(this.zone.state.CH);
    channel -= 1;
    if (channel < this.constraints.minimum) {
      channel = this.constraints.maximum;
    }
    this.zone.sendCommand(this.hw, `${channel}`.padStart(2, 0));
    return this.zone.state.CH;
  }

  // sets the active channel to arg
  setTvChannel(tvChannel) {
    if (
      tvChannel > this.constraints.maximum ||
      tvChannel < this.constraints.minimum
    ) {
      return this.zone.state.CH;
    }
    this.zone.sendCommand(this.hw, `${tvChannel}`.padStart(2, 0));
    return this.zone.state.CH;
  }

  // sets the tv channel name, but since it only takes 1 argument
  // it must operate on the *current* tvChannel
  setTvChannelName(tvChannelName) {
    return true;
  }
};

const remoteControlStatus = class {
  constuctor(zone) {
    this.zone = zone;
    this.hw = "LS";
  }

  // returns true if a keypad is connected (LS)
  remoteControlEnabled() {
    return true;
  }
};

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
// this is a callback so doesn't return anything
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
      PR: new Switch(this, "PR"),
      MU: new audioMute(this),
      VO: new audioVolume(this, { minimum: 0, maximum: 38, median: 19 }),
      CH: new tvChannel(this),
      LS: new remoteControlStatus(this),
      DT: new Switch(this, "DT"),
      BS: new switchLevel(this, "BS", { minimum: -10, maximum: 10, median: 0 }),
      TR: new switchLevel(this, "TR", { minimum: -10, maximum: 10, median: 0 }),
      BL: new switchLevel(this, "BL", { minimum: 0, maximum: 20, median: 10 }),
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

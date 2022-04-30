// Implements a class representing a Zone in a monoprice amp
// a system may have up to 18 zones, 6 on each of as many as
// 3 units in a stack.

// Each zone implements a set of capabilities, and each capability
// implements a set of supported commands and attributes

// Additionally, a zone may support commands outside the scope of
// any specific capability, such as STATUS
const { ReadlineParser } = require("@serialport/parser-readline");

const Regexes = require("./regexes");

const Switch = class {
  // Constructor binds an instance of the Switch to a Zone
  constructor(zone, hw = null) {
    this.zone = zone;
    this.hw = hw;
  }

  // implements the Switch.On command
  on() {
    console.log("Turning ON switch for Zone.");
    this.zone.state.PR = 1;
    return this.zone.state;
  }
  // implements the Switch.Off command
  off() {
    console.log("Turning OFF switch for Zone.");
    this.zone.state.PR = 0;
    return this.zone.state;
  }
};

const switchLevel = class {
  constructor(zone, hw = null) {
    this.zone = zone;
    this.hw = hw;
  }

  setLevel(level, rate) {
    return true;
  }

  // attribute getter for current level
  level() {
    return true;
  }
};

const audioMute = class {
  constructor(zone) {
    this.zone = zone;
  }

  mute() {
    console.log("Muting Zone");
    this.zone.state.MU = 1;
    return this.zone.state;
  }

  unmute() {
    console.log("Unmuting Zone");
    this.zone.state.MU = 0;
    return this.zone.state;
  }

  setMute(state) {
    this.zone.state.MU = state;
    return this.zone.state;
  }
};

const audioVolume = class {
  constructor(zone) {
    this.zone = zone;
  }

  volumeUp() {
    this.zone.state.VO += 1;
    return this.zone.state;
  }

  volumeDown() {
    this.zone.state.VO -= 0;
    return this.zone.state;
  }

  setVolume(volume) {
    this.zone.state.VO = volume;
    return this.zone.state;
  }
};

const tvChannel = class {
  constructor(zone) {
    this.zone = zone;
  }

  // attribute getter for current channel
  tvChannel() {
    return true;
  }

  // attribute getter for current channel name
  tvChannelName() {
    return true;
  }

  channelUp() {
    return true;
  }

  channelDown() {
    return true;
  }

  // sets the active channel to arg
  setTvChannel(tvChannel) {
    return true;
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
  }

  // returns true if a keypad is connected (LS)
  remoteControlEnabled() {
    return true;
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
      VO: new audioVolume(this),
      CH: new tvChannel(this),
      LS: new remoteControlStatus(this),
      DT: new Switch(this, "DT"),
      BS: new switchLevel(this, "BS"),
      TR: new switchLevel(this, "TR"),
      BL: new switchLevel(this, "BL"),
    };
    this.refreshState();
  }

  // Parses a zone status reponse string and update the state
  // this is a callback so doesn't return anything
  zoneStatusParser(data) {
    try {
      const x = Regexes.reZoneStatus.exec(data.trim());
      console.log("Parsing: ", data, x);
      // if a RESP group is matched...
      if (x.groups.RESP) {
        for (const [k, v] of Object.entries(x.groups)) {
          // ... update all state values
          this.state[k] = v;
          console.log(`Zone ${this.id} state: ${JSON.stringify(this.state)}`);
        }
      }
    } catch (e) {
      console.log("Failed updating status for message ", data, e.message);
    }
  }

  // queries the serial port to refresh the state of the zone.
  async refreshState() {
    this.port.pipe(this.parser);
    this.parser.on("data", (data) => {
      this.zoneStatusParser(data);
    });
    await this.port.write(`?${this.id}\r`);
    return this.state;
  } // end refreshState
}; // end Zone

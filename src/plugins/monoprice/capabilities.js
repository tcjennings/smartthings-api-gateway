exports.Switch = class {
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
}

exports.switchLevel = class {
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

exports.audioMute = class {
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

exports.audioVolume = class {
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

exports.tvChannel = class {
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

exports.remoteControlStatus = class {
  constuctor(zone) {
    this.zone = zone;
    this.hw = "LS";
  }

  // returns true if a keypad is connected (LS)
  remoteControlEnabled() {
    return true;
  }
};

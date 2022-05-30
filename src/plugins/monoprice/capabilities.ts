/**
 * Capabilities module for the Monoprice plugin.
 *
 * Each SmartThings Capability implemented by the device is represented
 * as a class. Each class implements the attributes and methods defined
 * for that Capability.
 *
 * Each class constructor associates a capability with a Zone and optionally
 * a Hardware within that zone. Each class also implements a property to
 * indicate whether the capability is Production, Proposed, or Custom, and
 * the version of the Capability it implements.
 *
 * @module monoprice/capabilities
 */
import { Zone } from "./zone";
import { normalizeLevelConstraint } from "./utility";
import Pino from "pino";

const logger = Pino(); // eslint-disable-line new-cap

export const Switch = class {
  zone: Zone;
  hw: string;
  capability: { [key: string]: unknown };
  // Constructor binds an instance of the Switch to a Zone
  constructor(zone: Zone, hw: string | undefined = undefined) {
    this.zone = zone;
    this.hw = String(hw);
    this.capability = {
      version: 1,
      status: "live",
    };
  }

  // attribute getter for switch
  get switch() {
    if (this.zone.state[this.hw as string] === "01") {
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

export const switchLevel = class {
  zone: Zone;
  hw: string;
  constraints: { [key: string]: number };
  capability: { [key: string]: string | number };
  constructor(
    zone: Zone,
    hw: string | unknown = null,
    constraints: { [key: string]: number } = { minimum: 0, maximum: 100 }
  ) {
    this.zone = zone;
    this.hw = String(hw);
    this.constraints = constraints;
    this.capability = {
      version: 1,
      status: "live",
    };
  }

  // attribute getter for current level
  get level() {
    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setLevel(level: number, rate = 1) {
    // rate is ignored in this hardware
    level = normalizeLevelConstraint(level, this.constraints);
    this.zone.sendCommand(this.hw, `${level}`.padStart(2, "0"));
    return this.zone.state;
  }
};

export const audioMute = class {
  zone: Zone;
  hw: string;
  capability: { [key: string]: string | number };
  constructor(zone: Zone) {
    this.zone = zone;
    this.hw = "MU";
    this.capability = {
      version: 1,
      status: "live",
    };
  }

  // command to get mute status
  get mute() {
    if (this.zone.state["MU"] === "01") {
      return "muted";
    } else {
      return "unmuted";
    }
  }

  // command to set mute
  set mute(value: string) {
    logger.info("Muting Zone");
    this.zone.sendCommand("MU", "01");
  }

  // command to set unmute
  unmute() {
    logger.info("Unmuting Zone");
    this.mute = "unmuted";
    this.zone.sendCommand("MU", "00");
    return this.zone.state;
  }

  setMute(state: string) {
    if (state === "muted") {
      this.mute = "muted";
    } else if (state === "unmuted") {
      this.unmute();
    }
    return this.zone.state;
  }
};

export const audioVolume = class {
  zone: Zone;
  hw: string;
  constraints: { [key: string]: number };
  capability: { [key: string]: number | string };
  constructor(
    zone: Zone,
    constraints = { minimum: 0, maximum: 100, median: 50 }
  ) {
    this.zone = zone;
    this.constraints = constraints;
    this.hw = "VO";
    this.capability = {
      version: 1,
      status: "live",
    };
  }

  // Increases volume by 1 up to the constraint max
  volumeUp() {
    let level = Number(this.zone.state.VO);
    Math.floor(level);
    if (level < this.constraints.maximum) {
      level += 1;
    }
    this.zone.sendCommand(this.hw, `${level}`.padStart(2, "0"));
    return this.zone.state;
  }

  // Decreases volume by 1 down to the constraint min
  volumeDown() {
    let level = Number(this.zone.state.VO);
    Math.floor(level);
    if (level > this.constraints.minimum) {
      level -= 1;
    }
    this.zone.sendCommand(this.hw, `${level}`.padStart(2, "0"));
    return this.zone.state;
  }

  // Set the volume to a specified value, scaled to the constraint range
  setVolume(volume: number) {
    volume = normalizeLevelConstraint(volume, this.constraints);
    this.zone.sendCommand(this.hw, `${volume}`.padStart(2, "0"));
    return this.zone.state;
  }
};

export const tvChannel = class {
  zone: Zone;
  hw: string;
  constraints: { [key: string]: number };
  capability: { [key: string]: number | string };
  constructor(zone: Zone) {
    this.zone = zone;
    this.hw = "CH";
    this.constraints = { minimum: 1, maximum: 6 };
    this.capability = {
      version: 1,
      status: "proposed",
    };
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
    let channel = Number(this.zone.state.CH);
    Math.floor(channel);
    channel += 1;
    if (channel > this.constraints.maximum) {
      channel = this.constraints.minimum;
    }
    this.zone.sendCommand(this.hw, `${channel}`.padStart(2, "0"));
    return this.zone.state.CH;
  }

  // Changes the source to the next lower value, wrapping at minimum
  channelDown() {
    let channel = Number(this.zone.state.CH);
    Math.floor(channel);
    channel -= 1;
    if (channel < this.constraints.minimum) {
      channel = this.constraints.maximum;
    }
    this.zone.sendCommand(this.hw, `${channel}`.padStart(2, "0"));
    return this.zone.state.CH;
  }

  // sets the active channel to arg
  setTvChannel(tvChannel: number) {
    if (
      tvChannel > this.constraints.maximum ||
      tvChannel < this.constraints.minimum
    ) {
      return this.zone.state.CH;
    }
    this.zone.sendCommand(this.hw, `${tvChannel}`.padStart(2, "0"));
    return this.zone.state.CH;
  }

  // sets the tv channel name, but since it only takes 1 argument
  // it must operate on the *current* tvChannel
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setTvChannelName(tvChannelName: string) {
    return true;
  }
};

export const remoteControlStatus = class {
  zone: Zone;
  hw: string;
  capability: { [key: string]: string | number };
  constructor(zone: Zone) {
    this.zone = zone;
    this.hw = "LS";
    this.capability = {
      version: 1,
      status: "live",
    };
  }

  // returns true if a keypad is connected (LS)
  remoteControlEnabled() {
    return true;
  }
};

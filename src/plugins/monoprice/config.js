class Config {
  constructor() {
    this.config = {};
  }

  set_config(options) {
    this.config = options;
    return this.config;
  }
}

module.exports = new Config();

// exports.DefaultEQLevel = 7;
// exports.DefaultVolumeLevel = 10;
// exports.DefaultBalanceLevel = 10;

// exports.HardwareCommands = {
//   BL: {
//     name: "Zone Balance",
//     description:
//       "Zone balance level (00 = more left .. 10 = center .. 20 = more right)",
//     capability: "switchLevel",
//     pattern: "^#>(\\d)(\\d)BL(\\d{2})$",
//     default: this.DefaultBalanceLevel,
//   },
//   VO: {
//     name: "Zone Volume",
//     description: "Zone volume level (00 = more quiet .. 38 = more loud)",
//     capability: "audioVolume",
//     pattern: "^#>(\\d)(\\d)VO(\\d{2})$",
//     default: this.DefaultVolumeLevel,
//   },
//   BS: {
//     name: "Zone Bass",
//     description:
//       "Zone bass level (00 = less bass .. 7 = center .. 14 = most bass)",
//     capability: "switchLevel",
//     pattern: "^#>(\\d)(\\d)BS(\\d{2})$",
//     default: this.DefaultEQLevel,
//   },
//   TR: {
//     name: "Zone Treble",
//     description:
//       "Zone treble level (00 = less treble .. 7 = center .. 14 = most treble)",
//     capability: "switchLevel",
//     pattern: "^#>(\\d)(\\d)TR(\\d{2})$",
//     default: this.DefaultEQLevel,
//   },
//   CH: {
//     name: "Zone Source",
//     description: "Zone source selected [01-06]",
//     capability: "tvChannel",
//     pattern: "^#>(\\d)(\\d)CH(\\d{2})$",
//   },
//   MU: {
//     name: "Zone Mute",
//     description: "Zone mute status [00 = off, 01 = on]",
//     capability: "audioMute",
//     pattern: "^#>(\\d)(\\d)MU(\\d{2})$",
//   },
//   DT: {
//     name: "Zone Do Not Disturb",
//     description: "Zone Do Not Disturb status [00 = off, 01 = on]",
//     capability: "switch",
//     pattern: "^#>(\\d)(\\d)DT(\\d{2})$",
//   },
//   LS: {
//     name: "Zone Keypad Status",
//     description: "Zone keypad status [00 = not connected, 01 = connected]",
//     capability: "switch",
//     pattern: "^#>(\\d)(\\d)LS(\\d{2})$",
//   },
//   PA: {
//     name: "Zone PA Control Status",
//     description:
//       "Zone PA Control status [00 = not controlled, 01 = controlled]",
//     capability: "switch",
//     pattern: "^#>(\\d)(\\d)PA(\\d{2})$",
//   },
//   PR: {
//     name: "Zone Power Status",
//     description: "Zone power status [00 = off, 01 = on]",
//     capability: "switch",
//     pattern: "^#>(\\d)(\\d)PR(\\d{2})$",
//   },
// };

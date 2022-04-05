const commands = ["mute", "setMute", "unmute"];

// SmartThings "switch" capability commands
exports.On = (controller, zone, hw_cmd) => {
  // Build a serial command to set the hw_cmd switch to on
  const serial_command = "<" + controller + zone + hw_cmd + "01" + "\r";
  // write the command to serial port
  // return the status of the thing
  const serial_query = "?" + controller + zone + hw_cmd + "\r";
  return serial_query;
};

exports.Off = (controller, zone, hw_cmd) => {
  // Build a serial command to set the hw_cmd switch to on
  const serial_command = "<" + controller + zone + hw_cmd + "00" + "\r";
  // write the command to serial port
  // return the status of the thing
  const serial_query = "?" + controller + zone + hw_cmd + "\r";
  return serial_query;
};

// SmartThings "audioMute" capability commands
exports.Mute = (controller, zone) => {
  // Build a serial command to set the hw_cmd mute to on
  const serial_command = "<" + controller + zone + "MU" + "01" + "\r";
  // write the command to serial port
  // return the status of the thing
  const serial_query = "?" + controller + zone + "MU" + "\r";
  return serial_query;
};

exports.UnMute = (controller, zone) => {
  // Build a serial command to set the hw_cmd mute to on
  const serial_command = "<" + controller + zone + "MU" + "00" + "\r";
  // write the command to serial port
  // return the status of the thing
  const serial_query = "?" + controller + zone + "MU" + "\r";
  return serial_query;
};

exports.SetMute = (controller, zone, state) => {
  if (state == "muted") {
    return this.Mute(controller, zone);
  } else {
    return this.UnMute(controller, zone);
  }
};

// SmartThings "audioVolume" capability commands
exports.VolumeUp = (controller, zone) => {
  const serial_query = "?" + controller + zone + "VO" + "\r";
  // get the current volume, add one, set new volume
  this.SetVolume(controller, zone, volume);
};

exports.VolumeDown = (controller, zone) => {
  const serial_query = "?" + controller + zone + "VO" + "\r";
  // get the current volume, subtract one, set new volume
  this.SetVolume(controller, zone, volume);
};

exports.SetVolume = (controller, zone, volume) => {
  // Build a serial command to set the hw_cmd mute to on
  const serial_command = "<" + controller + zone + "VO" + volume + "\r";
  // write the command to serial port
  // return the status of the thing
  const serial_query = "?" + controller + zone + "VO" + "\r";
  return serial_query;
};

// SmartThings "tvChannel" capability commands
exports.ChannelUp = (controller, zone) => {
  const serial_query = "?" + controller + zone + "CH" + "\r";
  // get the current volume, add one, set new channel
  this.SetVolume(controller, zone, volume);
};

exports.ChannelDown = (controller, zone) => {
  const serial_query = "?" + controller + zone + "CH" + "\r";
  // get the current volume, subtract one, set new channel
  this.SetVolume(controller, zone, volume);
};

exports.SetTvChannel = (controller, zone, channel) => {
  // Build a serial command to set the hw_cmd mute to on
  const serial_command = "<" + controller + zone + "CH" + channel + "\r";
  // write the command to serial port
  // return the status of the thing
  const serial_query = "?" + controller + zone + "CH" + "\r";
  return serial_query;
};

exports.SetTvChannelName = (controller, zone, channel) => {
  // Build a serial command to set the hw_cmd mute to on
  const serial_command = "<" + controller + zone + "CH" + channel + "\r";
  // write the command to serial port
  // return the status of the thing
  const serial_query = "?" + controller + zone + "CH" + "\r";
  return serial_query;
};

/**
 * Normalizes a value from one range (current) to another (new).
 *
 * @param  { Number } val    //the current value (part of the current range).
 * @param  { Number } minVal //the min value of the current value range.
 * @param  { Number } maxVal //the max value of the current value range.
 * @param  { Number } newMin //the min value of the new value range.
 * @param  { Number } newMax //the max value of the new value range.
 *
 * @returns { Number } the normalized value.
 */
const normalizeBetweenTwoRanges = (val, minVal, maxVal, newMin, newMax) => {
  return newMin + ((val - minVal) * (newMax - newMin)) / (maxVal - minVal);
};

const CapabilityCommand = (request, h) => {};

const NormalizeVolumeLevel = (level) => {
  // audioVolumeLevel will be set between [0,100]
  // The amp wants a level between [0,38]
  // Make sure the level is within the acceptable input range
  if (level < 0) {
    level = 0;
  }
  if (level > 100) {
    level = 100;
  }
  return parseInt(normalizeBetweenTwoRanges(level, 0, 100, 0, 38));
};

const NormalizeBalanceLevel = (level) => {
  // switchLevel will be set between [0,100]
  // The amp wants a level between [0,20]
  // Make sure the level is within the acceptable input range
  if (level < 0) {
    level = 0;
  }
  if (level > 100) {
    level = 100;
  }
  return parseInt(normalizeBetweenTwoRanges(level, 0, 100, 0, 20));
};

const NormalizeEQLevel = (level) => {
  // switchLevel will be set between [0,100]
  // The amp wants a level between [0,14]
  // Make sure the level is within the acceptable input range
  if (level < 0) {
    level = 0;
  }
  if (level > 100) {
    level = 100;
  }
  return parseInt(normalizeBetweenTwoRanges(level, 0, 100, 0, 14));
};

exports.NormalizeEQLevel = NormalizeEQLevel;
exports.NormalizeBalanceLevel = NormalizeBalanceLevel;
exports.NormalizeVolumeLevel = NormalizeVolumeLevel;
exports.CapabilityCommand = CapabilityCommand;

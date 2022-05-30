/**
 * Utility module for monoprice plugin
 *
 * @module monoprice/utility
 */

/**
 * Normalizes a value from one range (current) to another (new).
 *
 * @private
 * @param  { Number } val    //the current value (part of the current range).
 * @param  { Number } minVal //the min value of the current value range.
 * @param  { Number } maxVal //the max value of the current value range.
 * @param  { Number } newMin //the min value of the new value range.
 * @param  { Number } newMax //the max value of the new value range.
 *
 * @return { Number } the normalized value.
 */
const normalizeBetweenTwoRanges = (
  val: number,
  minVal: number,
  maxVal: number,
  newMin: number,
  newMax: number
) => {
  return newMin + ((val - minVal) * (newMax - newMin)) / (maxVal - minVal);
};

/**
 * Normalizes a level value according to the specified constraint. The value
 * is provided on a 0..100 scale and normalized to the scale represented by
 * the minimum/maximum provided in the constraint.
 * @param {number} level - The level value to normalize
 * @param {Object} constraint - The constraints for the value, containing at least minimum and maximum
 *
 * @return {number} - The normalized value.
 */
export const normalizeLevelConstraint = (
  level: number,
  constraint: { [key: string]: number }
) => {
  return Number(
    normalizeBetweenTwoRanges(
      level,
      0,
      100,
      constraint.minimum,
      constraint.maximum
    )
  );
};

/**
 * Regexes module for Monoprice plugin. Defines regex patterns for interpreting
 * Monoprice controller serial command responses.
 *
 * @module monoprice/regexes
 */

/**
 * Regex to match a newline character that delimits the end of a command response
 *
 * @deprecated in favor of the ReadlineParser
 */
export const reCommandResponseDelimiter = /[\r\n]+/;

/**
 * Regex for a zone status report  `?ID`
 */
export const reZoneStatus =
  /[#>?]*(?<UNIT>\d)(?<ZONE>\d)(?<RESP>(?<PA>\d{2})(?<PR>\d{2})(?<MU>\d{2})(?<DT>\d{2})(?<VO>\d{2})(?<TR>\d{2})(?<BS>\d{2})(?<BL>\d{2})(?<CH>\d{2})(?<LS>\d{2})){0,1}/g;

/**
 * Regex for a command status response `?IDxx`
 */
export const reCommandResponse =
  /[#>?]*(?<UNIT>\d)(?<ZONE>\d)(?<RESP>(?<CMD>PP|PA|PR|MU|DT|VO|TR|BS|BL|CH|LS)(?<VAL>\d{2})){0,1}/g;

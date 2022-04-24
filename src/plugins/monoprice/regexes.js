/**
 * Regex to match a newline character that delimits the end of a command respose
 */
exports.reCommandResponseDelimiter = /[\r\n]+/;

/**
 * Regex for a zone status report  `?ID`
 * Returns named groups
 */
// /^#[>?](?<UNIT>\d)(?<ZONE>\d)(?<PA>\d{2})(?<PR>\d{2})(?<MU>\d{2})(?<DT>\d{2})(?<VO>\d{2})(?<TR>\d{2})(?<BS>\d{2})(?<BL>\d{2})(?<CH>\d{2})(?<LS>\d{2})$/g;
exports.reZoneStatus =
  /^#[>?](?<UNIT>\d)(?<ZONE>\d)(?<RESP>(?<PA>\d{2})(?<PR>\d{2})(?<MU>\d{2})(?<DT>\d{2})(?<VO>\d{2})(?<TR>\d{2})(?<BS>\d{2})(?<BL>\d{2})(?<CH>\d{2})(?<LS>\d{2})){0,1}\s*$/g;

/**
 * Regex for a command status response `?IDxx`
 */
exports.reCommandResponse =
  /^#[>?](?<UNIT>\d)(?<ZONE>\d)(?<RESP>(?<CMD>PP|PA|PR|MU|DT|VO|TR|BS|BL|CH|LS)(?<VAL>\d{2})){0,1}\s*$/g;

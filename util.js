/**
 * Created by yan on 16-3-9.
 */
exports.parseOID = function (str) {
  return str.split('.').map(i=>parseInt(i, 10));
}
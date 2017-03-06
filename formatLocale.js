'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = formatLocale;
function formatLocale(l) {
  var tokens = l.split(/[-_]/);
  tokens[0] = tokens[0].toLowerCase();
  if (tokens[1]) {
    tokens[1] = tokens[1].toUpperCase();
  }
  return tokens.join('-');
}
//# sourceMappingURL=formatLocale.js.map

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (filename) {
  return localeFileRegExp.test(filename);
};

var localeFileRegExp = /^[a-z]{2}((-|_)[a-z]{2})?\.(js|json)$/i;
//# sourceMappingURL=isLocaleFile.js.map

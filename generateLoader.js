'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _taggedTemplateLiteral2 = require('babel-runtime/helpers/taggedTemplateLiteral');

var _taggedTemplateLiteral3 = _interopRequireDefault(_taggedTemplateLiteral2);

var _templateObject = (0, _taggedTemplateLiteral3.default)(['export default function loadLocale(locale) {\n      return new Promise((resolve) => {\n        switch (locale) {', '\n          default:\n            resolve({});\n            break;\n        }\n      });\n    }\n'], ['export default function loadLocale(locale) {\n      return new Promise((resolve) => {\n        switch (locale) {', '\n          default:\n            resolve({});\n            break;\n        }\n      });\n    }\\n']);

exports.default = generateLoader;

var _dedent = require('dedent');

var _dedent2 = _interopRequireDefault(_dedent);

var _formatLocale = require('./formatLocale');

var _formatLocale2 = _interopRequireDefault(_formatLocale);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function generateLoader(_ref) {
  var files = _ref.files,
      _ref$chunk = _ref.chunk,
      chunk = _ref$chunk === undefined ? true : _ref$chunk;

  var cases = files.map(function (f) {
    var basename = f.replace(/\.(js|json)$/i, '');
    var locale = (0, _formatLocale2.default)(basename);
    var padding = chunk ? '  ' : '';
    var code = '\n            ' + padding + 'const data = require(\'./' + basename + '\');\n            ' + padding + 'resolve(data.__esModule === true ? data.default : data);';
    if (chunk) {
      code = '\n            require.ensure([\'./' + basename + '\'], (require) => {' + code + '\n            }, \'' + locale + '\');';
    }
    return '\n          case \'' + locale + '\': {' + code + '\n            break;\n          }';
  });
  return (0, _dedent2.default)(_templateObject, cases.join(''));
}
//# sourceMappingURL=generateLoader.js.map
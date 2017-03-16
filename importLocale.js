'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var readXlf = function () {
  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(_ref3) {
    var _this = this;

    var localizationFolder = _ref3.localizationFolder,
        supportedLocales = _ref3.supportedLocales;
    var output;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            output = {};
            _context2.next = 3;
            return _promise2.default.all(supportedLocales.map(function () {
              var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(locale) {
                var fileName, filePath, content;
                return _regenerator2.default.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        fileName = locale + '.xlf';
                        filePath = _path2.default.resolve(localizationFolder, fileName);
                        _context.next = 4;
                        return _fsPromise2.default.exists(filePath);

                      case 4:
                        _context.t0 = _context.sent;

                        if (!_context.t0) {
                          _context.next = 9;
                          break;
                        }

                        _context.next = 8;
                        return _fsPromise2.default.stat(filePath);

                      case 8:
                        _context.t0 = _context.sent.isFile();

                      case 9:
                        if (!_context.t0) {
                          _context.next = 14;
                          break;
                        }

                        _context.next = 12;
                        return _fsPromise2.default.readFile(filePath, 'utf8');

                      case 12:
                        content = _context.sent;

                        output[locale] = extractXlfData({ locale: locale, content: content });

                      case 14:
                      case 'end':
                        return _context.stop();
                    }
                  }
                }, _callee, _this);
              }));

              return function (_x2) {
                return _ref4.apply(this, arguments);
              };
            }()));

          case 3:
            return _context2.abrupt('return', output);

          case 4:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function readXlf(_x) {
    return _ref2.apply(this, arguments);
  };
}();

var mergeToFiles = function () {
  var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(_ref7) {
    var _this2 = this;

    var rawData = _ref7.rawData,
        translatedData = _ref7.translatedData,
        sourceFolder = _ref7.sourceFolder,
        sourceLocale = _ref7.sourceLocale,
        trailingComma = _ref7.trailingComma;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return _promise2.default.all((0, _keys2.default)(translatedData).map(function () {
              var _ref8 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(locale) {
                return _regenerator2.default.wrap(function _callee4$(_context4) {
                  while (1) {
                    switch (_context4.prev = _context4.next) {
                      case 0:
                        _context4.next = 2;
                        return _promise2.default.all((0, _keys2.default)(translatedData[locale]).map(function () {
                          var _ref9 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(fileName) {
                            var filePath, folderPath, original, translated, mergedData, mergedContent;
                            return _regenerator2.default.wrap(function _callee3$(_context3) {
                              while (1) {
                                switch (_context3.prev = _context3.next) {
                                  case 0:
                                    filePath = _path2.default.resolve(sourceFolder, fileName);
                                    folderPath = _path2.default.dirname(filePath);
                                    original = rawData[folderPath] && rawData[folderPath].files && rawData[folderPath].files[locale] && rawData[folderPath].files[locale].data || {};
                                    translated = translatedData[locale][fileName];
                                    mergedData = (0, _extends3.default)({}, original);

                                    (0, _keys2.default)(translated).forEach(function (key) {
                                      mergedData[key] = (0, _extends3.default)({}, translated[key], {
                                        isTemplate: original[key] && original[key].isTemplate === true || translated[key].isTemplate === true
                                      });
                                    });
                                    mergedContent = generateMergedContent((0, _extends3.default)({}, rawData[folderPath].files[sourceLocale], {
                                      mergedData: mergedData,
                                      trailingComma: trailingComma
                                    }));
                                    _context3.next = 9;
                                    return _fsPromise2.default.writeFile(_path2.default.resolve(sourceFolder, fileName), mergedContent);

                                  case 9:
                                  case 'end':
                                    return _context3.stop();
                                }
                              }
                            }, _callee3, _this2);
                          }));

                          return function (_x5) {
                            return _ref9.apply(this, arguments);
                          };
                        }()));

                      case 2:
                      case 'end':
                        return _context4.stop();
                    }
                  }
                }, _callee4, _this2);
              }));

              return function (_x4) {
                return _ref8.apply(this, arguments);
              };
            }()));

          case 2:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));

  return function mergeToFiles(_x3) {
    return _ref6.apply(this, arguments);
  };
}();

var importLocale = function () {
  var _ref10 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6() {
    var _ref11 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref11$sourceFolder = _ref11.sourceFolder,
        sourceFolder = _ref11$sourceFolder === undefined ? _defaults.defaultSourceFolder : _ref11$sourceFolder,
        _ref11$localizationFo = _ref11.localizationFolder,
        localizationFolder = _ref11$localizationFo === undefined ? _defaults.defaultLocalizationFolder : _ref11$localizationFo,
        _ref11$sourceLocale = _ref11.sourceLocale,
        sourceLocale = _ref11$sourceLocale === undefined ? _defaults.defaultSourceLocale : _ref11$sourceLocale,
        _ref11$supportedLocal = _ref11.supportedLocales,
        supportedLocales = _ref11$supportedLocal === undefined ? _defaults.defaultSupportedLocales : _ref11$supportedLocal,
        _ref11$trailingComma = _ref11.trailingComma,
        trailingComma = _ref11$trailingComma === undefined ? true : _ref11$trailingComma;

    var rawData, translatedData;
    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return (0, _getRawData2.default)({
              sourceFolder: sourceFolder,
              sourceLocale: sourceLocale,
              supportedLocales: supportedLocales
            });

          case 2:
            rawData = _context6.sent;
            _context6.next = 5;
            return readXlf({
              localizationFolder: localizationFolder,
              supportedLocales: supportedLocales
            });

          case 5:
            translatedData = _context6.sent;
            _context6.next = 8;
            return mergeToFiles({
              rawData: rawData,
              translatedData: translatedData,
              sourceFolder: sourceFolder,
              sourceLocale: sourceLocale,
              trailingComma: trailingComma
            });

          case 8:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, this);
  }));

  return function importLocale() {
    return _ref10.apply(this, arguments);
  };
}();

var _fsPromise = require('fs-promise');

var _fsPromise2 = _interopRequireDefault(_fsPromise);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _xmlJs = require('xml-js');

var _xmlJs2 = _interopRequireDefault(_xmlJs);

var _getRawData = require('./getRawData');

var _getRawData2 = _interopRequireDefault(_getRawData);

var _defaults = require('./defaults');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function extractKey(str) {
  return str.substring(1, str.length - 1);
}

function extractXlfData(_ref) {
  var locale = _ref.locale,
      content = _ref.content;

  var data = _xmlJs2.default.xml2js(content, { compact: true });
  var output = {};
  if (data.xliff && data.xliff.file) {
    var files = Array.isArray(data.xliff.file) ? data.xliff.file : [data.xliff.file];
    files.forEach(function (fileData) {
      if (fileData._attributes && fileData._attributes['target-language'] === locale && fileData.body && fileData.body['trans-unit']) {
        var fileName = fileData._attributes.original;
        output[fileName] = {};
        var units = Array.isArray(fileData.body['trans-unit']) ? fileData.body['trans-unit'] : [fileData.body['trans-unit']];
        units.forEach(function (unit) {
          if (unit._attributes && unit._attributes.id && unit.target && unit.target._text) {
            output[fileName][extractKey(unit._attributes.id)] = {
              value: JSON.parse('"' + unit.target._text.replace(/"/g, '\\"') + '"'),
              isTemplate: unit._attributes.template === 'true'
            };
          }
        });
      }
    });
  }
  return output;
}

function generateMergedContent(_ref5) {
  var content = _ref5.content,
      dataStartIndex = _ref5.dataStartIndex,
      dataEndIndex = _ref5.dataEndIndex,
      mergedData = _ref5.mergedData,
      trailingComma = _ref5.trailingComma;

  var startString = content.substring(0, dataStartIndex);
  var endString = content.substring(dataEndIndex);
  var keys = (0, _keys2.default)(mergedData);
  var lastIdx = keys.length - 1;
  var dataString = keys.map(function (key, idx) {
    var comma = idx < lastIdx || trailingComma ? ',' : '';
    var value = mergedData[key].isTemplate ? '`' + mergedData[key].value + '`' : '\'' + mergedData[key].value.replace(/'/g, '\\\'') + '\'';
    return '  ' + key + ': ' + value + comma;
  }).join('\n');
  return startString + '\n' + dataString + '\n' + endString;
}

exports.default = importLocale;
//# sourceMappingURL=importLocale.js.map

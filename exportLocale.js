'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.exportXlf = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var exportXlf = exports.exportXlf = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(_ref2) {
    var _this = this;

    var rawData = _ref2.rawData,
        sourceLocale = _ref2.sourceLocale,
        supportedLocales = _ref2.supportedLocales,
        sourceFolder = _ref2.sourceFolder,
        localizationFolder = _ref2.localizationFolder,
        exportType = _ref2.exportType;
    var xlfData, allLocales;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            // console.log(JSON.stringify(rawData, null, 2));
            xlfData = {};
            allLocales = supportedLocales.filter(function (locale) {
              return locale !== sourceLocale;
            });


            allLocales.forEach(function (locale) {
              xlfData[locale] = {
                _declaration: {
                  _attributes: {
                    version: '1.0'
                  }
                },
                xliff: {
                  _attributes: {
                    version: '1.2',
                    xmlns: 'urn:oasis:names:tc:xliff:document:1.2'
                  }
                }
              };
            });

            (0, _keys2.default)(rawData).forEach(function (folderPath) {
              var folderData = rawData[folderPath];
              var sourceFile = folderData.files[sourceLocale];
              if (sourceFile) {
                var keys = (0, _keys2.default)(sourceFile.data);
                supportedLocales.forEach(function (locale) {
                  if (locale !== sourceLocale) {
                    var targetFile = folderData.files[locale];
                    var fileName = targetFile && targetFile.file || locale + '.js';
                    var original = _path2.default.relative(sourceFolder, _path2.default.join(folderData.path, fileName));
                    var exportKeys = exportType === _exportTypes2.default.full ? keys.slice() : keys.filter(function (key) {
                      return !targetFile || !targetFile.data[key];
                    });

                    if (exportKeys.length) {
                      var data = {
                        _attributes: {
                          original: original,
                          'source-language': sourceLocale,
                          'target-language': locale,
                          datatype: 'plaintext'
                        },
                        body: {
                          'trans-unit': exportKeys.map(function (key) {
                            return {
                              _attributes: {
                                id: '[' + key + ']',
                                template: sourceFile.data[key].isTemplate ? 'true' : 'false'
                              },
                              source: {
                                _text: sourceFile.data[key].value
                              },
                              target: {
                                _text: targetFile && targetFile.data[key] && targetFile.data[key].value || sourceFile.data[key].value
                              }
                            };
                          })
                        }
                      };

                      if (!xlfData[locale].xliff.file) {
                        xlfData[locale].xliff.file = [];
                      }
                      xlfData[locale].xliff.file.push(data);
                    }
                  }
                });
              }
            });
            _context2.next = 6;
            return _fsPromise2.default.exists(localizationFolder);

          case 6:
            if (_context2.sent) {
              _context2.next = 9;
              break;
            }

            _context2.next = 9;
            return (0, _mkdirpPromise2.default)(localizationFolder);

          case 9:
            _context2.next = 11;
            return _promise2.default.all(allLocales.map(function () {
              var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(locale) {
                var fileName;
                return _regenerator2.default.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        fileName = _path2.default.resolve(localizationFolder, locale + '.xlf');
                        _context.next = 3;
                        return _fsPromise2.default.writeFile(fileName, _xmlJs2.default.json2xml(xlfData[locale], { compact: true, spaces: 4 }));

                      case 3:
                      case 'end':
                        return _context.stop();
                    }
                  }
                }, _callee, _this);
              }));

              return function (_x2) {
                return _ref3.apply(this, arguments);
              };
            }()));

          case 11:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function exportXlf(_x) {
    return _ref.apply(this, arguments);
  };
}();

var exportLocale = function () {
  var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3() {
    var _ref5 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref5$sourceFolder = _ref5.sourceFolder,
        sourceFolder = _ref5$sourceFolder === undefined ? _defaults.defaultSourceFolder : _ref5$sourceFolder,
        _ref5$localizationFol = _ref5.localizationFolder,
        localizationFolder = _ref5$localizationFol === undefined ? _defaults.defaultLocalizationFolder : _ref5$localizationFol,
        _ref5$sourceLocale = _ref5.sourceLocale,
        sourceLocale = _ref5$sourceLocale === undefined ? _defaults.defaultSourceLocale : _ref5$sourceLocale,
        _ref5$supportedLocale = _ref5.supportedLocales,
        supportedLocales = _ref5$supportedLocale === undefined ? _defaults.defaultSupportedLocales : _ref5$supportedLocale,
        _ref5$exportType = _ref5.exportType,
        exportType = _ref5$exportType === undefined ? _exportTypes2.default.diff : _ref5$exportType;

    var rawData;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return (0, _getRawData2.default)({
              sourceFolder: sourceFolder,
              sourceLocale: sourceLocale,
              supportedLocales: supportedLocales
            });

          case 2:
            rawData = _context3.sent;
            _context3.next = 5;
            return exportXlf({
              rawData: rawData,
              sourceFolder: sourceFolder,
              localizationFolder: localizationFolder,
              sourceLocale: sourceLocale,
              supportedLocales: supportedLocales,
              exportType: exportType
            });

          case 5:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function exportLocale() {
    return _ref4.apply(this, arguments);
  };
}();

var _fsPromise = require('fs-promise');

var _fsPromise2 = _interopRequireDefault(_fsPromise);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _xmlJs = require('xml-js');

var _xmlJs2 = _interopRequireDefault(_xmlJs);

var _mkdirpPromise = require('mkdirp-promise');

var _mkdirpPromise2 = _interopRequireDefault(_mkdirpPromise);

var _getRawData = require('./getRawData');

var _getRawData2 = _interopRequireDefault(_getRawData);

var _defaults = require('./defaults');

var _exportTypes = require('./exportTypes');

var _exportTypes2 = _interopRequireDefault(_exportTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = exportLocale;
//# sourceMappingURL=exportLocale.js.map

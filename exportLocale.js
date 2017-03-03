'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var getLoaderFiles = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(fileList) {
    var _this = this;

    var loaderFiles;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            loaderFiles = new _set2.default();
            _context2.next = 3;
            return _promise2.default.all(fileList.map(function () {
              var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(file) {
                var content;
                return _regenerator2.default.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return _fsPromise2.default.stat(file);

                      case 2:
                        if (!_context.sent.isFile()) {
                          _context.next = 7;
                          break;
                        }

                        _context.next = 5;
                        return _fsPromise2.default.readFile(file, 'utf8');

                      case 5:
                        content = _context.sent;

                        if (_loaderRegExp2.default.test(content)) {
                          loaderFiles.add(file);
                        }

                      case 7:
                      case 'end':
                        return _context.stop();
                    }
                  }
                }, _callee, _this);
              }));

              return function (_x2) {
                return _ref2.apply(this, arguments);
              };
            }()));

          case 3:
            return _context2.abrupt('return', [].concat((0, _toConsumableArray3.default)(loaderFiles)));

          case 4:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function getLoaderFiles(_x) {
    return _ref.apply(this, arguments);
  };
}();

var extractData = function () {
  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(localeFile) {
    var content, parsed, idx, len, capturing, data, token, _parseLine, _parseLine2, item, newIdx;

    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return _fsPromise2.default.readFile(localeFile, 'utf8');

          case 2:
            content = _context3.sent;
            parsed = (0, _babylon.parse)(content, { sourceType: 'module' });
            idx = 0;
            len = parsed.tokens.length;
            capturing = false;
            data = {};

          case 8:
            if (!(idx < len)) {
              _context3.next = 28;
              break;
            }

            token = parsed.tokens[idx];

            if (!(token.type === _babylon.tokTypes._export && parsed.tokens[idx + 1].type === _babylon.tokTypes._default && parsed.tokens[idx + 2].type === _babylon.tokTypes.braceL)) {
              _context3.next = 15;
              break;
            }

            capturing = true;
            idx += 3;
            _context3.next = 26;
            break;

          case 15:
            if (!capturing) {
              _context3.next = 25;
              break;
            }

            if (!(token.type === _babylon.tokTypes.braceR)) {
              _context3.next = 20;
              break;
            }

            return _context3.abrupt('break', 28);

          case 20:
            _parseLine = parseLine(parsed.tokens, idx), _parseLine2 = (0, _slicedToArray3.default)(_parseLine, 2), item = _parseLine2[0], newIdx = _parseLine2[1];

            data[item.key] = item.value;
            idx = newIdx;

          case 23:
            _context3.next = 26;
            break;

          case 25:
            idx += 1;

          case 26:
            _context3.next = 8;
            break;

          case 28:
            return _context3.abrupt('return', {
              content: content,
              data: data
            });

          case 29:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function extractData(_x3) {
    return _ref3.apply(this, arguments);
  };
}();

var getLocaleData = function () {
  var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(_ref6) {
    var _this2 = this;

    var folderPath = _ref6.folderPath,
        sourceLocale = _ref6.sourceLocale,
        supportedLocales = _ref6.supportedLocales;
    var localeFiles, localeData;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return _fsPromise2.default.readdir(folderPath);

          case 2:
            _context5.t0 = _isLocaleFile2.default;
            localeFiles = _context5.sent.filter(_context5.t0);
            localeData = {
              path: folderPath,
              files: {}
            };
            _context5.next = 7;
            return _promise2.default.all(localeFiles.map(function () {
              var _ref7 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(file) {
                var locale;
                return _regenerator2.default.wrap(function _callee4$(_context4) {
                  while (1) {
                    switch (_context4.prev = _context4.next) {
                      case 0:
                        locale = (0, _formatLocale2.default)(file.replace(/\.(js|json)$/i, ''));

                        if (!(locale === sourceLocale || supportedLocales.indexOf(locale) > -1)) {
                          _context4.next = 8;
                          break;
                        }

                        _context4.t0 = _extends3.default;
                        _context4.t1 = {
                          file: file,
                          locale: locale
                        };
                        _context4.next = 6;
                        return extractData(_path2.default.resolve(folderPath, file));

                      case 6:
                        _context4.t2 = _context4.sent;
                        localeData.files[locale] = (0, _context4.t0)(_context4.t1, _context4.t2);

                      case 8:
                      case 'end':
                        return _context4.stop();
                    }
                  }
                }, _callee4, _this2);
              }));

              return function (_x5) {
                return _ref7.apply(this, arguments);
              };
            }()));

          case 7:
            return _context5.abrupt('return', localeData);

          case 8:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));

  return function getLocaleData(_x4) {
    return _ref5.apply(this, arguments);
  };
}();

var getRawData = function () {
  var _ref8 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7(_ref9) {
    var _this3 = this;

    var src = _ref9.src,
        sourceLocale = _ref9.sourceLocale,
        supportedLocales = _ref9.supportedLocales;
    var fileList, loaderFiles, rawData;
    return _regenerator2.default.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return new _promise2.default(function (resolve, reject) {
              (0, _glob2.default)(src, function (err, m) {
                if (err) {
                  return reject(err);
                }
                return resolve(m);
              });
            });

          case 2:
            fileList = _context7.sent;
            _context7.next = 5;
            return getLoaderFiles(fileList);

          case 5:
            loaderFiles = _context7.sent;
            rawData = [];
            _context7.next = 9;
            return _promise2.default.all(loaderFiles.map(function () {
              var _ref10 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(f) {
                var folderPath;
                return _regenerator2.default.wrap(function _callee6$(_context6) {
                  while (1) {
                    switch (_context6.prev = _context6.next) {
                      case 0:
                        folderPath = _path2.default.dirname(f);
                        _context6.t0 = rawData;
                        _context6.next = 4;
                        return getLocaleData({ folderPath: folderPath, sourceLocale: sourceLocale, supportedLocales: supportedLocales });

                      case 4:
                        _context6.t1 = _context6.sent;

                        _context6.t0.push.call(_context6.t0, _context6.t1);

                      case 6:
                      case 'end':
                        return _context6.stop();
                    }
                  }
                }, _callee6, _this3);
              }));

              return function (_x7) {
                return _ref10.apply(this, arguments);
              };
            }()));

          case 9:
            return _context7.abrupt('return', rawData);

          case 10:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, this);
  }));

  return function getRawData(_x6) {
    return _ref8.apply(this, arguments);
  };
}();

var exportXlf = function () {
  var _ref11 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee9(_ref12) {
    var _this4 = this;

    var rawData = _ref12.rawData,
        sourceLocale = _ref12.sourceLocale,
        supportedLocales = _ref12.supportedLocales,
        dest = _ref12.dest;
    var xlfData, allLocales;
    return _regenerator2.default.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
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

            rawData.forEach(function (folderData) {
              var sourceFile = folderData.files[sourceLocale];
              if (sourceFile) {
                var keys = (0, _keys2.default)(sourceFile.data);
                supportedLocales.forEach(function (locale) {
                  if (locale !== sourceLocale) {
                    var targetFile = folderData.files[locale];
                    var fileName = targetFile && targetFile.file || locale + '.js';
                    var original = _path2.default.join(folderData.path, fileName);
                    var missingKeys = keys.filter(function (key) {
                      return !targetFile || !targetFile.data[key];
                    });

                    if (missingKeys.length) {
                      var data = {
                        _attributes: {
                          original: original,
                          'source-language': sourceLocale,
                          'target-language': locale,
                          datatype: 'plaintext'
                        },
                        body: {
                          'trans-unit': missingKeys.map(function (key) {
                            return {
                              _attributes: {
                                id: '[' + key + ']'
                              },
                              source: {
                                _text: sourceFile.data[key]
                              },
                              target: {
                                _text: sourceFile.data[key]
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
            _context9.next = 6;
            return _fsPromise2.default.exists(dest);

          case 6:
            if (_context9.sent) {
              _context9.next = 9;
              break;
            }

            _context9.next = 9;
            return (0, _mkdirpPromise2.default)(dest);

          case 9:
            _context9.next = 11;
            return _promise2.default.all(allLocales.map(function () {
              var _ref13 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee8(locale) {
                var fileName;
                return _regenerator2.default.wrap(function _callee8$(_context8) {
                  while (1) {
                    switch (_context8.prev = _context8.next) {
                      case 0:
                        fileName = _path2.default.resolve(dest, locale + '.xlf');
                        _context8.next = 3;
                        return _fsPromise2.default.writeFile(fileName, _xmlJs2.default.json2xml(xlfData[locale], { compact: true, spaces: 4 }));

                      case 3:
                      case 'end':
                        return _context8.stop();
                    }
                  }
                }, _callee8, _this4);
              }));

              return function (_x9) {
                return _ref13.apply(this, arguments);
              };
            }()));

          case 11:
          case 'end':
            return _context9.stop();
        }
      }
    }, _callee9, this);
  }));

  return function exportXlf(_x8) {
    return _ref11.apply(this, arguments);
  };
}();

var _fsPromise = require('fs-promise');

var _fsPromise2 = _interopRequireDefault(_fsPromise);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _xmlJs = require('xml-js');

var _xmlJs2 = _interopRequireDefault(_xmlJs);

var _mkdirpPromise = require('mkdirp-promise');

var _mkdirpPromise2 = _interopRequireDefault(_mkdirpPromise);

var _babylon = require('babylon');

var _isLocaleFile = require('./isLocaleFile');

var _isLocaleFile2 = _interopRequireDefault(_isLocaleFile);

var _loaderRegExp = require('./loaderRegExp');

var _loaderRegExp2 = _interopRequireDefault(_loaderRegExp);

var _formatLocale = require('./formatLocale');

var _formatLocale2 = _interopRequireDefault(_formatLocale);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parseLine(tokens, startingIdx) {
  var idx = startingIdx;
  var token = tokens[idx];
  var keyArray = [];
  do {
    keyArray.push(token.value || token.type.label);
    idx += 1;
    token = tokens[idx];
  } while (token.type !== _babylon.tokTypes.colon);
  return [{
    key: keyArray.join(''),
    value: tokens[idx + 1].value
  }, idx + 3];
}

function compileFolderData(files) {
  var output = {};
  files.forEach(function (_ref4) {
    var locale = _ref4.locale,
        data = _ref4.data;

    (0, _keys2.default)(data).forEach(function (key) {
      if (!output[key]) {
        output[key] = {};
      }
      output[key][locale] = data[key];
    });
  });
  return output;
}

exports.default = function () {
  var _ref14 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee10() {
    var _ref15 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref15$src = _ref15.src,
        src = _ref15$src === undefined ? './src/**/*' : _ref15$src,
        _ref15$dest = _ref15.dest,
        dest = _ref15$dest === undefined ? './localization' : _ref15$dest,
        _ref15$sourceLocale = _ref15.sourceLocale,
        sourceLocale = _ref15$sourceLocale === undefined ? 'en-US' : _ref15$sourceLocale,
        _ref15$supportedLocal = _ref15.supportedLocales,
        supportedLocales = _ref15$supportedLocal === undefined ? ['en-GB', 'en-CA', 'fr-FR', 'fr-CA', 'de-DE'] : _ref15$supportedLocal;

    var rawData;
    return _regenerator2.default.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            _context10.next = 2;
            return getRawData({
              src: src,
              sourceLocale: sourceLocale,
              supportedLocales: supportedLocales
            });

          case 2:
            rawData = _context10.sent;
            _context10.next = 5;
            return exportXlf({
              rawData: rawData,
              dest: dest,
              sourceLocale: sourceLocale,
              supportedLocales: supportedLocales
            });

          case 5:
          case 'end':
            return _context10.stop();
        }
      }
    }, _callee10, this);
  }));

  function exportLocale() {
    return _ref14.apply(this, arguments);
  }

  return exportLocale;
}();
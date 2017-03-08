'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLocaleData = exports.extractData = exports.getLoaderFiles = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

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

var getLoaderFiles = exports.getLoaderFiles = function () {
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

var extractData = exports.extractData = function () {
  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(localeFile) {
    var content, parsed, idx, len, capturing, data, dataStartIndex, dataEndIndex, token, _parseLine, _parseLine2, item, newIdx;

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
            dataStartIndex = null;
            dataEndIndex = null;

          case 10:
            if (!(idx < len && idx !== -1)) {
              _context3.next = 32;
              break;
            }

            token = parsed.tokens[idx];

            if (!(token.type === _babylon.tokTypes._export && parsed.tokens[idx + 1].type === _babylon.tokTypes._default && parsed.tokens[idx + 2].type === _babylon.tokTypes.braceL)) {
              _context3.next = 18;
              break;
            }

            dataStartIndex = parsed.tokens[idx + 2].end;
            capturing = true;
            idx += 3;
            _context3.next = 30;
            break;

          case 18:
            if (!capturing) {
              _context3.next = 29;
              break;
            }

            if (!(token.type === _babylon.tokTypes.braceR)) {
              _context3.next = 24;
              break;
            }

            dataEndIndex = token.start;
            return _context3.abrupt('break', 32);

          case 24:
            _parseLine = parseLine(parsed.tokens, idx), _parseLine2 = (0, _slicedToArray3.default)(_parseLine, 2), item = _parseLine2[0], newIdx = _parseLine2[1];

            data[item.key] = item;
            idx = newIdx;

          case 27:
            _context3.next = 30;
            break;

          case 29:
            idx += 1;

          case 30:
            _context3.next = 10;
            break;

          case 32:
            return _context3.abrupt('return', {
              content: content,
              data: data,
              dataStartIndex: dataStartIndex,
              dataEndIndex: dataEndIndex
            });

          case 33:
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

var getLocaleData = exports.getLocaleData = function () {
  var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(_ref5) {
    var _this2 = this;

    var folderPath = _ref5.folderPath,
        sourceLocale = _ref5.sourceLocale,
        supportedLocales = _ref5.supportedLocales;
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
              var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(file) {
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
                return _ref6.apply(this, arguments);
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
    return _ref4.apply(this, arguments);
  };
}();

exports.parseLine = parseLine;

var _fsPromise = require('fs-promise');

var _fsPromise2 = _interopRequireDefault(_fsPromise);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

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
    keyArray.push(typeof token.value !== 'undefined' ? token.value : token.type.label);
    idx += 1;
    token = tokens[idx];
  } while (token.type !== _babylon.tokTypes.colon);
  var valueArray = [];
  idx += 1;
  token = tokens[idx];
  var isTemplate = false;
  var inTemplate = false;
  do {
    if (token.type === _babylon.tokTypes.backQuote) {
      isTemplate = true;
      inTemplate = !inTemplate;
    } else {
      valueArray.push(typeof token.value !== 'undefined' ? token.value : token.type.label);
    }
    idx += 1;
    token = tokens[idx];
  } while (token.type !== _babylon.tokTypes.comma && (inTemplate || token.type !== _babylon.tokTypes.braceR));
  var value = (0, _stringify2.default)(valueArray.join(''));
  return [{
    key: keyArray.join(''),
    value: value.substring(1, value.length - 1),
    isTemplate: isTemplate
  }, token.type !== _babylon.tokTypes.braceR ? idx + 1 : -1];
}

exports.default = function () {
  var _ref7 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7(_ref8) {
    var _this3 = this;

    var sourceFolder = _ref8.sourceFolder,
        sourceLocale = _ref8.sourceLocale,
        supportedLocales = _ref8.supportedLocales;
    var fileList, loaderFiles, rawData;
    return _regenerator2.default.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return new _promise2.default(function (resolve, reject) {
              (0, _glob2.default)(sourceFolder + '/**', function (err, m) {
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
            rawData = {};
            _context7.next = 9;
            return _promise2.default.all(loaderFiles.map(function () {
              var _ref9 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(f) {
                var folderPath;
                return _regenerator2.default.wrap(function _callee6$(_context6) {
                  while (1) {
                    switch (_context6.prev = _context6.next) {
                      case 0:
                        folderPath = _path2.default.resolve(_path2.default.dirname(f));
                        _context6.next = 3;
                        return getLocaleData({
                          folderPath: folderPath,
                          sourceLocale: sourceLocale,
                          supportedLocales: supportedLocales
                        });

                      case 3:
                        rawData[folderPath] = _context6.sent;

                      case 4:
                      case 'end':
                        return _context6.stop();
                    }
                  }
                }, _callee6, _this3);
              }));

              return function (_x7) {
                return _ref9.apply(this, arguments);
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

  function getRawData(_x6) {
    return _ref7.apply(this, arguments);
  }

  return getRawData;
}();
//# sourceMappingURL=getRawData.js.map

'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _fsPromise = require('fs-promise');

var _fsPromise2 = _interopRequireDefault(_fsPromise);

var _generateLoader = require('./generateLoader');

var _generateLoader2 = _interopRequireDefault(_generateLoader);

var _isLocaleFile = require('./isLocaleFile');

var _isLocaleFile2 = _interopRequireDefault(_isLocaleFile);

var _loaderRegExp = require('./loaderRegExp');

var _loaderRegExp2 = _interopRequireDefault(_loaderRegExp);

var _noChunkRegExp = require('./noChunkRegExp');

var _noChunkRegExp2 = _interopRequireDefault(_noChunkRegExp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function localeLoader(content) {
  var _this = this;

  var callback = this.async();
  if (_loaderRegExp2.default.test(content)) {
    (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
      var files;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return _fsPromise2.default.readdir(_this.context);

            case 2:
              _context.t0 = function (f) {
                return (0, _isLocaleFile2.default)(f);
              };

              files = _context.sent.filter(_context.t0);

              callback(null, (0, _generateLoader2.default)({
                files: files,
                chunk: !_noChunkRegExp2.default.test(content)
              }));

            case 5:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, _this);
    }))();
  } else {
    callback(null, content);
  }
};
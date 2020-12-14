'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var mobx = require('mobx');

var type = function type(arr) {
  return /^\[object (.*)\]/.exec(Object.prototype.toString.call(arr))[1].toLowerCase();
};

var updater = mobx.action(function () {
  var _this = this;

  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var key = args[0],
      value = args[1];

  if (type(key) === 'object') {
    for (var n in key) {
      this[n] = key[n];
    }

    return this;
  } else {
    if (args.length === 1) {
      return mobx.action(function (value) {
        _this[key] = value;
        return _this;
      });
    }

    if (args.length > 1) {
      this[key] = value;
      return this;
    }
  }
});
var createStore = function createStore(state) {
  var store = mobx.observable(state);
  store.update = updater;
  return store;
};

exports.createStore = createStore;
exports.updater = updater;

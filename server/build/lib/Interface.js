"use strict";

var _flowRuntime = require("flow-runtime");

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function bar(x, y) {
    var _xType = _flowRuntime2.default.string();

    var _yType = _flowRuntime2.default.ref("integer");

    _flowRuntime2.default.param("x", _xType).assert(x);

    _flowRuntime2.default.param("y", _yType).assert(y);

    console.log(x);
}

// bar(10, 20);

_flowRuntime2.default.annotate(bar, _flowRuntime2.default.function(_flowRuntime2.default.param("x", _flowRuntime2.default.string()), _flowRuntime2.default.param("y", _flowRuntime2.default.ref("integer"))));
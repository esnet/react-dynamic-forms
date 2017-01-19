"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _Group = require("./Group");

var _Group2 = _interopRequireDefault(_Group);

var _TextEdit = require("./TextEdit");

var _TextEdit2 = _interopRequireDefault(_TextEdit);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; } /**
                                                                                                                                                                                                                              *  Copyright (c) 2015, The Regents of the University of California,
                                                                                                                                                                                                                              *  through Lawrence Berkeley National Laboratory (subject to receipt
                                                                                                                                                                                                                              *  of any required approvals from the U.S. Dept. of Energy).
                                                                                                                                                                                                                              *  All rights reserved.
                                                                                                                                                                                                                              *
                                                                                                                                                                                                                              *  This source code is licensed under the BSD-style license found in the
                                                                                                                                                                                                                              *  LICENSE file in the root directory of this source tree.
                                                                                                                                                                                                                              */

/**
 * Wraps the TextEdit widget
 */
exports.default = _react2.default.createClass({
  displayName: "TextEditGroup",
  render: function render() {
    var _props = this.props,
        attr = _props.attr,
        others = _objectWithoutProperties(_props, ["attr"]);

    return _react2.default.createElement(
      _Group2.default,
      { attr: attr },
      _react2.default.createElement(_TextEdit2.default, _extends({ initialValue: attr.initialValue }, others))
    );
  }
});
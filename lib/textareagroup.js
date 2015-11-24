/**
 *  Copyright (c) 2015, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _group = require("./group");

var _group2 = _interopRequireDefault(_group);

var _textarea = require("./textarea");

var _textarea2 = _interopRequireDefault(_textarea);

/**
 * Wraps the textarea widget
 */
exports["default"] = _react2["default"].createClass({

    displayName: "TextAreaGroup",

    render: function render() {
        var _props = this.props;
        var attr = _props.attr;

        var others = _objectWithoutProperties(_props, ["attr"]);

        //eslint-disable-line
        return _react2["default"].createElement(
            _group2["default"],
            { attr: attr },
            _react2["default"].createElement(_textarea2["default"], _extends({ initialValue: attr.initialValue }, others))
        );
    }
});
module.exports = exports["default"];
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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactLibInvariant = require("react/lib/invariant");

var _reactLibInvariant2 = _interopRequireDefault(_reactLibInvariant);

exports["default"] = _react2["default"].createClass({

    displayName: "Attr",

    render: function render() {
        (0, _reactLibInvariant2["default"])(false, this.constructor.name + " elements are for schema\nconfiguration only and should not be rendered");
    }
});
module.exports = exports["default"];
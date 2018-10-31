"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.editAction = editAction;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function editAction(enabled, handler) {
    var iconStyle = {
        fontSize: 11
    };
    var editAction = _react2.default.createElement("span", null);
    if (enabled) {
        editAction = _react2.default.createElement(
            "span",
            { style: { marginLeft: 5 }, onClick: handler },
            _react2.default.createElement("i", {
                style: iconStyle,
                className: "glyphicon glyphicon-pencil icon edit-action active"
            })
        );
    } else {
        editAction = _react2.default.createElement("div", null);
    }
    return editAction;
} /**
   *  Copyright (c) 2018 - present, The Regents of the University of California,
   *  through Lawrence Berkeley National Laboratory (subject to receipt
   *  of any required approvals from the U.S. Dept. of Energy).
   *  All rights reserved.
   *
   *  This source code is licensed under the BSD-style license found in the
   *  LICENSE file in the root directory of this source tree.
   */
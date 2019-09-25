"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.textView = textView;
exports.linkView = linkView;
exports.markdownView = markdownView;
exports.dateView = dateView;
exports.colorView = colorView;

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactMarkdown = require("react-markdown");

var _reactMarkdown2 = _interopRequireDefault(_reactMarkdown);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function textView(value) {
    return _react2.default.createElement(
        "span",
        { style: { minHeight: 28 } },
        value
    );
} /**
   *  Copyright (c) 2018 - present, The Regents of the University of California,
   *  through Lawrence Berkeley National Laboratory (subject to receipt
   *  of any required approvals from the U.S. Dept. of Energy).
   *  All rights reserved.
   *
   *  This source code is licensed under the BSD-style license found in the
   *  LICENSE file in the root directory of this source tree.
   */

function linkView(value) {
    return _react2.default.createElement(
        "span",
        { style: { minHeight: 28 } },
        _react2.default.createElement(
            "a",
            null,
            value
        )
    );
}

function markdownView(value) {
    if (value === "" || _underscore2.default.isUndefined(value)) {
        return _react2.default.createElement("div", { style: { height: 28 } });
    } else {
        return _react2.default.createElement(
            "span",
            { style: { minHeight: 28 } },
            _react2.default.createElement(_reactMarkdown2.default, { source: value })
        );
    }
}

function dateView() {
    var fmt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "MM/DD/YYYYY";

    return function (d) {
        var s = d ? d.format(fmt) : "";
        return _react2.default.createElement(
            "span",
            { style: { minHeight: 28 } },
            s
        );
    };
}

function colorView(hex) {
    var style = {
        marginTop: 4,
        width: 14,
        height: 14,
        borderRadius: 2,
        background: hex,
        float: "left"
    };
    return _react2.default.createElement(
        "span",
        null,
        _react2.default.createElement("div", { style: style })
    );
}
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

/**
 * Filter text extry box.
 */
exports["default"] = _react2["default"].createClass({

    displayName: "TextFilter",

    getDefaultProps: function getDefaultProps() {
        return { width: "100%" };
    },

    getInitialState: function getInitialState() {
        return { value: this.props.initialValue };
    },

    onChange: function onChange(e) {
        this.setState({ value: e.target.value });
        if (this.props.onChange) {
            this.props.onChange(e.target.value);
        }
    },

    render: function render() {
        var style = {
            height: 27,
            marginTop: 1,
            width: this.props.width
        };

        return _react2["default"].createElement(
            "div",
            { className: "input-group", style: style },
            _react2["default"].createElement("input", { className: "form-control",
                type: "text",
                ref: "filter",
                placeholder: "Filter",
                defaultValue: this.state.value,
                onChange: this.onChange }),
            _react2["default"].createElement(
                "span",
                { className: "input-group-addon" },
                _react2["default"].createElement("span", { className: "glyphicon glyphicon-filter" })
            )
        );
    }
});
module.exports = exports["default"];
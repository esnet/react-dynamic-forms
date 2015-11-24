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

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

exports["default"] = _react2["default"].createClass({

    displayName: "OptionButtons",

    getInitialState: function getInitialState() {
        return { value: this.props.initialChoice };
    },

    handleChange: function handleChange(e) {
        var value = e.target.value;
        var missing = this.props.required && this._isEmpty(value);

        // State changes
        this.setState({ value: value, missing: missing });

        // Callbacks
        if (this.props.onChange) {
            this.props.onChange(this.props.attr, e.target.value);
        }
    },

    render: function render() {
        var _this = this;

        var classes = "btn-group btn-group-sm esdb-";

        if (!this.props.initialChoiceList) {
            throw new Error("No initial choice list supplied for attr '" + this.props.attr + "'");
        }

        var buttonElements = _underscore2["default"].map(this.props.initialChoiceList, function (choice, i) {
            if (Number(i) === Number(_this.props.initialChoice)) {
                return _react2["default"].createElement(
                    "button",
                    { type: "button",
                        className: "active btn btn-default",
                        key: i,
                        value: i,
                        onClick: _this.handleChange },
                    choice
                );
            } else {
                return _react2["default"].createElement(
                    "button",
                    { type: "button",
                        className: "btn btn-default",
                        key: i,
                        value: i,
                        onClick: _this.handleChange },
                    choice
                );
            }
        });

        var width = this.props.width ? this.props.width + "px" : "400px";

        // Key based on the choice list
        var choiceList = _underscore2["default"].map(this.props.initialChoiceList, function (choice) {
            return choice;
        });
        var list = choiceList.join("-");

        return _react2["default"].createElement(
            "div",
            {
                className: classes,
                key: list,
                width: width,
                style: { marginBottom: 5 } },
            buttonElements
        );
    }
});
module.exports = exports["default"];
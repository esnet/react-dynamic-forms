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
 * Search text extry box.
 */
exports["default"] = _react2["default"].createClass({

    displayName: "SearchBox",

    getInitialState: function getInitialState() {
        return { value: this.props.initialValue };
    },

    onSubmit: function onSubmit() {
        var val = this.refs.search.getDOMNode().value;

        this.setState({ value: val });

        // Callback
        if (this.props.onSubmit) {
            this.props.onSubmit(val);
        }
    },

    render: function render() {
        return _react2["default"].createElement(
            "form",
            { onSubmit: this.onSubmit },
            _react2["default"].createElement(
                "div",
                { className: "input-group" },
                _react2["default"].createElement("input", { className: "form-control",
                    type: "search",
                    ref: "search",
                    placeholder: "Search",
                    defaultValue: this.state.value }),
                _react2["default"].createElement(
                    "span",
                    { className: "input-group-addon", onClick: this.onSubmit },
                    _react2["default"].createElement("span", { className: "glyphicon glyphicon-search" })
                )
            )
        );
    }
});
module.exports = exports["default"];
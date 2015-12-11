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

var _reactDatepicker = require("react-datepicker");

var _reactDatepicker2 = _interopRequireDefault(_reactDatepicker);

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

require("react-datepicker/dist/react-datepicker.css");

require("./dateedit.css");

/**
 * Form control to edit a date text field.
 *
 * Set the initial value with 'initialValue' and set a callback for
 * value changed with 'onChange'.
 */
exports["default"] = _react2["default"].createClass({

    displayName: "DateEdit",

    getDefaultProps: function getDefaultProps() {
        return { width: "100%" };
    },

    getInitialState: function getInitialState() {
        return {
            initialValue: this.props.initialValue,
            value: this.props.initialValue,
            missing: false,
            showPicker: false
        };
    },

    isEmpty: function isEmpty(value) {
        return _underscore2["default"].isNull(value);
    },

    isMissing: function isMissing(v) {
        return this.props.required && !this.props.disabled && this.isEmpty(v);
    },

    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        var previousValue = this.state.initialValue ? this.state.initialValue.getTime() : null;
        var nextValue = nextProps.initialValue ? nextProps.initialValue.getTime() : null;
        if (previousValue !== nextValue) {
            this.setState({
                initialValue: nextProps.initialValue,
                value: nextProps.initialValue
            });

            var missing = this.isMissing(nextProps.initialValue);

            // Re-broadcast missing state up to the owner
            if (this.props.onMissingCountChange) {
                this.props.onMissingCountChange(this.props.attr, missing ? 1 : 0);
            }
        }
    },

    componentDidMount: function componentDidMount() {
        var missing = this.isMissing(this.props.initialValue);
        var value = this.props.initialValue;

        this.setState({ value: value, missing: missing });

        if (this.props.onMissingCountChange) {
            this.props.onMissingCountChange(this.props.attr, missing ? 1 : 0);
        }
    },

    handleDateChange: function handleDateChange(v) {
        var missing = this.props.required && this.isEmpty(value);
        var value = v ? v.toDate() : null;

        this.setState({ value: value, missing: missing });

        // Callbacks
        if (this.props.onChange) {
            this.props.onChange(this.props.attr, value);
        }
        if (this.props.onMissingCountChange) {
            this.props.onMissingCountChange(this.props.attr, missing ? 1 : 0);
        }
    },

    render: function render() {
        var selected = this.state.value ? (0, _moment2["default"])(this.state.value) : null;
        var className = "datepicker__input rdf";
        if (this.state.error || this.props.showRequired && this.isMissing(this.state.value)) {
            className = "datepicker__input rdf has-error";
        }
        return _react2["default"].createElement(
            "div",
            null,
            _react2["default"].createElement(
                "div",
                null,
                _react2["default"].createElement(_reactDatepicker2["default"], {
                    key: "bob",
                    ref: "input",
                    className: className,
                    disabled: this.props.disabled,
                    placeholderText: this.props.placeholder,
                    selected: selected,
                    onBlur: this.handleOnBlur,
                    onChange: this.handleDateChange })
            )
        );
    }
});
module.exports = exports["default"];
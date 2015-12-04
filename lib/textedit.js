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

var _revalidator = require("revalidator");

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var _stringHash = require("string-hash");

var _stringHash2 = _interopRequireDefault(_stringHash);

require("./textedit.css");

/**
 * Form control to edit a text field.
 * Set the initial value with 'initialValue' and set a callback for
 * value changed with 'onChange'.
 */
exports["default"] = _react2["default"].createClass({

    displayName: "TextEdit",

    getDefaultProps: function getDefaultProps() {
        return { width: "100%" };
    },

    getInitialState: function getInitialState() {
        return {
            initialValue: this.props.initialValue,
            value: this.props.initialValue,
            error: null,
            errorMsg: "",
            missing: false
        };
    },

    _isEmpty: function _isEmpty(value) {
        return _underscore2["default"].isNull(value) || _underscore2["default"].isUndefined(value) || value === "";
    },

    _isMissing: function _isMissing(v) {
        return this.props.required && !this.props.disabled && this._isEmpty(v);
    },

    _getError: function _getError(value) {
        var result = {
            validationError: false,
            validationErrorMessage: null
        };

        // If the user has a field blank then that is never an error. Likewise if the field
        // is disabled then that is never an error.
        if (this._isEmpty(value) || this.props.disabled) {
            return result;
        }

        // Validate the value with Revalidator, given the rules in this.props.rules
        var obj = {};
        obj[this.props.attr] = value;

        var attrValuePair = {};
        attrValuePair[this.props.attr] = this.props.rules;

        var rules = this.props.rules ? { properties: attrValuePair } : null;

        if (obj && rules) {
            var validation = (0, _revalidator.validate)(obj, rules, { cast: true });
            var _name = this.props.name || "Value";

            var msg = undefined;
            if (!validation.valid) {
                msg = _name + " " + validation.errors[0].message;
                result.validationError = true;
                result.validationErrorMessage = msg;
            }
        }
        return result;
    },

    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        if (this.state.initialValue !== nextProps.initialValue) {
            this.setState({
                initialValue: nextProps.initialValue,
                value: nextProps.initialValue
            });

            var missing = this._isMissing(nextProps.initialValue);
            var error = this._getError(nextProps.initialValue);

            // Re-broadcast error and missing states up to the owner
            if (this.props.onErrorCountChange) {
                this.props.onErrorCountChange(this.props.attr, error.validationError ? 1 : 0);
            }

            if (this.props.onMissingCountChange) {
                this.props.onMissingCountChange(this.props.attr, missing ? 1 : 0);
            }
        }
    },

    componentDidMount: function componentDidMount() {
        var missing = this._isMissing(this.props.initialValue);
        var error = this._getError(this.props.initialValue);
        var value = this.props.initialValue;

        this.setState({
            value: value, missing: missing,
            error: error.validationError,
            errorMsg: error.validationErrorMessage
        });

        // Initial error and missing states are fed up to the owner
        if (this.props.onErrorCountChange) {
            this.props.onErrorCountChange(this.props.attr, error.validationError ? 1 : 0);
        }

        if (this.props.onMissingCountChange) {
            this.props.onMissingCountChange(this.props.attr, missing ? 1 : 0);
        }
    },

    onBlur: function onBlur() {
        var value = this.refs.input.value;
        var missing = this.props.required && this._isEmpty(value);
        var error = this._getError(value);

        var cast = value;

        // State changes
        this.setState({
            value: value,
            missing: missing,
            error: error.validationError,
            errorMsg: error.validationErrorMessage
        });

        // Callbacks
        if (this.props.onChange) {
            if (_underscore2["default"].has(this.props.rules, "type")) {
                switch (this.props.rules.type) {
                    case "integer":
                        cast = value === "" ? null : parseInt(value, 10);
                        break;
                    case "number":
                        cast = value === "" ? null : parseFloat(value, 10);
                        break;
                }
            }
            this.props.onChange(this.props.attr, cast);
        }
        if (this.props.onErrorCountChange) {
            this.props.onErrorCountChange(this.props.attr, error.validationError ? 1 : 0);
        }
        if (this.props.onMissingCountChange) {
            this.props.onMissingCountChange(this.props.attr, missing ? 1 : 0);
        }
    },

    onFocus: function onFocus() {
        this.setState({ error: false, errorMsg: "" });
    },

    render: function render() {
        var msg = "";
        var w = _underscore2["default"].isUndefined(this.props.width) ? "100%" : this.props.width;
        var style = { width: w };

        var className = "";
        if (this.state.error || this.props.showRequired && this._isMissing(this.state.value)) {
            className = "has-error";
        }

        if (this.state.error) {
            msg = this.state.errorMsg;
        }

        var helpClassName = "help-block";
        if (this.state.error) {
            helpClassName += " has-error";
        }

        var key = (0, _stringHash2["default"])(this.state.initialValue || "");

        return _react2["default"].createElement(
            "div",
            { className: className },
            _react2["default"].createElement("input", {
                required: true,
                key: key,
                style: style,
                className: "form-control input-sm",
                type: "text",
                ref: "input",
                disabled: this.props.disabled,
                placeholder: this.props.placeholder,
                defaultValue: this.state.value,
                onBlur: this.onBlur,
                onFocus: this.onFocus }),
            _react2["default"].createElement(
                "div",
                { className: helpClassName },
                msg
            )
        );
    }
});
module.exports = exports["default"];
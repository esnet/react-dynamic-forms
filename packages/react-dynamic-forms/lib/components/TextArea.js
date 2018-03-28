"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var _revalidator = require("revalidator");

var _formGroup = require("../js/formGroup");

var _formGroup2 = _interopRequireDefault(_formGroup);

require("../css/textarea.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  Copyright (c) 2015 - present, The Regents of the University of California,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  through Lawrence Berkeley National Laboratory (subject to receipt
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  of any required approvals from the U.S. Dept. of Energy).
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  All rights reserved.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  This source code is licensed under the BSD-style license found in the
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  LICENSE file in the root directory of this source tree.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

/**
 * Form control to edit a Text Area field
 */
var TextArea = function (_React$Component) {
    _inherits(TextArea, _React$Component);

    function TextArea(props) {
        _classCallCheck(this, TextArea);

        var _this = _possibleConstructorReturn(this, (TextArea.__proto__ || Object.getPrototypeOf(TextArea)).call(this, props));

        _this.state = {
            touched: false
        };
        return _this;
    }

    _createClass(TextArea, [{
        key: "isEmpty",
        value: function isEmpty(value) {
            return _underscore2.default.isNull(value) || _underscore2.default.isUndefined(value) || value === "";
        }
    }, {
        key: "isMissing",
        value: function isMissing(v) {
            return this.props.required && !this.props.disabled && this.isEmpty(v);
        }
    }, {
        key: "getError",
        value: function getError(value) {
            var result = { validationError: false, validationErrorMessage: null };

            // If the user has a field blank then that is never an error
            // Likewise if this item is disabled it can't be called an error
            if (this.isEmpty(value) || this.props.disabled) {
                return result;
            }

            // Validate the value with Revalidator, given the rules in this.props.rules
            var obj = {};
            obj[this.props.name] = value;

            var properties = {};
            properties[this.props.name] = this.props.rules;

            var rules = this.props.rules ? { properties: properties } : null;
            if (obj && rules) {
                var validation = (0, _revalidator.validate)(obj, rules, { cast: true });
                var name = this.props.name || "Value";

                var msg = void 0;
                if (!validation.valid) {
                    msg = name + " " + validation.errors[0].message;
                    result.validationError = true;
                    result.validationErrorMessage = msg;
                }
            }
            return result;
        }
    }, {
        key: "componentWillReceiveProps",
        value: function componentWillReceiveProps(nextProps) {
            if (this.props.value !== nextProps.value) {
                var missing = this.isMissing(nextProps.value);

                var _getError = this.getError(nextProps.value),
                    validationError = _getError.validationError;

                // Broadcast error and missing states up to the owner


                if (this.props.onErrorCountChange) {
                    this.props.onErrorCountChange(this.props.name, validationError ? 1 : 0);
                }

                if (this.props.onMissingCountChange) {
                    this.props.onMissingCountChange(this.props.name, missing ? 1 : 0);
                }
            }
        }
    }, {
        key: "componentDidMount",
        value: function componentDidMount() {
            var missing = this.isMissing(this.props.value);

            var _getError2 = this.getError(this.props.value),
                validationError = _getError2.validationError;

            // Initial error and missing states are fed up to the owner


            if (this.props.onErrorCountChange) {
                this.props.onErrorCountChange(this.props.name, validationError ? 1 : 0);
            }

            if (this.props.onMissingCountChange) {
                this.props.onMissingCountChange(this.props.name, missing ? 1 : 0);
            }
        }
    }, {
        key: "onBlur",
        value: function onBlur() {
            var value = this.textInput.value;

            var missing = this.props.required && this.isEmpty(value);

            var _getError3 = this.getError(value),
                validationError = _getError3.validationError;

            // Callbacks


            if (this.props.onChange) {
                this.props.onChange(this.props.name, value);
            }
            if (this.props.onErrorCountChange) {
                this.props.onErrorCountChange(this.props.name, validationError ? 1 : 0);
            }
            if (this.props.onMissingCountChange) {
                this.props.onMissingCountChange(this.props.name, missing ? 1 : 0);
            }

            this.setState({ touched: true });
        }
    }, {
        key: "inlineStyle",
        value: function inlineStyle(hasError, isMissing) {
            var color = "";
            var background = "";
            if (hasError) {
                color = "#b94a48";
                background = "#fff0f3";
            } else if (isMissing) {
                background = "floralwhite";
            }
            return {
                color: color,
                background: background,
                height: "100%",
                width: "100%",
                paddingLeft: 3
            };
        }
    }, {
        key: "render",
        value: function render() {
            var _this2 = this;

            // Control state
            var isMissing = this.isMissing(this.props.value);

            var _getError4 = this.getError(this.props.value),
                validationError = _getError4.validationError,
                validationErrorMessage = _getError4.validationErrorMessage;

            if (this.props.edit) {
                // Error style/message
                var className = "";
                var msg = validationError ? validationErrorMessage : "";
                var helpClassName = "help-block";
                if (validationError && this.state.touched) {
                    helpClassName += " has-error";
                    className = "has-error";
                }

                // Warning style
                var style = isMissing ? { background: "floralwhite" } : {};

                return _react2.default.createElement(
                    "div",
                    { className: className },
                    _react2.default.createElement("textarea", {
                        ref: function ref(input) {
                            _this2.textInput = input;
                        },
                        key: this.props.value,
                        className: "form-control",
                        style: style,
                        type: "text",
                        disabled: this.props.disabled,
                        placeholder: this.props.placeholder,
                        defaultValue: this.props.value,
                        rows: this.props.rows,
                        onBlur: function onBlur() {
                            return _this2.onBlur();
                        }
                    }),
                    _react2.default.createElement(
                        "div",
                        { className: helpClassName },
                        msg
                    )
                );
            } else {
                var view = this.props.view;
                var text = this.props.value;
                if (isMissing) {
                    text = " ";
                }
                var _style = _extends({
                    height: 100
                }, this.inlineStyle(validationError, isMissing));
                if (!view) {
                    return _react2.default.createElement(
                        "div",
                        { style: _style },
                        text
                    );
                } else {
                    return _react2.default.createElement(
                        "div",
                        { style: _style },
                        view(text)
                    );
                }
            }
        }
    }]);

    return TextArea;
}(_react2.default.Component);

exports.default = (0, _formGroup2.default)(TextArea);
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var _revalidator = require("revalidator");

var _formGroup = require("../js/formGroup");

var _formGroup2 = _interopRequireDefault(_formGroup);

var _renderers = require("../js/renderers");

var _actions = require("../js/actions");

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
            value: props.value,
            isFocused: false,
            touched: false,
            selectText: false
        };
        return _this;
    }

    _createClass(TextArea, [{
        key: "handleMouseEnter",
        value: function handleMouseEnter() {
            this.setState({ hover: true });
        }
    }, {
        key: "handleMouseLeave",
        value: function handleMouseLeave() {
            this.setState({ hover: false });
        }
    }, {
        key: "handleEditItem",
        value: function handleEditItem() {
            this.props.onEditItem(this.props.name);
        }
    }, {
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
            if (this.props.edit !== nextProps.edit && nextProps.edit === true) {
                this.setState({ selectText: true });
            }
            if (this.state.value !== nextProps.value && !this.state.isFocused) {
                this.setState({ value: nextProps.value });

                var missing = this.isMissing(nextProps.value);

                var _getError = this.getError(nextProps.value),
                    validationError = _getError.validationError;

                // Broadcast error and missing states up to the parent


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

            // Initial error and missing states are fed up to the parent


            if (this.props.onErrorCountChange) {
                this.props.onErrorCountChange(this.props.name, validationError ? 1 : 0);
            }

            if (this.props.onMissingCountChange) {
                this.props.onMissingCountChange(this.props.name, missing ? 1 : 0);
            }
        }
    }, {
        key: "componentDidUpdate",
        value: function componentDidUpdate() {
            if (this.state.selectText) {
                this.textInput.focus();
                this.setState({ selectText: false });
            }
        }
    }, {
        key: "handleChange",
        value: function handleChange(e) {
            var _this2 = this;

            var name = this.props.name;
            var value = e.target.value;

            this.setState({ value: value }, function () {
                var missing = _this2.props.required && _this2.isEmpty(value);

                var _getError3 = _this2.getError(value),
                    validationError = _getError3.validationError;

                var cast = value;

                // Callbacks
                if (_this2.props.onErrorCountChange) {
                    _this2.props.onErrorCountChange(name, validationError ? 1 : 0);
                }

                if (_this2.props.onMissingCountChange) {
                    _this2.props.onMissingCountChange(name, missing ? 1 : 0);
                }

                if (_this2.props.onChange) {
                    _this2.props.onChange(name, value);
                }
            });
        }
    }, {
        key: "handleFocus",
        value: function handleFocus() {
            this.setState({ isFocused: true });
        }
    }, {
        key: "handleBlur",
        value: function handleBlur() {
            if (this.props.onBlur) {
                this.props.onBlur(this.props.name);
            }
            this.setState({ isFocused: false, touched: true });
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
            var _this3 = this;

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
                            _this3.textInput = input;
                        },
                        className: "form-control",
                        style: style,
                        type: "text",
                        disabled: this.props.disabled,
                        placeholder: this.props.placeholder,
                        value: this.state.value,
                        onChange: function onChange(e) {
                            return _this3.handleChange(e);
                        },
                        onFocus: function onFocus(e) {
                            return _this3.handleFocus(e);
                        },
                        onBlur: function onBlur() {
                            return _this3.handleBlur();
                        }
                    }),
                    _react2.default.createElement(
                        "div",
                        { className: helpClassName },
                        msg
                    )
                );
            } else {
                var view = this.props.view || _renderers.textView;
                var text = isMissing ? _react2.default.createElement("span", null) : _react2.default.createElement(
                    "span",
                    null,
                    view(this.props.value)
                );
                var edit = (0, _actions.editAction)(this.state.hover && this.props.allowEdit, function () {
                    return _this3.handleEditItem();
                });

                var _style = this.inlineStyle(validationError, isMissing);
                return _react2.default.createElement(
                    "div",
                    {
                        style: _style,
                        onMouseEnter: function onMouseEnter() {
                            return _this3.handleMouseEnter();
                        },
                        onMouseLeave: function onMouseLeave() {
                            return _this3.handleMouseLeave();
                        }
                    },
                    _react2.default.createElement("hr", { style: { marginTop: 3, marginBottom: 1 } }),
                    text,
                    edit,
                    _react2.default.createElement("hr", { style: { marginTop: 1, marginBottom: 3 } })
                );
            }
        }
    }]);

    return TextArea;
}(_react2.default.Component);

exports.default = (0, _formGroup2.default)(TextArea);
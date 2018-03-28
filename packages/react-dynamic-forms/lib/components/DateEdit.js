"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactDatepicker = require("react-datepicker");

var _reactDatepicker2 = _interopRequireDefault(_reactDatepicker);

var _formGroup = require("../js/formGroup");

var _formGroup2 = _interopRequireDefault(_formGroup);

require("react-datepicker/dist/react-datepicker.css");

require("../css/dateedit.css");

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
 * Form control to edit a date text field.
 *
 * Set the initial value with `initialValue` and set a callback for
 * value changed with `onChange`.
 */
var DateEdit = function (_React$Component) {
    _inherits(DateEdit, _React$Component);

    function DateEdit() {
        _classCallCheck(this, DateEdit);

        return _possibleConstructorReturn(this, (DateEdit.__proto__ || Object.getPrototypeOf(DateEdit)).apply(this, arguments));
    }

    _createClass(DateEdit, [{
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
        key: "componentWillReceiveProps",
        value: function componentWillReceiveProps(nextProps) {
            if (this.props.value && nextProps.value) {
                if (this.props.value.getTime() !== nextProps.value.getTime()) {
                    var missing = this.isMissing(nextProps.value);
                    if (this.props.onMissingCountChange) {
                        this.props.onMissingCountChange(this.props.name, missing ? 1 : 0);
                    }
                }
            }
        }
    }, {
        key: "componentDidMount",
        value: function componentDidMount() {
            var missing = this.isMissing(this.props.value);
            if (this.props.onMissingCountChange) {
                this.props.onMissingCountChange(this.props.name, missing ? 1 : 0);
            }
        }
    }, {
        key: "handleDateChange",
        value: function handleDateChange(v) {
            var value = v ? v.toDate() : null;
            var missing = this.isMissing(value);

            // Callbacks
            if (this.props.onChange) {
                this.props.onChange(this.props.name, value);
            }
            if (this.props.onMissingCountChange) {
                this.props.onMissingCountChange(this.props.name, missing ? 1 : 0);
            }
            if (this.props.onBlur) {
                this.props.onBlur(this.props.name);
            }
        }
    }, {
        key: "inlineStyle",
        value: function inlineStyle(hasError, isMissing) {
            var color = "inherited";
            var background = "inherited";
            if (hasError) {
                color = "#b94a48";
                background = "#fff0f3";
            } else if (isMissing) {
                background = "floralwhite";
            }
            return {
                color: color,
                background: background,
                height: 23,
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

            // Selected date
            var selected = this.props.value ? (0, _moment2.default)(this.props.value) : null;

            var className = "datepicker__input rdf";

            if (isMissing) {
                className += " is-missing";
            }

            if (this.props.edit) {
                return _react2.default.createElement(
                    "div",
                    null,
                    _react2.default.createElement(
                        "div",
                        null,
                        _react2.default.createElement(_reactDatepicker2.default, {
                            key: "date",
                            ref: function ref(input) {
                                _this2.textInput = input;
                            },
                            className: className,
                            disabled: this.props.disabled,
                            placeholderText: this.props.placeholder,
                            selected: selected,
                            onChange: function onChange(v) {
                                return _this2.handleDateChange(v);
                            }
                        })
                    )
                );
            } else {
                var hasError = false;
                var text = selected ? selected.format("MM/DD/YYYY") : "";
                if (isMissing) {
                    text = " ";
                }
                var style = this.inlineStyle(hasError, isMissing);
                return _react2.default.createElement(
                    "div",
                    { style: style },
                    text
                );
            }
        }
    }]);

    return DateEdit;
}(_react2.default.Component);

DateEdit.propTypes = {
    /**
     * width - Customize the horizontal size of the Chooser
     */
    width: _propTypes2.default.number,

    /**
     * field - The identifier of the field being edited
     */
    field: _propTypes2.default.string
};

DateEdit.defaultProps = {
    width: 100
};

exports.default = (0, _formGroup2.default)(DateEdit);
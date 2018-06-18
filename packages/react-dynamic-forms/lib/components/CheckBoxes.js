"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var _immutable = require("immutable");

var _immutable2 = _interopRequireDefault(_immutable);

var _formGroup = require("../js/formGroup");

var _formGroup2 = _interopRequireDefault(_formGroup);

var _renderers = require("../js/renderers");

var _actions = require("../js/actions");

var _style = require("../js/style");

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
 * Form control to select multiple items from a list,
 * uses checkboxes next to each item.
 */
var CheckBoxes = function (_React$Component) {
    _inherits(CheckBoxes, _React$Component);

    function CheckBoxes(props) {
        _classCallCheck(this, CheckBoxes);

        var _this = _possibleConstructorReturn(this, (CheckBoxes.__proto__ || Object.getPrototypeOf(CheckBoxes)).call(this, props));

        _this.state = { isFocused: false };
        return _this;
    }

    _createClass(CheckBoxes, [{
        key: "componentWillReceiveProps",
        value: function componentWillReceiveProps(nextProps) {
            if (this.props.value !== nextProps.value) {
                var missingCount = this.isMissing(nextProps.value) ? 1 : 0;
                if (this.props.onMissingCountChange) {
                    this.props.onMissingCountChange(this.props.name, missingCount);
                }
            }
        }
    }, {
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
        key: "handleFocus",
        value: function handleFocus() {
            this.setState({ isFocused: true });
        }
    }, {
        key: "handleBlur",
        value: function handleBlur() {
            console.log("XXX BLUR");
            if (this.props.onBlur) {
                this.props.onBlur(this.props.name);
            }
            this.setState({ isFocused: false, hover: false, touched: true });
        }
    }, {
        key: "handleChange",
        value: function handleChange(i) {
            var value = void 0;
            var option = this.props.optionList.get(i);
            if (this.props.value.includes(option)) {
                value = this.props.value.filterNot(function (item) {
                    return item === option;
                });
            } else {
                value = this.props.value.push(option);
            }
            if (this.props.onChange) {
                this.props.onChange(this.props.name, value);
            }
        }
    }, {
        key: "handleEditItem",
        value: function handleEditItem() {
            this.props.onEditItem(this.props.name);
        }
    }, {
        key: "isEmpty",
        value: function isEmpty(value) {
            if (_immutable2.default.List.isList(value)) {
                return value.size === 0;
            }
            return _underscore2.default.isNull(value) || _underscore2.default.isUndefined(value);
        }
    }, {
        key: "isMissing",
        value: function isMissing() {
            var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props.value;

            return this.props.required && !this.props.disabled && this.isEmpty(value);
        }
    }, {
        key: "render",
        value: function render() {
            var _this2 = this;

            if (this.props.edit) {
                var items = [];
                this.props.optionList.forEach(function (option, i) {
                    items.push(_react2.default.createElement(
                        "div",
                        { key: i, className: "checkbox" },
                        _react2.default.createElement(
                            "label",
                            null,
                            _react2.default.createElement("input", {
                                type: "checkbox",
                                checked: _this2.props.value.includes(option),
                                onChange: function onChange() {
                                    return _this2.handleChange(i);
                                }
                            }),
                            option
                        )
                    ));
                });

                // @TODO So apparently this will blur if you click a checkbox and then click another
                //       checkbox...
                return _react2.default.createElement(
                    "div",
                    { onFocus: function onFocus(e) {
                            return _this2.handleFocus(e);
                        }, onBlur: function onBlur() {
                            return _this2.handleBlur();
                        } },
                    items
                );
            } else {
                var view = this.props.view || _renderers.textView;
                var text = _react2.default.createElement(
                    "span",
                    { style: { minHeight: 28 } },
                    view(this.props.value.join(", "))
                );
                var edit = (0, _actions.editAction)(this.state.hover && this.props.allowEdit, function () {
                    return _this2.handleEditItem();
                });
                return _react2.default.createElement(
                    "div",
                    {
                        style: (0, _style.inlineStyle)(false, false),
                        onMouseEnter: function onMouseEnter() {
                            return _this2.handleMouseEnter();
                        },
                        onMouseLeave: function onMouseLeave() {
                            return _this2.handleMouseLeave();
                        }
                    },
                    text,
                    edit
                );
            }
        }
    }]);

    return CheckBoxes;
}(_react2.default.Component);

exports.default = (0, _formGroup2.default)(CheckBoxes);
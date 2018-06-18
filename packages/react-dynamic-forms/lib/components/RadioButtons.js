"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var _formGroup = require("../js/formGroup");

var _formGroup2 = _interopRequireDefault(_formGroup);

var _renderers = require("../js/renderers");

var _actions = require("../js/actions");

var _style = require("../js/style");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  Copyright (c) 2017 - present, The Regents of the University of California,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  through Lawrence Berkeley National Laboratory (subject to receipt
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  of any required approvals from the U.S. Dept. of Energy).
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  All rights reserved.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  This source code is licensed under the BSD-style license found in the
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  LICENSE file in the root directory of this source tree.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var RadioButtons = function (_React$Component) {
    _inherits(RadioButtons, _React$Component);

    function RadioButtons(props) {
        _classCallCheck(this, RadioButtons);

        var _this = _possibleConstructorReturn(this, (RadioButtons.__proto__ || Object.getPrototypeOf(RadioButtons)).call(this, props));

        _this.state = { isFocused: false };
        return _this;
    }

    _createClass(RadioButtons, [{
        key: "getCurrentChoiceLabel",
        value: function getCurrentChoiceLabel() {
            var _this2 = this;

            var choiceItem = this.props.optionList.find(function (item) {
                return item.get("id") === _this2.props.value;
            });
            return choiceItem ? choiceItem.get("label") : "";
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
            if (this.props.onBlur) {
                this.props.onBlur(this.props.name);
            }
            this.setState({ isFocused: false, touched: true });
        }
    }, {
        key: "handleChange",
        value: function handleChange(v) {
            // Callbacks
            if (this.props.onChange) {
                this.props.onChange(this.props.name, v);
            }
            if (this.props.onBlur) {
                this.props.onBlur(this.props.name);
            }
        }
    }, {
        key: "handleEditItem",
        value: function handleEditItem() {
            this.props.onEditItem(this.props.name);
        }
    }, {
        key: "render",
        value: function render() {
            var _this3 = this;

            if (this.props.edit) {
                var items = this.props.optionList.map(function (item, i) {
                    var id = item.get("id");
                    var label = item.get("label");
                    return _react2.default.createElement(
                        "div",
                        { className: "radio", key: i },
                        _react2.default.createElement(
                            "label",
                            null,
                            _react2.default.createElement("input", {
                                type: "radio",
                                name: label,
                                id: id,
                                value: id,
                                checked: id === _this3.props.value,
                                onChange: function onChange() {
                                    return _this3.handleChange(id);
                                }
                            }),
                            label
                        )
                    );
                });
                return _react2.default.createElement(
                    "div",
                    null,
                    items
                );
            } else {
                var s = this.getCurrentChoiceLabel();
                var view = this.props.view || _renderers.textView;
                var text = _react2.default.createElement(
                    "span",
                    { style: { minHeight: 28 } },
                    view(s)
                );
                var edit = (0, _actions.editAction)(this.state.hover && this.props.allowEdit, function () {
                    return _this3.handleEditItem();
                });
                return _react2.default.createElement(
                    "div",
                    {
                        style: (0, _style.inlineStyle)(false, false),
                        onMouseEnter: function onMouseEnter() {
                            return _this3.handleMouseEnter();
                        },
                        onMouseLeave: function onMouseLeave() {
                            return _this3.handleMouseLeave();
                        }
                    },
                    text,
                    edit
                );
            }
        }
    }]);

    return RadioButtons;
}(_react2.default.Component);

RadioButtons.defaultProps = {
    width: 300
};

exports.default = (0, _formGroup2.default)(RadioButtons);
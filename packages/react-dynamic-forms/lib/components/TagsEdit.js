"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var _reactSelect = require("react-select");

var _immutable = require("immutable");

var _immutable2 = _interopRequireDefault(_immutable);

var _formGroup = require("../js/formGroup");

var _formGroup2 = _interopRequireDefault(_formGroup);

require("react-select/dist/react-select.css");

require("../css/tagsedit.css");

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
 * Form control to select tags from a pull down list.
 * You can also add a new tag with the Add tag button.
 */
var TagsEdit = function (_React$Component) {
    _inherits(TagsEdit, _React$Component);

    function TagsEdit(props) {
        _classCallCheck(this, TagsEdit);

        var _this = _possibleConstructorReturn(this, (TagsEdit.__proto__ || Object.getPrototypeOf(TagsEdit)).call(this, props));

        _this.state = {
            touched: false
        };
        return _this;
    }

    _createClass(TagsEdit, [{
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
        key: "handleChange",
        value: function handleChange(tags) {
            var _this2 = this;

            var value = _underscore2.default.map(tags, function (tag) {
                return tag.label;
            });

            var updatedTagList = void 0;
            _underscore2.default.each(tags, function (tag) {
                if (tag.className === "Select-create-option-placeholder") {
                    updatedTagList = _this2.props.tagList.push(tag.label);
                }
            });

            if (updatedTagList && this.props.onTagListChange) {
                this.props.onTagListChange(this.props.name, updatedTagList);
            }

            if (this.props.onChange) {
                this.props.onChange(this.props.name, _immutable2.default.fromJS(value));
            }
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
            var _this3 = this;

            var isMissing = this.isMissing(this.props.value);
            if (this.props.edit) {
                var options = [];
                var value = [];

                this.props.tagList.forEach(function (tag, i) {
                    if (_this3.props.value.contains(tag)) {
                        value.push({ value: i, label: tag });
                    } else {
                        options.push({ value: i, label: tag });
                    }
                });

                var className = void 0;
                if (isMissing) {
                    className = "missing";
                }

                return _react2.default.createElement(
                    "div",
                    null,
                    _react2.default.createElement(_reactSelect.Creatable, {
                        key: "bob",
                        className: className,
                        multi: true,
                        disabled: this.props.disabled,
                        placeholder: "Select tags...",
                        allowCreate: true,
                        value: value,
                        options: options,
                        onChange: function onChange(value) {
                            return _this3.handleChange(value);
                        }
                    }),
                    _react2.default.createElement("div", { className: "help-block" })
                );
            } else {
                var tagStyle = {
                    cursor: "default",
                    paddingTop: 2,
                    paddingBottom: 2,
                    paddingLeft: 5,
                    paddingRight: 5,
                    background: "#ececec",
                    borderRadius: 2,
                    marginLeft: 2,
                    marginRight: 2
                };
                return _react2.default.createElement(
                    "div",
                    null,
                    this.props.value.map(function (tag, i) {
                        return _react2.default.createElement(
                            "span",
                            { key: i, style: tagStyle },
                            tag
                        );
                    })
                );
            }
        }
    }]);

    return TagsEdit;
}(_react2.default.Component);

exports.default = (0, _formGroup2.default)(TagsEdit);
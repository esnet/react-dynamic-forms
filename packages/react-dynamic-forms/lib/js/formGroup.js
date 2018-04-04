"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = formGroup;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _flexboxReact = require("flexbox-react");

var _flexboxReact2 = _interopRequireDefault(_flexboxReact);

var _classnames = require("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

var _constants = require("../js/constants");

require("../css/group.css");

require("../css/icon.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

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
 * Groups are intended to be used within the `Form` and provide a shorthand
 * method of adding a widget and its label to a form, including support for
 * managing missing and error fields automatically and inline editing.
 *
 * A group has two main purposes:
 *
 *  * Wrap a form widget such that it is shown with a label and arranged
 *    within a flexbox horizontal layout.
 *  * Expect standard props that are added to each of the wrapped form
 *    components (attrName, placeholder, validation etc) as a 'attr' object.
 *
 * Within ESDB we display the same form layout for each form element over and over.
 * This component is used to reduce all that boiler plate code. As such this
 * component is pretty hard coded in terms of its layout. The Group is also meant
 * to be used with a `Form`. This provides a `getAttrProps()` call that extracts
 * data such as existing formValues, meta info such as label name, placeholder
 * name, etc. In addition it also supplies callbacks for missing and error counts
 * as well as value changed that are attached to functions that callback into the
 * users code.
 */

function formGroup(Widget, hideEdit) {
    return function (_React$Component) {
        _inherits(Group, _React$Component);

        function Group(props) {
            _classCallCheck(this, Group);

            var _this = _possibleConstructorReturn(this, (Group.__proto__ || Object.getPrototypeOf(Group)).call(this, props));

            _this.state = { over: false };
            return _this;
        }

        _createClass(Group, [{
            key: "selectItem",
            value: function selectItem(attrName) {
                if (this.props.onSelectItem) {
                    this.props.onSelectItem(attrName);
                }
            }
        }, {
            key: "handleMouseEnter",
            value: function handleMouseEnter() {
                this.setState({ over: true });
            }
        }, {
            key: "handleMouseLeave",
            value: function handleMouseLeave() {
                this.setState({ over: false });
            }
        }, {
            key: "render",
            value: function render() {
                var _this2 = this;

                var _props = this.props,
                    _props$hidden = _props.hidden,
                    hidden = _props$hidden === undefined ? false : _props$hidden,
                    width = _props.width,
                    allowEdit = _props.allowEdit,
                    props = _objectWithoutProperties(_props, ["hidden", "width", "allowEdit"]);

                var name = props.name,
                    label = props.label,
                    key = props.key,
                    edit = props.edit,
                    disabled = props.disabled,
                    required = props.required,
                    showRequired = props.showRequired,
                    onSelectItem = props.onSelectItem;


                var selectStyle = {};

                //
                // Hidden
                //
                if (hidden) {
                    return _react2.default.createElement("div", null);
                }

                //
                // Widget
                //

                var widgetWidth = width ? width + "px" : "100%";
                var widget = _react2.default.createElement(
                    "div",
                    {
                        style: {
                            width: widgetWidth
                        }
                    },
                    _react2.default.createElement(Widget, props)
                );

                //
                // Required
                //
                var requiredMarker = void 0;
                if (required && showRequired) {
                    requiredMarker = _react2.default.createElement(
                        "span",
                        { className: "group-required", style: { paddingLeft: 3 } },
                        "*"
                    );
                } else {
                    requiredMarker = _react2.default.createElement("span", null);
                }

                //
                // Label
                //
                var labelClasses = (0, _classnames2.default)({
                    "group-label": true,
                    required: required
                });
                var marginLeft = "auto";
                if (this.props.layout === _constants.FormGroupLayout.COLUMN) {
                    marginLeft = null;
                }
                var fieldLabel = _react2.default.createElement(
                    "div",
                    {
                        className: labelClasses,
                        style: {
                            whiteSpace: "nowrap",
                            marginLeft: marginLeft,
                            paddingTop: 3,
                            color: this.state.error ? "b94a48" : "inherit"
                        }
                    },
                    _react2.default.createElement(
                        "label",
                        { muted: disabled, htmlFor: key },
                        label
                    )
                );
                var labelWidth = this.props.labelWidth ? this.props.labelWidth + "px" : "300px";

                //
                // Edit
                //

                var isBeingEdited = edit;

                var flip = {
                    transform: "scaleX(-1)",
                    fontSize: 11
                };

                var editIcon = _react2.default.createElement("span", null);
                if (this.state.over && allowEdit && !hideEdit) {
                    editIcon = _react2.default.createElement("i", {
                        style: flip,
                        className: isBeingEdited ? "glyphicon glyphicon-pencil icon edit-action active" : "glyphicon glyphicon-pencil icon edit-action",
                        onClick: function onClick() {
                            return onSelectItem ? onSelectItem(name) : null;
                        }
                    });
                }

                // Group
                if (this.props.layout === _constants.FormGroupLayout.INLINE) {
                    return _react2.default.createElement(
                        _flexboxReact2.default,
                        {
                            flexDirection: "column",
                            width: widgetWidth,
                            onMouseEnter: function onMouseEnter() {
                                return _this2.handleMouseEnter();
                            },
                            onMouseLeave: function onMouseLeave() {
                                return _this2.handleMouseLeave();
                            }
                        },
                        widget
                    );
                } else if (this.props.layout === _constants.FormGroupLayout.COLUMN) {
                    return _react2.default.createElement(
                        _flexboxReact2.default,
                        {
                            flexDirection: "column",
                            onMouseEnter: function onMouseEnter() {
                                return _this2.handleMouseEnter();
                            },
                            onMouseLeave: function onMouseLeave() {
                                return _this2.handleMouseLeave();
                            }
                        },
                        _react2.default.createElement(
                            _flexboxReact2.default,
                            {
                                flexDirection: "row",
                                onMouseEnter: function onMouseEnter() {
                                    return _this2.handleMouseEnter();
                                },
                                onMouseLeave: function onMouseLeave() {
                                    return _this2.handleMouseLeave();
                                }
                            },
                            _react2.default.createElement(
                                _flexboxReact2.default,
                                null,
                                fieldLabel
                            ),
                            _react2.default.createElement(
                                _flexboxReact2.default,
                                { minWidth: "14px", width: "14px" },
                                requiredMarker
                            ),
                            _react2.default.createElement(
                                _flexboxReact2.default,
                                { minWidth: "18px", width: "18px", style: selectStyle },
                                editIcon
                            )
                        ),
                        _react2.default.createElement(
                            _flexboxReact2.default,
                            {
                                flexDirection: "row",
                                onMouseEnter: function onMouseEnter() {
                                    return _this2.handleMouseEnter();
                                },
                                onMouseLeave: function onMouseLeave() {
                                    return _this2.handleMouseLeave();
                                }
                            },
                            _react2.default.createElement(
                                _flexboxReact2.default,
                                { flexGrow: 1, style: selectStyle },
                                widget
                            )
                        )
                    );
                } else {
                    return _react2.default.createElement(
                        _flexboxReact2.default,
                        {
                            flexDirection: "row",
                            onMouseEnter: function onMouseEnter() {
                                return _this2.handleMouseEnter();
                            },
                            onMouseLeave: function onMouseLeave() {
                                return _this2.handleMouseLeave();
                            }
                        },
                        _react2.default.createElement(
                            _flexboxReact2.default,
                            { minWidth: labelWidth, width: labelWidth },
                            fieldLabel
                        ),
                        _react2.default.createElement(
                            _flexboxReact2.default,
                            { minWidth: "14px", width: "14px" },
                            requiredMarker
                        ),
                        _react2.default.createElement(
                            _flexboxReact2.default,
                            { minWidth: "18px", width: "18px", style: selectStyle },
                            editIcon
                        ),
                        _react2.default.createElement(
                            _flexboxReact2.default,
                            {
                                width: widgetWidth,
                                style: selectStyle,
                                onDoubleClick: function onDoubleClick() {
                                    return onSelectItem && !isBeingEdited ? onSelectItem(name) : null;
                                }
                            },
                            widget
                        ),
                        _react2.default.createElement(_flexboxReact2.default, { flexGrow: 1 })
                    );
                }
            }
        }]);

        return Group;
    }(_react2.default.Component);
}
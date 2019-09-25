"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AsyncChooserGroup = exports.AsyncChooser = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _flexboxReact = require("flexbox-react");

var _flexboxReact2 = _interopRequireDefault(_flexboxReact);

var _immutable = require("immutable");

var _immutable2 = _interopRequireDefault(_immutable);

var _formGroup = require("../js/formGroup");

var _formGroup2 = _interopRequireDefault(_formGroup);

var _renderers = require("../js/renderers");

var _actions = require("../js/actions");

var _style = require("../js/style");

require("react-virtualized/styles.css");

require("react-virtualized-select/styles.css");

var _reactSelect = require("react-select");

var _reactSelect2 = _interopRequireDefault(_reactSelect);

var _reactWindow = require("react-window");

require("../css/chooser.css");

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

//import "react-select/dist/react-select.css";


//import Select from "react-virtualized-select";


/**
 * React Form control to select an item from a list. The list is built from
 * an async call. Once the call has been made and the options list if built
 * the list is immutable. Also note that if a value is provided (current or
 * default) that value will only actually show once the list is received.
 */

var height = 35;

var MenuList = function (_React$Component) {
    _inherits(MenuList, _React$Component);

    function MenuList() {
        _classCallCheck(this, MenuList);

        return _possibleConstructorReturn(this, (MenuList.__proto__ || Object.getPrototypeOf(MenuList)).apply(this, arguments));
    }

    _createClass(MenuList, [{
        key: "render",
        value: function render() {
            //console.log('Inside MenuList:');

            var _props = this.props,
                options = _props.options,
                children = _props.children,
                maxHeight = _props.maxHeight,
                getValue = _props.getValue;

            var _getValue = getValue(),
                _getValue2 = _slicedToArray(_getValue, 1),
                value = _getValue2[0];

            var initialOffset = options.indexOf(value) * height;

            return _react2.default.createElement(
                _reactWindow.FixedSizeList,
                {
                    height: maxHeight,
                    itemCount: children.length,
                    itemSize: 50,
                    initialScrollOffset: initialOffset },
                function (_ref) {
                    var index = _ref.index,
                        style = _ref.style;
                    return _react2.default.createElement(
                        "div",
                        { style: style },
                        children[index]
                    );
                }
            );
        }
    }]);

    return MenuList;
}(_react2.default.Component);

var AsyncChooser = exports.AsyncChooser = function (_React$Component2) {
    _inherits(AsyncChooser, _React$Component2);

    function AsyncChooser(props) {
        _classCallCheck(this, AsyncChooser);

        var _this2 = _possibleConstructorReturn(this, (AsyncChooser.__proto__ || Object.getPrototypeOf(AsyncChooser)).call(this, props));

        _this2.state = { isFocused: false, focusChooser: false };
        _this2.handleChange = _this2.handleChange.bind(_this2);
        _this2.loadOptions = _this2.loadOptions.bind(_this2);

        _this2.loadedOptions = _immutable2.default.List();
        return _this2;
    }

    _createClass(AsyncChooser, [{
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
            if (!this.state.isFocused) {
                this.setState({ isFocused: true, oldValue: this.props.value });
            }
        }
    }, {
        key: "handleDone",
        value: function handleDone() {
            if (this.props.onBlur) {
                this.props.onBlur(this.props.name);
            }
            this.setState({ isFocused: false, hover: false, oldValue: null });
        }
    }, {
        key: "handleCancel",
        value: function handleCancel() {
            if (this.props.onChange) {
                var v = this.state.oldValue;
                this.props.onChange(this.props.name, v);
            }
            this.props.onBlur(this.props.name);
            this.setState({ isFocused: false, hover: false, oldValue: null });
        }
    }, {
        key: "isEmpty",
        value: function isEmpty(value) {
            return _underscore2.default.isNull(value) || _underscore2.default.isUndefined(value) || value === "";
        }
    }, {
        key: "isMissing",
        value: function isMissing() {
            var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props.value;

            return this.props.required && !this.props.disabled && this.isEmpty(value);
        }
    }, {
        key: "componentDidMount",
        value: function componentDidMount() {
            var missing = this.props.required && !this.props.disabled && (_underscore2.default.isNull(this.props.value) || _underscore2.default.isUndefined(this.props.value) || this.props.value === "");
            var missingCount = missing ? 1 : 0;

            if (this.props.onMissingCountChange) {
                this.props.onMissingCountChange(this.props.name, missingCount);
            }
        }
    }, {
        key: "componentWillReceiveProps",
        value: function componentWillReceiveProps(nextProps) {
            if (nextProps.selected && this.props.edit !== nextProps.edit && nextProps.edit === true) {
                this.setState({ focusChooser: true });
            }
            if (this.props.value !== nextProps.value || !this.props.value && nextProps.value || this.props.value && !nextProps.value) {
                // The value might have been missing and is now set explicitly
                // with a prop
                var missing = this.props.required && !this.props.disabled && (_underscore2.default.isNull(nextProps.value) || _underscore2.default.isUndefined(nextProps.value) || nextProps.value === "");
                var missingCount = missing ? 1 : 0;

                if (this.props.onMissingCountChange) {
                    this.props.onMissingCountChange(this.props.name, missingCount);
                }
            }
        }
    }, {
        key: "componentDidUpdate",
        value: function componentDidUpdate() {
            if (this.state.focusChooser) {
                //this.chooser.focus();
                this.setState({ focusChooser: false });
            }
        }
    }, {
        key: "handleChange",
        value: function handleChange(item) {
            var _ref2 = item || {},
                value = _ref2.value,
                label = _ref2.label;

            var isMissing = this.props.required && _underscore2.default.isNull(item);
            var id = !isMissing && !_underscore2.default.isNaN(Number(value)) ? +value : value;

            // Callbacks
            if (this.props.onChange) {
                this.props.onChange(this.props.name, _immutable2.default.Map({ id: id, label: label }));
            }
            if (this.props.onMissingCountChange) {
                this.props.onMissingCountChange(this.props.name, isMissing ? 1 : 0);
            }
        }
    }, {
        key: "handleEditItem",
        value: function handleEditItem() {
            this.props.onEditItem(this.props.name);
        }
    }, {
        key: "getOptionList",
        value: function getOptionList(options) {
            var _this3 = this;

            return options.map(function (item) {
                var disabled = false;
                var isDisabled = item.has("disabled") && item.get("disabled") === true;
                if (_underscore2.default.contains(_this3.props.disableList, item.get("id")) || isDisabled) {
                    disabled = true;
                }
                //return "";  
                return { value: item.get("id"), label: item.get("label"), disabled: disabled };
            }).toJS();
        }
    }, {
        key: "loadOptions",
        value: function loadOptions(input, cb) {
            var _this4 = this;

            if (this.cachedOptions) {
                cb(null, {
                    options: this.getOptionList(this.cachedOptions),
                    complete: true
                });
                return;
            }

            this.props.loader(input, function (err, options) {
                cb(err, {
                    options: _this4.getOptionList(options),
                    complete: true
                });
                _this4.cachedOptions = options;
            });
        }
    }, {
        key: "render",
        value: function render() {
            var _this5 = this;

            var choice = this.props.value ? this.props.value.get("value") : null;
            var isMissing = this.isMissing(this.props.value);

            if (this.props.edit) {
                var chooserStyle = { marginBottom: 10, width: "100%" };
                var clearable = this.props.allowSingleDeselect;
                var matchPos = this.props.searchContains ? "any" : "start";

                return _react2.default.createElement(
                    _flexboxReact2.default,
                    { flexDirection: "row", style: { width: "100%" } },
                    _react2.default.createElement(
                        "div",
                        { style: chooserStyle, onFocus: function onFocus(e) {
                                return _this5.handleFocus(e);
                            } },
                        _react2.default.createElement(_reactSelect2.default, {
                            components: { MenuList: MenuList },
                            options: this.props.testOptions,
                            value: choice,
                            onChange: function onChange(v) {
                                return _this5.handleChange(v);
                            }
                        })
                    ),
                    this.props.selected ? _react2.default.createElement(
                        "span",
                        { style: { marginTop: 5 } },
                        _react2.default.createElement(
                            "span",
                            {
                                style: (0, _style.inlineDoneButtonStyle)(5),
                                onClick: function onClick() {
                                    return _this5.handleDone();
                                }
                            },
                            "DONE"
                        ),
                        _react2.default.createElement(
                            "span",
                            {
                                style: (0, _style.inlineCancelButtonStyle)(),
                                onClick: function onClick() {
                                    return _this5.handleCancel();
                                }
                            },
                            "CANCEL"
                        )
                    ) : _react2.default.createElement("div", null)
                );
            } else {
                var label = this.props.value.get("label");
                var View = this.props.view || _renderers.textView;
                var style = (0, _style.inlineChooserStyle)(false, false, !!View);
                var text = _react2.default.createElement(
                    "span",
                    { style: { minHeight: 28 } },
                    View(label)
                );
                var edit = (0, _actions.editAction)(this.state.hover && this.props.allowEdit, function () {
                    return _this5.handleEditItem();
                });

                return _react2.default.createElement(
                    "div",
                    {
                        style: style,
                        onMouseEnter: function onMouseEnter() {
                            return _this5.handleMouseEnter();
                        },
                        onMouseLeave: function onMouseLeave() {
                            return _this5.handleMouseLeave();
                        }
                    },
                    text,
                    edit
                );
            }
        }
    }]);

    return AsyncChooser;
}(_react2.default.Component);

AsyncChooser.propTypes = {
    /**
     * The identifier of the field being edited. References back into
     * the Form's Schema for additional properties of this field
     */
    field: _propTypes2.default.string.isRequired,

    /**
     * Pass in the available list of options as a Immutable.List of objects. Each
     * object contains a "id" and the user visible "label". For example:
     *
     * Immutable.fromJS([
     *     { id: 1, label: "Dog" },
     *     { id: 2, label: "Duck" },
     *     { id: 3, label: "Cat" }
     * ]);
     *
     */
    choiceList: _propTypes2.default.object.isRequired,

    /**
     * If the chooser should be shown as disabled
     */
    disabled: _propTypes2.default.bool,

    /**
     * Customize the horizontal size of the Chooser
     */
    width: _propTypes2.default.number,

    /**
     * Add a [x] icon to the chooser allowing the user to clear the selected value
     */
    allowSingleDeselect: _propTypes2.default.bool,

    /**
     * Can be "any" or "start", indicating how the search is matched within the items (anywhere, or starting with)
     */
    searchContains: _propTypes2.default.oneOf(["any", "start"])
};

AsyncChooser.defaultProps = {
    disabled: false,
    disableSearch: false,
    searchContains: "any",
    allowSingleDeselect: false,
    width: 300
};

var AsyncChooserGroup = exports.AsyncChooserGroup = (0, _formGroup2.default)(AsyncChooser, "AsyncChooser");
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var _flexboxReact = require("flexbox-react");

var _flexboxReact2 = _interopRequireDefault(_flexboxReact);

var _CSSTransitionGroup = require("react-transition-group/CSSTransitionGroup");

var _CSSTransitionGroup2 = _interopRequireDefault(_CSSTransitionGroup);

require("../css/list.css");

require("../css/icon.css");

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
 * Editing of a list of widgets. This widgets themselves are passed in as 'items'.
 *
 * A ListEditView is created within the ListEditorMixin, so you do not generally need
 * to use this component directly.
 *
 * The user of this component should supply event handlers to manage the list
 * when items are added or removed:
 *   * `onAddItem()`
 *   * `onRemoveItem()`
 *
 * Each item passed in should have an id set (item.props.id). This is used to
 * uniquely identify each row so that removing a row happens correctly.
 *
 * Finally
 *   * `canAddItems()` - lets you hide the [+] icon for instance if there's no
 *                       possible items that can be added from a list).
 */
var List = function (_React$Component) {
    _inherits(List, _React$Component);

    function List() {
        _classCallCheck(this, List);

        return _possibleConstructorReturn(this, (List.__proto__ || Object.getPrototypeOf(List)).apply(this, arguments));
    }

    _createClass(List, [{
        key: "addItem",
        value: function addItem() {
            if (this.props.onAddItem) {
                this.props.onAddItem();
            }
        }
    }, {
        key: "removeItem",
        value: function removeItem(index) {
            if (this.props.onRemoveItem) {
                this.props.onRemoveItem(index);
            }
        }
    }, {
        key: "selectItem",
        value: function selectItem(index) {
            if (this.props.onSelectItem) {
                this.props.onSelectItem(index);
            }
        }
    }, {
        key: "handleDeselect",
        value: function handleDeselect() {
            this.selectItem(null);
        }
    }, {
        key: "render",
        value: function render() {
            var _this2 = this;

            var addPlus = this.props.canAddItems;
            var addMinus = this.props.canRemoveItems;
            var addEdit = this.props.canEditItems;

            // Plus [+] icon
            var plus = void 0;
            if (addPlus) {
                plus = _react2.default.createElement("i", {
                    key: "plus",
                    className: "glyphicon glyphicon-plus icon add-action",
                    onClick: function onClick() {
                        return _this2.addItem();
                    }
                });
            } else {
                plus = _react2.default.createElement("div", null);
            }

            // Build the item list, which is a list of table rows, each row containing
            // an item and a [-] icon used for removing that item.
            var itemList = _underscore2.default.map(this.props.items, function (item, index) {
                var minusActionKey = "minus-action-" + item.key;
                var itemKey = "item-" + item.key;
                var itemSpanKey = "item-span-" + item.key;
                var actionSpanKey = "action-span-" + item.key;
                var itemMinusHide = item.props.hideMinus ? item.props.hideMinus : false;

                var listEditItemClass = "esnet-forms-listeditview-edit-item";

                var isBeingEdited = item.props.edit === true;

                // Item remove [-] icon
                var minus = void 0;
                var edit = void 0;

                var isEditable = void 0;
                if (_this2.props.hideEditRemove) {
                    isEditable = _this2.props.hideEditRemove && index === _this2.props.items.length - 1;
                } else {
                    isEditable = true;
                }
                if (isEditable) {
                    if (addMinus && !itemMinusHide) {
                        minus = _react2.default.createElement("i", {
                            id: index,
                            key: minusActionKey,
                            className: "glyphicon glyphicon-remove hostile_icon delete-action",
                            onClick: function onClick() {
                                return _this2.removeItem(index);
                            }
                        });
                    } else {
                        listEditItemClass += " no-controls";
                        minus = _react2.default.createElement("div", { className: "icon delete-action" });
                    }

                    var flip = {
                        transform: "scaleX(-1)",
                        fontSize: 10
                    };

                    // Edit item icon
                    if (addEdit) {
                        if (isBeingEdited) {
                            edit = _react2.default.createElement("i", {
                                id: index,
                                key: minusActionKey,
                                className: "glyphicon glyphicon-chevron-down icon edit-action active",
                                onClick: function onClick() {
                                    return _this2.selectItem(index);
                                }
                            });
                        } else {
                            edit = _react2.default.createElement("i", {
                                id: index,
                                key: minusActionKey,
                                style: flip,
                                className: "glyphicon glyphicon-chevron-left icon edit-action",
                                onClick: function onClick() {
                                    return _this2.selectItem(index);
                                }
                            });
                        }
                    }
                }

                var minusAction = addMinus ? _react2.default.createElement(
                    _flexboxReact2.default,
                    { width: "28px" },
                    _react2.default.createElement(
                        "span",
                        { key: actionSpanKey, className: "icon", style: { background: "white" } },
                        minus
                    )
                ) : _react2.default.createElement("div", null);

                var editAction = addEdit ? _react2.default.createElement(
                    _flexboxReact2.default,
                    { width: "28px" },
                    _react2.default.createElement(
                        "span",
                        {
                            key: actionSpanKey,
                            className: "icon",
                            style: { background: "white", verticalAlign: "top" }
                        },
                        edit
                    )
                ) : _react2.default.createElement("div", null);

                // JSX for each row, includes: UI Item and [x] remove item button
                return _react2.default.createElement(
                    "li",
                    {
                        height: "80px",
                        key: itemKey,
                        className: "esnet-forms-list-item",
                        style: {
                            borderBottomStyle: "solid",
                            borderBottomColor: "#DDD",
                            borderBottomWidth: 1
                        }
                    },
                    _react2.default.createElement(
                        _flexboxReact2.default,
                        { flexDirection: "row" },
                        minusAction,
                        editAction,
                        _react2.default.createElement(
                            _flexboxReact2.default,
                            { flexGrow: 1 },
                            _react2.default.createElement(
                                "span",
                                { key: itemSpanKey, className: listEditItemClass },
                                item
                            )
                        )
                    )
                );
            });

            // Build the [+] elements
            if (addPlus) {
                if (this.props.plusElement) {
                    plus = this.props.plusElement;
                } else {
                    plus = _react2.default.createElement(
                        _flexboxReact2.default,
                        { flexDirection: "row" },
                        _react2.default.createElement(
                            _flexboxReact2.default,
                            { width: "28px" },
                            _react2.default.createElement(
                                "span",
                                {
                                    key: "plus",
                                    className: "icon",
                                    style: { background: "white", verticalAlign: "top", fontSize: 10 }
                                },
                                plus
                            )
                        ),
                        _react2.default.createElement(_flexboxReact2.default, { width: "28px" })
                    );
                }
            } else {
                plus = _react2.default.createElement("div", null);
            }

            //
            // Build the table of item rows, with the [+] at the bottom if required
            //

            return _react2.default.createElement(
                "div",
                {
                    style: {
                        borderTopStyle: "solid",
                        borderTopWidth: 1,
                        borderTopColor: "#DDD"
                    }
                },
                _react2.default.createElement(
                    "ul",
                    { className: "esnet-forms-listeditview-container" },
                    _react2.default.createElement(
                        _CSSTransitionGroup2.default,
                        {
                            transitionName: "esnet-forms-list-item",
                            transitionEnterTimeout: 500,
                            transitionLeaveTimeout: 300
                        },
                        itemList
                    )
                ),
                plus
            );
        }
    }]);

    return List;
}(_react2.default.Component);

exports.default = List;
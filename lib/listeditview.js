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

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var _reactAddonsCssTransitionGroup = require("react-addons-css-transition-group");

var _reactAddonsCssTransitionGroup2 = _interopRequireDefault(_reactAddonsCssTransitionGroup);

require("./listeditview.css");

/**
 * Editing of a list of widgets. This The widgets themselves are passed in as 'items'.
 *
 * A ListEditView is created within the ListEditorMixin, so you do not generally need
 * to use this component directly.
 *
 * This user of this component should supply event handlers to manage the list
 * when items are added or removed. This is done in the ListEditorMixin render() method.
 *
 * These are onAddItem() and onRemoveItem(). Each item padded in should have
 * and id set (item.props.id). This item is used to uniquely identify each row so that
 * removing a row happens correctly. Finally, 'canAddItems' lets you hide the [+] icon
 * (for instance if there's no possible items that can be added from a list).
 */
exports["default"] = _react2["default"].createClass({

    displayName: "ListEditView",

    addItem: function addItem() {
        if (this.props.onAddItem) {
            this.props.onAddItem();
        }
    },

    removeItem: function removeItem(e) {
        var index = e.target.id;
        if (this.props.onRemoveItem) {
            this.props.onRemoveItem(index);
        }
    },

    render: function render() {
        var _this = this;

        var plus = undefined;

        var addPlus = this.props.canAddItems;
        var addMinus = this.props.canRemoveItems;

        // Build the item list, which is a list of table rows, each row containing
        // an item and a [-] icon used for removing that item.
        var plusActionKey = "plus-action";
        var itemList = _underscore2["default"].map(this.props.items, function (item, index) {
            var minusActionKey = "minus-action-" + item.key;
            var itemKey = "item-" + item.key;
            var itemSpanKey = "item-span-" + item.key;
            var actionSpanKey = "action-span-" + item.key;
            var itemMinusHide = item.props.hideMinus ? item.props.hideMinus : false;

            var listEditItemClass = "esnet-forms-listeditview-edit-item";
            var minus = undefined;

            if (addMinus && !itemMinusHide) {
                minus = _react2["default"].createElement("i", {
                    id: index,
                    key: minusActionKey,
                    className: "glyphicon glyphicon-minus esnet-forms-small-action-icon",
                    onClick: _this.removeItem });
            } else {
                listEditItemClass += " no-controls";
                minus = _react2["default"].createElement("div", { className: "esnet-forms-listeditview-edit-item-minus-spacer" });
            }

            // JSX for each row, includes: UI Item and [-] remove item button
            return _react2["default"].createElement(
                "li",
                { height: "80px", key: itemKey, className: "esnet-forms-list-item" },
                _react2["default"].createElement(
                    "span",
                    {
                        key: itemSpanKey,
                        className: listEditItemClass,
                        style: { float: "left" } },
                    item
                ),
                _react2["default"].createElement(
                    "span",
                    {
                        key: actionSpanKey,
                        className: "esnet-forms-minus-action-box",
                        style: {
                            float: "left",
                            verticalAlign: "top" } },
                    minus
                )
            );
        });

        // Build the [+] elements
        if (addPlus) {
            if (this.props.plusElement) {
                plus = this.props.plusElement;
            } else {
                plus = _react2["default"].createElement(
                    "div",
                    { className: "esnet-forms-plus-action-box", key: plusActionKey, onClick: this.addItem },
                    _react2["default"].createElement("i", { className: "glyphicon glyphicon-plus esnet-forms-small-action-icon" })
                );
            }
        } else {
            plus = _react2["default"].createElement("div", null);
        }

        // Build the table of item rows, with the [+] at the bottom if required. If there's
        // no items to show then special UI is shown for that.

        return _react2["default"].createElement(
            "div",
            null,
            _react2["default"].createElement(
                "ul",
                { className: "esnet-forms-listeditview-container" },
                _react2["default"].createElement(
                    _reactAddonsCssTransitionGroup2["default"],
                    {
                        transitionName: "esnet-forms-list-item",
                        transitionEnterTimeout: 500,
                        transitionLeaveTimeout: 300 },
                    itemList
                )
            ),
            plus
        );
    }
});
module.exports = exports["default"];
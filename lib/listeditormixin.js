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

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactClonewithprops = require("react-clonewithprops");

var _reactClonewithprops2 = _interopRequireDefault(_reactClonewithprops);

var _listeditview = require("./listeditview");

var _listeditview2 = _interopRequireDefault(_listeditview);

/**
 * A helper mixin to keep track of lists of values, missing values and error counts
 * in a ListEditor.
 *
 * To use, in the ListEditor, define functions:
 *     - initialItems() to return the initial list of items
 *     - createItem() to create a new item
 *     - renderItem() to render a new item
 */
exports["default"] = {

    getInitialState: function getInitialState() {
        if (!this.initialItems) {
            throw new Error("ListEditorMixin requires method initialItems() to be defined on the component.");
        }

        var initialItems = this.initialItems();

        var items = [];
        _underscore2["default"].each(initialItems, function (item) {
            if (!_underscore2["default"].has(item, "key")) {
                item.key = "key-" + Math.random();
            }
            items.push(item);
        });

        return {
            "items": items, // array of items
            "errors": [], // number of errors
            "missing": [] // required fields that are still not filled out
        };
    },

    /**
     * Returns the number of items in the list
     */
    itemCount: function itemCount() {
        return this.state.items.length;
    },

    /**
     * Returns the item at the index supplied
     */
    getItem: function getItem(index) {
        if (index >= 0 && index < this.itemCount()) {
            return this.state.items[index];
        }
    },

    /**
     * Handle adding a new item.
     */
    handleAddItem: function handleAddItem(data) {

        if (!this.createItem) {
            throw new Error("ListEditorMixin requires method createItem() to be defined on the component.");
        }

        var items = this.state.items;
        var errorList = this.state.errors;
        var missingList = this.state.missing;
        var created = this.createItem(data);
        var newItems = [];

        if (!_underscore2["default"].isArray(created)) {
            if (!_underscore2["default"].has(created, "key")) {
                created.key = "key-" + Math.random();
            }
            items.push(created);
            errorList.push(0);
            missingList.push(0);
        } else {
            var n = 1;
            _underscore2["default"].each(created, function (newItem) {
                if (!_underscore2["default"].has(newItem, "key")) {
                    newItem.key = "key-" + Math.random();
                    newItem.multiPart = n;
                }
                items.push(newItem);
                errorList.push(0);
                missingList.push(0);
                n++;
            });
            newItems = created;
        }

        //Set state
        this.setState({ "items": items,
            "errors": errorList,
            "missing": missingList });

        //Callbacks
        if (this.props.onChange) {
            this.props.onChange(this.props.attr, items);
        }
        if (this.props.onErrorCountChange) {
            this.props.onErrorCountChange(this.props.attr, this._totalErrorCounts());
        }
        if (this.props.onMissingCountChange) {
            this.props.onMissingCountChange(this.props.attr, this._totalMissingCounts());
        }
    },

    /**
     * Handle removing an item. Here it splices out the item
     * at the supplied index and updates the list of items on the state.
     *
     * Also updates the error and missing lists to match.
     */
    handleItemRemoved: function handleItemRemoved(i) {
        var items = this.state.items;
        var n = 1;
        if (this.removeItemCount) {
            n = this.removeItemCount(items[i], i);
        }

        items.splice(i - n + 1, n);

        var errorList = this.state.errors;
        var missingList = this.state.missing;
        errorList.splice(i - n + 1, n);
        missingList.splice(i - n + 1, n);

        this.setState({ "items": items,
            "errors": errorList,
            "missing": missingList });

        //Callbacks
        if (this.props.onChange) {
            this.props.onChange(this.props.attr, items);
        }
        if (this.props.onErrorCountChange) {
            this.props.onErrorCountChange(this.props.attr, this._totalErrorCounts());
        }
        if (this.props.onMissingCountChange) {
            this.props.onMissingCountChange(this.props.attr, this._totalMissingCounts());
        }
    },

    /**
     * Handle an item at i changing to a new value.
     */
    handleItemChanged: function handleItemChanged(i, value) {
        var items = this.state.items;
        items[i] = value;

        this.setState({ "items": items });

        //Callback
        if (this.props.onChange) {
            this.props.onChange(this.props.attr, items);
        }
    },

    /**
     * Handler for if a child changes its missing count
     */
    handleMissingCountChange: function handleMissingCountChange(i, missingCount) {
        //console.log("## handle missing changed", i, value)
        var totalMissingCount = undefined;
        var missingList = this.state.missing;
        missingList[i] = missingCount;

        this.setState({ "missing": missingList });

        totalMissingCount = _underscore2["default"].reduce(missingList, function (memo, num) {
            return memo + num;
        }, 0);

        //Callback
        if (this.props.onMissingCountChange) {
            this.props.onMissingCountChange(this.props.attr, totalMissingCount);
        }
    },

    /**
     * Handler for if a child changes its error count
     */
    handleErrorCountChange: function handleErrorCountChange(i, errorCount) {
        var totalErrorCount = undefined;
        var errorList = this.state.errors;
        errorList[i] = errorCount;
        totalErrorCount = _underscore2["default"].reduce(errorList, function (memo, num) {
            return memo + num;
        }, 0);

        //Callback
        if (this.props.onErrorCountChange) {
            this.props.onErrorCountChange(this.props.attr, totalErrorCount);
        }
    },

    render: function render() {
        var _this = this;

        var components = [];
        _underscore2["default"].each(this.state.items, function (item, index) {
            var component = _this.renderItem(item, index);
            if (component) {
                var props = { key: item.key,
                    index: index,
                    id: item.id,
                    onErrorCountChange: _this.handleErrorCountChange,
                    onMissingCountChange: _this.handleMissingCountChange,
                    onChange: _this.handleItemChanged };
                components.push((0, _reactClonewithprops2["default"])(component, props));
            }
        });

        var canAddItems = _underscore2["default"].has(this.state, "canAddItems") ? this.state.canAddItems : true;
        var canRemoveItems = _underscore2["default"].has(this.state, "canRemoveItems") ? this.state.canRemoveItems : true;
        var plusElement = _underscore2["default"].has(this, "plusUI") ? this.plusUI() : null;

        return _react2["default"].createElement(_listeditview2["default"], { items: components,
            canAddItems: canAddItems,
            canRemoveItems: canRemoveItems,
            plusWidth: 400,
            plusElement: plusElement,
            onAddItem: this.handleAddItem,
            onRemoveItem: this.handleItemRemoved });
    },

    /**
     * Determine the total count of missing fields in the entire list
     */
    _totalMissingCounts: function _totalMissingCounts() {
        var counts = this.state.missingCounts;
        var total = 0;
        _underscore2["default"].each(counts, function (c) {
            total += c;
        });
        return total;
    },

    /**
     * Determine the total count of error fields in the entire list
     */
    _totalErrorCounts: function _totalErrorCounts() {
        var counts = this.state.errorCounts;
        var total = 0;
        _underscore2["default"].each(counts, function (c) {
            total += c;
        });
        return total;
    }
};
module.exports = exports["default"];
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

var _reactSelect = require("react-select");

var _reactSelect2 = _interopRequireDefault(_reactSelect);

var _stringHash = require("string-hash");

var _stringHash2 = _interopRequireDefault(_stringHash);

require("./select.css");

/**
 * React Form control to select an item from a list.
 *
 * Wraps the react-select library
 *
 * Props:
 *     initialChoice     - Pass in the initial value as an id
 *
 *     initialChoiceList - Pass in the available list of options as a list of
 *                         objects.
 *                         e.g. [{id: 1: label: "cat"},
 *                               {id: 2: label: "dog"},
 *                               ... ]
 *
 *     attr              - The identifier of the property being editted
 *
 *     onChange          - Callback for when value changes.
 *                         Will be passed the attr and new value as a string.
 * States:
 *     value             - The current value (index) of the chosen selector.
 *
 */
exports["default"] = _react2["default"].createClass({

    displayName: "Chooser",

    getDefaultProps: function getDefaultProps() {
        return {
            disabled: false,
            disableSearch: false,
            searchContains: true,
            allowSingleDeselect: false,
            limit: 200,
            width: 300
        };
    },

    getInitialState: function getInitialState() {
        return {
            initialChoice: this.props.initialChoice,
            value: this.props.initialChoice,
            missing: false
        };
    },

    _isEmpty: function _isEmpty(value) {
        return _underscore2["default"].isNull(value) || _underscore2["default"].isUndefined(value) || value === "";
    },

    _isMissing: function _isMissing() {
        return this.props.required && !this.props.disabled && this._isEmpty(this.state.value);
    },

    _generateKey: function _generateKey(choice, choiceList) {
        var key = (0, _stringHash2["default"])(_underscore2["default"].map(choiceList, function (label) {
            return label;
        }).join("-"));
        key += "-" + choice;
        return key;
    },

    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        if (this.state.initialChoice !== nextProps.initialChoice) {
            var key = this._generateKey(nextProps.initialChoice, this.props.initialChoiceList);
            this.setState({
                key: key,
                initialChoice: nextProps.initialChoice,
                value: nextProps.initialChoice
            });

            // The value might have been missing and is now set explicitly
            // with a prop
            var missing = this.props.required && !this.props.disabled && (_underscore2["default"].isNull(nextProps.initialChoice) || _underscore2["default"].isUndefined(nextProps.initialChoice) || nextProps.initialChoice === "");
            var missingCount = missing ? 1 : 0;

            if (this.props.onMissingCountChange) {
                this.props.onMissingCountChange(this.props.attr, missingCount);
            }
        }
    },

    /**
     * If there's no initialValue for the chooser and this field is required
     * then report the missing count up to the parent.
     */
    componentDidMount: function componentDidMount() {
        var missing = this.props.required && !this.props.disabled && (_underscore2["default"].isNull(this.props.initialChoice) || _underscore2["default"].isUndefined(this.props.initialChoice) || this.props.initialChoice === "");
        var missingCount = missing ? 1 : 0;

        if (this.props.onMissingCountChange) {
            this.props.onMissingCountChange(this.props.attr, missingCount);
        }

        // The key needs to change if the initialChoiceList changes, so we set
        // the key to be the hash of the choice list
        this.setState({
            missing: missing,
            key: this._generateKey(this.props.initialChoice, this.props.initialChoiceList)
        });
    },

    handleChange: function handleChange(v) {

        var missing = this.props.required && this._isEmpty(v);

        // If the chosen id is a number, cast it to a number
        var value = undefined;
        if (!this._isEmpty(v) && !_underscore2["default"].isNaN(Number(v))) {
            value = Number(v);
        } else {
            value = v;
        }

        // State changes
        this.setState({ value: value, missing: missing });

        // Callbacks
        if (this.props.onChange) {
            this.props.onChange(this.props.attr, value);
        }
        if (this.props.onMissingCountChange) {
            this.props.onMissingCountChange(this.props.attr, missing ? 1 : 0);
        }
    },

    getOptionList: function getOptionList() {
        var _this = this;

        return _underscore2["default"].map(this.props.initialChoiceList, function (c) {
            var disabled = false;
            if (_underscore2["default"].contains(_this.props.disableList, c.id) || _underscore2["default"].has(c, "disabled") && c.disabled === true) {
                disabled = true;
            }
            return {
                value: c.id,
                label: c.label,
                disabled: disabled
            };
        });
    },

    getFilteredOptionList: function getFilteredOptionList(input, limit) {
        var items = this.props.initialChoiceList;

        //
        // If we don't have an input yet (the user hasn't typed a search) then
        // do one of two things:
        // - If the number of items is under the limit, just show them all
        // - If the number of items is larger than the limit, don't show anything
        //   until the user does type something (and react-select) will show the
        //   "Type to search" message.
        //

        if (!input || input.length < 1) {
            if (items.length < limit) {
                return _underscore2["default"].map(items, function (c) {
                    return {
                        value: c.id,
                        label: c.label,
                        disabled: _underscore2["default"].has(c, "disabled") ? c.disabled : false
                    };
                });
            } else {
                return [];
            }
        }

        //
        // Build a limited set of results if necessary
        //

        var filteredItems = input ? _underscore2["default"].filter(items, function (item) {
            return item.label.toLowerCase().indexOf(("" + input).toLowerCase()) !== -1;
        }) : items;
        var limitItems = _underscore2["default"].first(filteredItems, limit);
        var results = _underscore2["default"].map(limitItems, function (c) {
            return {
                value: c.id,
                label: c.label,
                disabled: _underscore2["default"].has(c, "disabled") ? c.disabled : false
            };
        });

        //
        //  If the results are limited then print a message at the bottom
        //

        if (filteredItems.length > limit) {
            var msg = "(showing first " + limit + " matches only)";
            results.push({
                id: "#{Math.random()}",
                label: msg,
                disabled: true
            });
        }

        return results;
    },

    getOptions: function getOptions(input, cb) {
        var options = this.getFilteredOptionList(input, this.props.limit);
        if (options) {
            cb(null, { options: options, complete: true });
        }
    },

    getCurrentChoice: function getCurrentChoice() {
        var _this2 = this;

        var choiceItem = _underscore2["default"].find(this.props.initialChoiceList, function (item) {
            var itemId = undefined;
            if (!_this2._isEmpty(item.id) && !_underscore2["default"].isNaN(Number(item.id))) {
                itemId = Number(item.id);
            } else {
                itemId = item.id;
            }
            return itemId === _this2.state.value;
        });

        return choiceItem ? choiceItem.id : undefined;
    },

    render: function render() {
        var className = "";

        var width = this.props.width ? this.props.width + "px" : "100%";

        var chooserStyle = {
            width: width,
            marginBottom: 10
        };

        if (!this.props.initialChoiceList) {
            throw new Error("No initial choice list supplied for attr '" + this.props.attr + "'");
        }

        if (this.props.showRequired && this._isMissing()) {
            className = "has-error";
        }

        var choice = this.getCurrentChoice();
        var clearable = this.props.allowSingleDeselect;
        var searchable = !this.props.disableSearch;
        var matchPos = this.props.searchContains ? "any" : "start";

        if (searchable) {
            var options = this.getFilteredOptionList(null, this.props.limit);
            var labelList = _underscore2["default"].map(options, function (item) {
                return item.label;
            });
            var key = labelList + "--" + choice;

            // Choose the item based on label, so it will show even when there's
            // no items in the list yet
            var choiceString = "";
            _underscore2["default"].each(this.props.initialChoiceList, function (item) {
                if (item.id === choice) {
                    choiceString = item.label;
                }
            });

            return _react2["default"].createElement(
                "div",
                { className: className, style: chooserStyle },
                _react2["default"].createElement(_reactSelect2["default"], {
                    key: key,
                    name: "form-field-name",
                    value: choiceString,
                    options: options,
                    disabled: this.props.disabled,
                    searchable: true,
                    matchPos: matchPos,
                    onChange: this.handleChange,
                    asyncOptions: this.getOptions,
                    cacheAsyncResults: false,
                    placeholder: this.props.placeholder
                })
            );
        } else {
            var options = this.getOptionList();
            var labelList = _underscore2["default"].map(options, function (item) {
                return item.label;
            });
            var key = labelList + "--" + choice;
            return _react2["default"].createElement(
                "div",
                { className: className, style: chooserStyle },
                _react2["default"].createElement(_reactSelect2["default"], {
                    key: key,
                    name: "form-field-name",
                    value: choice,
                    options: options,
                    disabled: this.props.disabled,
                    searchable: false,
                    clearable: clearable,
                    matchPos: matchPos,
                    onChange: this.handleChange,
                    placeholder: this.props.placeholder
                })
            );
        }
    }
});
module.exports = exports["default"];
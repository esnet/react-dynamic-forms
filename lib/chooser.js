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
            disableSearch: true,
            searchContains: true,
            allowSingleDeselect: false,
            width: "300"
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
                initialChoice: nextProps.initialChoice,
                value: nextProps.initialChoice,
                key: key
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
        this.setState({ value: value,
            missing: missing });

        // Callbacks
        if (this.props.onChange) {
            this.props.onChange(this.props.attr, value);
        }
        if (this.props.onMissingCountChange) {
            this.props.onMissingCountChange(this.props.attr, missing ? 1 : 0);
        }
    },

    render: function render() {
        var _this = this;

        var className = "";

        if (!this.props.initialChoiceList) {
            console.warn("No initial choice list supplied for attr", this.props.attr);
        }

        var width = this.props.width ? this.props.width + "px" : "100%";
        if (this.props.showRequired && this._isMissing()) {
            className = "has-error";
        }

        // Current choice
        var choiceItem = _underscore2["default"].find(this.props.initialChoiceList, function (item) {
            var itemId = undefined;
            if (!_this._isEmpty(item.id) && !_underscore2["default"].isNaN(Number(item.id))) {
                itemId = Number(item.id);
            } else {
                itemId = item.id;
            }
            return itemId === _this.state.value;
        });

        var choice = choiceItem ? choiceItem.id : undefined;

        // List of choice options
        var options = _underscore2["default"].map(this.props.initialChoiceList, function (c) {
            // let disabled = false;
            // if (_.contains(this.props.disableList, parseInt(c.id, 10))){
            //     disabled = true;
            // }
            return { value: c.id, label: c.label };
        });

        var clearable = this.props.allowSingleDeselect;
        var searchable = !this.props.disableSearch;
        var matchPos = this.props.searchContains ? "any" : "start";

        var labelList = _underscore2["default"].map(this.props.initialChoiceList, function (item) {
            return item.label;
        });
        var key = labelList + "--" + this.state.choice;

        return _react2["default"].createElement(
            "div",
            { className: className, style: { width: width } },
            _react2["default"].createElement(_reactSelect2["default"], {
                key: key,
                name: "form-field-name",
                value: choice,
                disabled: this.props.disabled,
                searchable: searchable,
                clearable: clearable,
                matchPos: matchPos,
                options: options,
                onChange: this.handleChange
            })
        );
    }
});
module.exports = exports["default"];
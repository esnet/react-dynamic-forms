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

var _listeditormixin = require("./listeditormixin");

var _listeditormixin2 = _interopRequireDefault(_listeditormixin);

var _chooser = require("./chooser");

var _chooser2 = _interopRequireDefault(_chooser);

var _textedit = require("./textedit");

var _textedit2 = _interopRequireDefault(_textedit);

// State transitions when adding to the key-value list
var CreationState = {
    OFF: "OFF",
    PICK_KEYNAME: "PICK_KEYNAME"
};

var KeyValueListEditor = _react2["default"].createClass({

    displayName: "KeyValueListEditor",

    mixins: [_listeditormixin2["default"]],

    getInitialState: function getInitialState() {
        return {
            createState: CreationState.OFF,
            keyName: null,
            value: "",
            valueError: false,
            validationRule: null
        };
    },

    /**  Set initial items */
    initialItems: function initialItems() {
        return this.props.keyValues || [];
    },

    /** Create a new item */
    createItem: function createItem(data) {
        var keyName = data.keyName;
        var value = data.value;
        return {
            keyName: keyName,
            value: value,
            valueError: false,
            validationRule: null
        };
    },

    handleKeyNameSelect: function handleKeyNameSelect(attr, value) {
        var validation = null;
        _underscore2["default"].each(this.props.constraints, function (constraint) {
            if (_underscore2["default"].isMatch(constraint, { keyname: value })) {
                if (constraint["datatype"] === "integer") {
                    validation = {
                        format: constraint["datatype"],
                        type: "integer"
                    };
                } else {
                    validation = {
                        format: constraint["datatype"],
                        type: "string"
                    };
                }
            }
        });
        this.setState({ validationRule: validation });
        this.setState({ keyName: value });
    },

    handleDialogValueChanged: function handleDialogValueChanged(attr, value) {
        this.setState({ value: value });
    },

    handleDone: function handleDone() {
        var data = {
            keyName: this.state.keyName,
            value: this.state.value,
            valueError: this.state.valueError,
            validationRule: this.state.validationRule
        };

        this.transitionTo(CreationState.OFF)();
        this.handleAddItem(data);

        this.setState({
            keyName: null,
            value: "",
            valueError: false,
            validationRule: null
        });
    },

    handleDialogValueError: function handleDialogValueError(attr, errorCount) {
        this.setState({ valueError: errorCount === 1 ? true : false });
    },

    handleCancel: function handleCancel() {
        this.transitionTo(CreationState.OFF)();
        this.setState({
            keyName: null,
            value: "",
            valueError: false,
            validationRule: null
        });
    },

    //
    // General state transition
    //

    transitionTo: function transitionTo(newState) {
        var _this = this;

        return function () {
            _this.setState({ createState: newState });
        };
    },

    plusUI: function plusUI() {
        var ui = undefined;
        var keyValueChoice = _underscore2["default"].map(this.props.constraints, function (value) {
            return {
                id: value["keyname"],
                label: value["keyname"]
            };
        });

        // Get a list of keys not already used in the existing items
        var existingKeys = _underscore2["default"].pluck(this.state.items, "keyName");
        var existingKeySet = _underscore2["default"].object(existingKeys, existingKeys);
        var filteredChoiceList = _underscore2["default"].filter(keyValueChoice, function (choice) {
            return !_underscore2["default"].has(existingKeySet, choice.label);
        });

        switch (this.state.createState) {

            case CreationState.OFF:
                // Initial UI to show the [+] Contact
                if (filteredChoiceList.length !== 0) {
                    ui = _react2["default"].createElement(
                        "div",
                        { className: "esdb-plus-action-box",
                            key: "append-new-or-existing",
                            style: { marginBottom: 10 },
                            onClick: this.transitionTo(CreationState.PICK_KEYNAME) },
                        _react2["default"].createElement(
                            "div",
                            null,
                            _react2["default"].createElement(
                                "i",
                                { className: "glyphicon glyphicon-plus esnet-forms-small-action-icon" },
                                "Key"
                            )
                        )
                    );
                } else {
                    ui = _react2["default"].createElement(
                        "div",
                        null,
                        _react2["default"].createElement(
                            "table",
                            null,
                            _react2["default"].createElement(
                                "tbody",
                                null,
                                _react2["default"].createElement(
                                    "tr",
                                    null,
                                    _react2["default"].createElement(
                                        "td",
                                        null,
                                        _react2["default"].createElement(
                                            "i",
                                            { className: "glyphicon glyphicon-plus esdb-small-action-icon text-muted" },
                                            "All available choices selected"
                                        )
                                    )
                                )
                            )
                        )
                    );
                }
                break;

            case CreationState.PICK_KEYNAME:
                var doneButtonElement = undefined;
                var cancelButtonElement = undefined;

                var buttonStyle = {
                    marginLeft: 0,
                    marginRight: 10,
                    marginTop: 10,
                    marginBottom: 10,
                    height: 22,
                    width: 55,
                    float: "right"
                };

                cancelButtonElement = _react2["default"].createElement(
                    "button",
                    { style: buttonStyle,
                        type: "button",
                        className: "btn btn-xs btn-default",
                        key: "cancel-button",
                        onClick: this.handleCancel },
                    "Cancel"
                );

                if (this.state.keyName === null || this.state.value === "" || this.state.valueError === true) {
                    doneButtonElement = _react2["default"].createElement(
                        "button",
                        { style: buttonStyle,
                            type: "button",
                            key: "pick-contact-button-disabled",
                            className: "btn btn-xs btn-default",
                            disabled: "disabled" },
                        "Done"
                    );
                } else {
                    doneButtonElement = _react2["default"].createElement(
                        "button",
                        { style: buttonStyle,
                            type: "button",
                            className: "btn btn-xs btn-default",
                            key: "pick-contact-button",
                            onClick: this.handleDone },
                        "Done"
                    );
                }

                ui = _react2["default"].createElement(
                    "div",
                    { className: "esdb-plus-action-box-dialog-lg",
                        key: "select-existing",
                        style: { marginBottom: 10 } },
                    _react2["default"].createElement(
                        "table",
                        null,
                        _react2["default"].createElement(
                            "tbody",
                            null,
                            _react2["default"].createElement(
                                "tr",
                                null,
                                _react2["default"].createElement(
                                    "td",
                                    { width: "150" },
                                    "Key Name"
                                ),
                                _react2["default"].createElement(
                                    "td",
                                    null,
                                    _react2["default"].createElement(_chooser2["default"], {
                                        attr: "keyName",
                                        initialChoice: null,
                                        initialChoiceList: filteredChoiceList,
                                        onChange: this.handleKeyNameSelect })
                                )
                            ),
                            _react2["default"].createElement(
                                "tr",
                                null,
                                _react2["default"].createElement(
                                    "td",
                                    { width: "150" },
                                    "Value"
                                ),
                                _react2["default"].createElement(
                                    "td",
                                    null,
                                    _react2["default"].createElement(_textedit2["default"], {
                                        attr: "value",
                                        rules: this.state.validationRule,
                                        onErrorCountChange: this.handleDialogValueError,
                                        onChange: this.handleDialogValueChanged,
                                        width: 300 })
                                )
                            ),
                            _react2["default"].createElement(
                                "tr",
                                null,
                                _react2["default"].createElement("td", null),
                                _react2["default"].createElement(
                                    "td",
                                    null,
                                    _react2["default"].createElement(
                                        "span",
                                        null,
                                        cancelButtonElement
                                    ),
                                    _react2["default"].createElement(
                                        "span",
                                        null,
                                        doneButtonElement
                                    )
                                )
                            )
                        )
                    )
                );
                break;
        }
        return ui;
    },

    renderItem: function renderItem(item) {
        var style = {
            paddingLeft: 12,
            color: "#A6A6A6"
        };
        var keyName = item.keyName;
        var value = item.value;
        return _react2["default"].createElement(
            "div",
            null,
            _react2["default"].createElement(
                "table",
                null,
                _react2["default"].createElement(
                    "tbody",
                    null,
                    _react2["default"].createElement(
                        "tr",
                        null,
                        _react2["default"].createElement(
                            "td",
                            { width: "140" },
                            keyName
                        ),
                        _react2["default"].createElement(
                            "td",
                            null,
                            _react2["default"].createElement(
                                "span",
                                { style: style },
                                value
                            )
                        )
                    )
                )
            )
        );
    }
});

exports["default"] = _react2["default"].createClass({

    displayName: "KeyValueEditor",

    handleChange: function handleChange(attr, keyValue) {
        var newKeyValues = {};

        _underscore2["default"].each(keyValue, function (keyName) {
            newKeyValues[keyName["keyName"]] = keyName["value"];
        });

        if (this.props.onChange) {
            this.props.onChange(this.props.attr, newKeyValues);
        }
    },

    render: function render() {
        var keyValuesDict = this.props.keyValues;
        var keyValueList = [];
        _underscore2["default"].each(keyValuesDict, function (value, keyName) {
            keyValueList.push({ keyName: keyName, value: value });
        });

        return _react2["default"].createElement(KeyValueListEditor, {
            keyValues: keyValueList,
            constraints: this.props.constraints,
            onChange: this.handleChange });
    }
});
module.exports = exports["default"];
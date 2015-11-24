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

var _classnames = require("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

require("./group.css");

/**
 * Example:
 *  <Group attr={this.getAttr("contact_type")} >
 *      <Chooser initialChoice={contactType} initialChoiceList={contactTypes} disableSearch={true}/>
 *  </Group>
 */
exports["default"] = _react2["default"].createClass({

    displayName: "Group",

    render: function render() {
        var attr = this.props.attr;

        if (!attr) {
            throw new Error("Group: Attr not found");
        }

        var hidden = attr.hidden || false;

        if (hidden) {
            return _react2["default"].createElement("div", null);
        }

        // Control
        var props = {
            attr: attr.attr,
            key: attr.key,
            ref: attr.attr,
            disabled: attr.disabled,
            placeholder: attr.placeholder,
            rules: attr.validation,
            required: attr.required,
            showRequired: attr.showRequired,
            onErrorCountChange: attr.errorCountCallback,
            onMissingCountChange: attr.missingCountCallback,
            onChange: attr.changeCallback,
            validator: this.props.validator
        };

        var child = _react2["default"].Children.only(this.props.children);
        var childControl = _react2["default"].cloneElement(child, props);

        var control = _react2["default"].createElement(
            "div",
            { className: "col-sm-9" },
            childControl
        );

        //
        // Required
        //

        var required = undefined;
        if (attr.required) {
            required = _react2["default"].createElement(
                "span",
                { className: "group-required", style: { paddingLeft: 3 } },
                "*"
            );
        } else {
            required = _react2["default"].createElement(
                "span",
                null,
                " "
            );
        }

        //
        // Label
        //

        var labelText = attr.name;
        var labelClasses = (0, _classnames2["default"])({
            "group-label": true,
            "col-sm-3": true,
            required: attr.required
        });
        var label = _react2["default"].createElement(
            "div",
            { className: labelClasses, style: { whiteSpace: "nowrap" } },
            _react2["default"].createElement(
                "label",
                { muted: attr.disabled, htmlFor: attr.key },
                labelText
            ),
            required
        );

        // Group
        return _react2["default"].createElement(
            "div",
            { className: "form-group row" },
            label,
            " ",
            control
        );
    }
});
module.exports = exports["default"];
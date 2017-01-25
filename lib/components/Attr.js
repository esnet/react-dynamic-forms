"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _invariant = require("invariant");

var _invariant2 = _interopRequireDefault(_invariant);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * An `Attr` is a part of the JSX definition of a `Schema`. Each `Attr` describes
 * the rules and meta data associated with a field on the `Form`.
 *
 * For example, here is an `Attr` which defines a field that takes the users
 * email address:
 *
 * ```
 *   <Schema>
 *     ...
 *     <Attr
 *         name="email"
 *         label="Email"
 *         placeholder="Enter valid email address"
 *         validation={{"format": "email"}}/>
 *     ...
 *   </Schema>
 * ```
 *
 * ### Props
 *
 *  * *name* - The name of the field, or basically how it is referenced when rendering the field
 *  * *label* - The UI fieldly name of the field, used when constructing a `Group`.
 *  * *placeholder* - If appropiate to the widget, displays placeholder text.
 *  * *validation* - See [Revalidator](https://github.com/flatiron/revalidator) for possible formats
 * for the validation property.
 *
 */
/**
 *  Copyright (c) 2015, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

exports.default = _react2.default.createClass({
    displayName: "Attr",
    render: function render() {
        (0, _invariant2.default)(false, this.constructor.name + " elements are for schema\nconfiguration only and should not be rendered");
        return;
    }
});
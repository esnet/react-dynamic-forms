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
 * A schema can be specified using JSX to define the rules for
 * each form field. As an example, here is a form that will take the
 * first name, last name and email of a contact. We can define also
 * that the email should be of format `email` and that the first and
 * last names are `required`:
 *
 * ```
 *    const schema = (
 *        <Schema>
 *            <Attr name="first_name" label="First name" placeholder="Enter first name"
 *                  required={true} validation={{"type": "string"}}/>
 *            <Attr name="last_name" label="Last name" placeholder="Enter last name"
 *                  required={true} validation={{"type": "string"}}/>
 *            <Attr name="email" label="Email" placeholder="Enter valid email address"
 *                  validation={{"format": "email"}}/>
 *        </Schema>
 *    );
 * ```
 *
 * See also `Attr`.
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
    displayName: "Schema",
    render: function render() {
        (0, _invariant2.default)(false, this.constructor.name + " elements are for schema configuration only and should not be rendered");
        return;
    }
});
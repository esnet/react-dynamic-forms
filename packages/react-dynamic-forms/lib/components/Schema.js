"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *  Copyright (c) 2015 - present, The Regents of the University of California,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *  through Lawrence Berkeley National Laboratory (subject to receipt
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *  of any required approvals from the U.S. Dept. of Energy).
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *  All rights reserved.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *  This source code is licensed under the BSD-style license found in the
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *  LICENSE file in the root directory of this source tree.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _invariant = require("invariant");

var _invariant2 = _interopRequireDefault(_invariant);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * A schema can be specified using JSX to define the rules for
 * each form field. As an example, here is a Form that will take the
 * first name, last name and email of a contact. We can define also
 * that the email should be of format `email` and that the first and
 * last names are `required`:
 *
 * ```
 * const schema = (
 *     <Schema>
 *         <Field name="first_name" label="First name" placeholder="Enter first name"
 *                required={true} validation={{"type": "string"}} />
 *         <Field name="last_name" label="Last name" placeholder="Enter last name"
 *                required={true} validation={{"type": "string"}} />
 *         <Field name="email" label="Email" placeholder="Enter valid email address"
 *                validation={{"format": "email"}} />
 *     </Schema>
 * );
 * ```
 *
 * See also `Field`.
 */
var Schema = function () {
    function Schema() {
        _classCallCheck(this, Schema);
    }

    _createClass(Schema, [{
        key: "render",
        value: function render() {
            (0, _invariant2.default)(false, this.constructor.name + " elements are for schema configuration only and should not be rendered");
            return;
        }
    }]);

    return Schema;
}();

exports.default = Schema;
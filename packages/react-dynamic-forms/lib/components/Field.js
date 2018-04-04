"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _invariant = require("invariant");

var _invariant2 = _interopRequireDefault(_invariant);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  Copyright (c) 2017 - present, The Regents of the University of California,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  through Lawrence Berkeley National Laboratory (subject to receipt
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  of any required approvals from the U.S. Dept. of Energy).
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  All rights reserved.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  This source code is licensed under the BSD-style license found in the
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  LICENSE file in the root directory of this source tree.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

/**
 * A `Field` is a part of the JSX definition of a `Schema`. Each `Field` describes
 * the rules and meta data associated with a field on the `Form`.
 *
 * For example, here is an `Field` which will input the users email address, defining
 * a user friendly label "Email", a placeholder and a validation rule that expects
 * the field to be a valid email address. The field is also required to be filled in.
 *
 * ```
 * <Schema>
 *     ...
 *      <Field
 *         required
 *         name="email"
 *         label="Email"
 *         placeholder="Enter valid email address"
 *         validation={{"format": "email"}}/>
 *     ...
 * </Schema>
 * ```
 */
var Field = function (_React$Component) {
  _inherits(Field, _React$Component);

  function Field() {
    _classCallCheck(this, Field);

    return _possibleConstructorReturn(this, (Field.__proto__ || Object.getPrototypeOf(Field)).apply(this, arguments));
  }

  _createClass(Field, [{
    key: "render",
    value: function render() {
      (0, _invariant2.default)(false, this.constructor.name + " elements are for schema configuration only and should not be rendered");
      return;
    }
  }]);

  return Field;
}(_react2.default.Component);

exports.default = Field;


Field.propTypes = {
  /**
   * name - The name of the field, or basically how it is referenced when rendering the field
   */
  name: _propTypes2.default.string,

  /**
   * label - The UI fieldly name of the field, used when constructing a `Group`.
   */
  label: _propTypes2.default.string,

  /**
   * placeholder - If appropiate to the widget, displays placeholder text.
   */
  placeholder: _propTypes2.default.string,

  /**
   * validation* - See [Revalidator](https://github.com/flatiron/revalidator) for possible formats
   * for the validation property.
   */
  validation: _propTypes2.default.object
};
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

require("./formerrors.css");

/**
 * Display errors for a form. This manages three types of error/warning infomation that is
 * displayed to the user:
 *
 *   - A hard error, which will display in preference to other
 *     messages. A hard error might be something like "The form
 *     could not be saved". This type of error, passed in as the
 *     'error' prop, is an object with two parts:
 *         * msg     - The main error message
 *         * details - Further information about the message
 *
 *   - error count, passed in as 'numErrors' prop. If this is
 *     passed in then this component will display the number of
 *     errors on the form. This is used with the Form code so
 *     that the user can see live how many validation errors are
 *     left on the page
 *
 *   - missing count, passed in as 'missingCount' prop. If there
 *     is not an error on the page but missingCount > 0 then this
 *     component will display a n fields to complete message. If
 *     the prop 'showRequired' is passed in as true, then the
 *     form is in the mode of actually displaying as an error
 *     all missing fields. The message in this case will be
 *     simply "Form incomplete".
 */
exports["default"] = _react2["default"].createClass({

    displayName: "FormErrors",

    render: function render() {
        if (this.props.error) {
            var error = this.props.error.msg;
            var details = this.props.error.details || "";

            return _react2["default"].createElement(
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
                            { width: "40px" },
                            _react2["default"].createElement(
                                "span",
                                null,
                                _react2["default"].createElement("i", { className: "glyphicon formerrors-icon glyphicon-exclamation-sign" })
                            )
                        ),
                        _react2["default"].createElement(
                            "td",
                            null,
                            _react2["default"].createElement(
                                "span",
                                { style: { paddingLeft: 0 }, className: "formerrors-text" },
                                error
                            )
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
                                { style: { color: "#FFA500", fontSize: "small" } },
                                details
                            )
                        )
                    )
                )
            );
        } else if (this.props.numErrors === 0) {
            if (this.props.showRequired && this.props.missingCount > 0) {
                return _react2["default"].createElement(
                    "div",
                    null,
                    _react2["default"].createElement(
                        "span",
                        null,
                        _react2["default"].createElement("i", { className: "glyphicon formerrors-icon glyphicon-exclamation-sign" })
                    ),
                    _react2["default"].createElement(
                        "span",
                        { className: "formerrors-text" },
                        "Form incomplete"
                    )
                );
            } else if (this.props.missingCount > 0) {
                if (this.props.missingCount > 1) {
                    return _react2["default"].createElement(
                        "div",
                        null,
                        _react2["default"].createElement(
                            "span",
                            { className: "formerrors-text" },
                            this.props.missingCount,
                            " fields still required"
                        )
                    );
                } else {
                    return _react2["default"].createElement(
                        "div",
                        null,
                        _react2["default"].createElement(
                            "span",
                            { className: "formerrors-text" },
                            this.props.missingCount,
                            " field still required"
                        )
                    );
                }
            } else {
                return null;
            }
        } else if (this.props.numErrors === 1) {
            return _react2["default"].createElement(
                "div",
                null,
                _react2["default"].createElement(
                    "span",
                    null,
                    _react2["default"].createElement("i", { className: "glyphicon formerrors-icon glyphicon-exclamation-sign" })
                ),
                _react2["default"].createElement(
                    "span",
                    { className: "formerrors-text" },
                    this.props.numErrors,
                    " Error"
                )
            );
        } else if (this.props.numErrors > 1) {
            return _react2["default"].createElement(
                "div",
                null,
                _react2["default"].createElement(
                    "span",
                    null,
                    _react2["default"].createElement("i", { className: "glyphicon formerrors-icon glyphicon-exclamation-sign" })
                ),
                _react2["default"].createElement(
                    "span",
                    { className: "formerrors-text" },
                    this.props.numErrors,
                    " Errors"
                )
            );
        } else {
            return null;
        }
    }
});
module.exports = exports["default"];
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

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _group = require("./group");

var _group2 = _interopRequireDefault(_group);

var _tagsedit = require("./tagsedit");

var _tagsedit2 = _interopRequireDefault(_tagsedit);

/**
 * Wraps the tags editor widget
 */
exports["default"] = _react2["default"].createClass({

    displayName: "TagsGroup",

    render: function render() {
        var _props = this.props;
        var attr = _props.attr;
        var children = _props.children;

        var others = _objectWithoutProperties(_props, ["attr", "children"]);

        //eslint-disable-line
        return _react2["default"].createElement(
            _group2["default"],
            { attr: attr },
            _react2["default"].createElement(_tagsedit2["default"], others)
        );
    }
});
module.exports = exports["default"];
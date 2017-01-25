"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _Group = require("./Group");

var _Group2 = _interopRequireDefault(_Group);

var _TagsEdit = require("./TagsEdit");

var _TagsEdit2 = _interopRequireDefault(_TagsEdit);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; } /**
                                                                                                                                                                                                                              *  Copyright (c) 2015, The Regents of the University of California,
                                                                                                                                                                                                                              *  through Lawrence Berkeley National Laboratory (subject to receipt
                                                                                                                                                                                                                              *  of any required approvals from the U.S. Dept. of Energy).
                                                                                                                                                                                                                              *  All rights reserved.
                                                                                                                                                                                                                              *
                                                                                                                                                                                                                              *  This source code is licensed under the BSD-style license found in the
                                                                                                                                                                                                                              *  LICENSE file in the root directory of this source tree.
                                                                                                                                                                                                                              */

/**
 * Wraps the tags editor widget
 */
exports.default = _react2.default.createClass({
    displayName: "TagsGroup",
    render: function render() {
        var _props = this.props,
            attr = _props.attr,
            others = _objectWithoutProperties(_props, ["attr"]);

        return _react2.default.createElement(
            _Group2.default,
            { attr: attr },
            _react2.default.createElement(_TagsEdit2.default, others)
        );
    }
});
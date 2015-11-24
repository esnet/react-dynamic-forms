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

require("./select.css");

/**
 * Form control to select tags from a pull down list.
 * You can also add a new tag with the Add tag button.
 */
exports["default"] = _react2["default"].createClass({

    displayName: "TagsEdit",

    getInitialState: function getInitialState() {
        return {
            tags: this.props.initialTags || [],
            tagList: this.props.initialTagList || [],
            showNewTagUI: false
        };
    },

    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        this.setState({
            tags: nextProps.initialTags || [],
            tagList: nextProps.initialTagList || []
        });
    },

    handleChange: function handleChange(val, tagList) {
        var tags = _underscore2["default"].unique(_underscore2["default"].map(tagList, function (tag) {
            return tag.label;
        }));

        var newAvailableTags = this.state.tagList;
        _underscore2["default"].each(tags, function (tag) {
            if (_underscore2["default"].indexOf(newAvailableTags, tag) === -1) {
                newAvailableTags.push(tag);
            }
        });

        this.setState({
            tags: tags,
            tagList: newAvailableTags
        });
        if (this.props.onChange) {
            this.props.onChange(this.props.attr, tags);
        }
    },

    render: function render() {
        var _this = this;

        var className = "";

        var width = this.props.width ? this.props.width + "px" : "100%";
        if (this.props.showRequired && this._isMissing()) {
            className = "has-error";
        }

        var options = _underscore2["default"].map(this.state.tagList, function (tag, index) {
            var disabled = false;
            if (_underscore2["default"].has(_this.state.tags, tag)) {
                disabled = true;
            }
            return { value: index, label: tag, disabled: disabled };
        });

        if (_underscore2["default"].isUndefined(this.state.tags) || _underscore2["default"].isUndefined(this.state.tagList)) {
            var err = "Tags was supplied with bad state: attr is " + this.props.attr;
            err += " (tags are: " + this.state.tags + " and tagList is: " + this.state.tagList + ")";
            throw new Error(err);
        }

        var key = this.state.tags.join("-") + "--" + this.state.tagList.join("-");
        return _react2["default"].createElement(
            "div",
            { className: className, style: { width: width } },
            _react2["default"].createElement(_reactSelect2["default"], {
                key: key,
                multi: true,
                disabled: this.props.disabled,
                placeholder: "Select tags...",
                value: this.state.tags,
                allowCreate: true,
                options: options,
                onChange: this.handleChange
            }),
            _react2["default"].createElement("div", { className: "help-block" })
        );
    }
});
module.exports = exports["default"];
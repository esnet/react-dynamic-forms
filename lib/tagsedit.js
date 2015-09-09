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

require("./chooser.css");

/**
 * Form control to select tags from a pull down list. You can also add a new tag with
 * the Add tag button.
 */
exports["default"] = _react2["default"].createClass({

    displayName: "TagsEdit",

    getInitialState: function getInitialState() {
        console.log("Initial", this.props.initialTags, this.props.initialTagList);
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

    handleShowNewTagUI: function handleShowNewTagUI() {
        this.setState({ "showNewTagUI": true });
    },

    handleSubmitNewTagUI: function handleSubmitNewTagUI(e) {
        e.preventDefault();

        var currentTagList = this.state.tags;
        var tagList = this.state.tagList;
        var tag = this.refs.newTag.getDOMNode().value.trim();

        if (tag) {
            if (!_underscore2["default"].contains(tagList, tag)) {
                tagList.push(tag);
            }
            currentTagList.push(tag);
        }

        this.setState({ "showNewTagUI": false,
            "tags": currentTagList,
            "tagList": tagList });

        if (this.props.onChange) {
            this.props.onChange(this.props.attr, currentTagList);
        }
    },

    handleChange: function handleChange(val, tagList) {
        var tags = _underscore2["default"].unique(_underscore2["default"].map(tagList, function (tag) {
            return tag.label;
        }));
        this.setState({ "tags": tags });
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
            console.error("Tags was supplied with bad state: attr is", this.props.attr, " (tags are:", this.state.tags, "and tagList is:", this.state.tagList, ")");
            return null;
        }

        var key = this.state.tags.join("-") + "--" + this.state.tagList.join("-");
        var clearable = this.props.allowSingleDeselect;
        var searchable = !this.props.disableSearch;
        var matchPos = this.props.searchContains ? "any" : "start";

        return _react2["default"].createElement(
            "div",
            { className: className, style: { width: width } },
            _react2["default"].createElement(_reactSelect2["default"], { multi: true,
                placeholder: "Select tags...",
                value: this.state.tags,
                disabled: this.props.disabled,
                searchable: searchable,
                clearable: clearable,
                allowCreate: true,
                matchPos: matchPos,
                options: options,
                onChange: this.handleChange
            }),
            _react2["default"].createElement("div", { className: "help-block" })
        );
    }
});
module.exports = exports["default"];
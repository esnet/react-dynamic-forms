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

var _reactBootstrap = require("react-bootstrap");

/**
 * A dialog for confirming that you want to delete something, triggered from a trashcan icon.
 *
 * You can pass in a 'warning' which will be displayed to the user. Something like:
 *      "This will delete the whole organization and all the contacts in it"
 *
 * The dialog will follow this up with the text:
 *      "This action can not be undone."
 * though this can be altered with the 'text' prop.
 *
 * TODO: Decide if this should be in this forms library, or somewhere else.
 */
exports["default"] = _react2["default"].createClass({

    mixins: [_reactBootstrap.OverlayMixin],

    displayName: "DeleteAction",

    getInitialState: function getInitialState() {
        return {
            isModalOpen: false
        };
    },

    getDefaultProps: function getDefaultProps() {
        return {
            title: "Confirm delete",
            warning: "Are you sure you want to delete this?",
            text: "This action can not be undone."
        };
    },

    show: function show() {
        this.setState({
            isModalOpen: true
        });
    },

    close: function close() {
        this.setState({
            isModalOpen: false
        });
    },

    action: function action() {
        this.setState({
            isModalOpen: false
        });

        //Action callback
        if (this.props.action) {
            this.props.action(this.props.id);
        }
    },

    render: function render() {
        return _react2["default"].createElement("i", { className: "glyphicon glyphicon-trash esdb-action-icon reject", onClick: this.show });
    },

    renderOverlay: function renderOverlay() {
        if (!this.state.isModalOpen) {
            return _react2["default"].createElement("span", null);
        }

        return _react2["default"].createElement(
            _reactBootstrap.Modal,
            { title: this.props.title, animation: false, onRequestHide: this.close },
            _react2["default"].createElement(
                "div",
                { className: "modal-body" },
                _react2["default"].createElement(
                    "h4",
                    null,
                    this.props.warning
                ),
                _react2["default"].createElement(
                    "p",
                    null,
                    this.props.text
                )
            ),
            _react2["default"].createElement(
                "div",
                { className: "modal-footer" },
                _react2["default"].createElement(
                    _reactBootstrap.Button,
                    { onClick: this.close },
                    "Close"
                ),
                _react2["default"].createElement(
                    _reactBootstrap.Button,
                    { onClick: this.action, bsStyle: "danger" },
                    "Delete"
                )
            )
        );
    }
});
module.exports = exports["default"];
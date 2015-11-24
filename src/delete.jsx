/**
 *  Copyright (c) 2015, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import React from "react";
import {Modal, Button, OverlayMixin} from "react-bootstrap";

/**
 * A dialog for confirming that you want to delete something,
 * triggered from a trashcan icon.
 *
 * You can pass in a 'warning' which will be displayed to the user.
 * Something like:
 *      "This will delete the whole organization and all the contacts in it"
 *
 * The dialog will follow this up with the text:
 *      "This action can not be undone."
 * though this can be altered with the 'text' prop.
 *
 * TODO: Decide if this should be in this forms library, or somewhere else.
 */
export default React.createClass({

    mixins: [OverlayMixin],

    displayName: "DeleteAction",

    getInitialState() {
        return {
            isModalOpen: false
        };
    },

    getDefaultProps() {
        return {
            title: "Confirm delete",
            warning: "Are you sure you want to delete this?",
            text: "This action can not be undone."
        };
    },

    show() {
        this.setState({
            isModalOpen: true
        });
    },

    close() {
        this.setState({
            isModalOpen: false
        });
    },

    action() {
        this.setState({
            isModalOpen: false
        });

        // Action callback
        if (this.props.action) {
            this.props.action(this.props.id);
        }
    },

    render() {
        return (
            <i className="glyphicon glyphicon-trash esdb-action-icon reject"
               onClick={this.show} ></i>
        );
    },

    renderOverlay() {
        if (!this.state.isModalOpen) {
            return <span />;
        }

        return (
            <Modal
                title={this.props.title} animation={false}
                onRequestHide={this.close}>
                <div className="modal-body">
                    <h4>{this.props.warning}</h4>
                    <p>{this.props.text}</p>
                </div>
                <div className="modal-footer">
                    <Button onClick={this.close}>Close</Button>
                    <Button
                        onClick={this.action}
                        bsStyle="danger">Delete</Button>
                </div>
            </Modal>
        );
    }
});

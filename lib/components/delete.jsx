/** @jsx React.DOM */

"use strict";

var React = require("react/addons");

var _ = require("underscore");

var {Modal, Button, OverlayMixin} = require("react-bootstrap");

/**
 * A dialog for confirming that you want to delete something, triggered from a trashcan icon.
 * TODO: Decide if this should be in this forms library, or somewhere else.
 */
var DeleteAction = React.createClass({
    mixins: [OverlayMixin],

    displayName: "DeleteAction",

    getInitialState: function () {
        return {
          isModalOpen: false
        };
    },

    show: function () {
        this.setState({
            isModalOpen: true
        });
    },

    close: function () {
        this.setState({
            isModalOpen: false
        });
    },

    action: function () {
        this.setState({
            isModalOpen: false
        });

        //Action callback
        if (this.props.action) {
            this.props.action(this.props.id);
        }
    },

    render: function () {
        return (
            <i className="glyphicon glyphicon-trash esdb-action-icon reject" onClick={this.show} ></i>
        );
    },

    renderOverlay: function () {
        if (!this.state.isModalOpen) {
            return <span />;
        }
        return (
            <Modal title="Confirmation" animation={false} onRequestHide={this.close}>
                <div className="modal-body">
                    <h4>Are you sure you want to delete this?</h4>
                    <p>This action can not be undone.</p>
                </div>
                <div className="modal-footer">
                    <Button onClick={this.close}>Close</Button>
                    <Button onClick={this.action} bsStyle="danger">Delete</Button>
                </div>
            </Modal>
        );
    }
});

module.exports = DeleteAction;
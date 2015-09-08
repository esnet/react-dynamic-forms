"use strict";

var React = require("react");
var _ = require("underscore");

var {Modal,
     Button,
     OverlayMixin} = require("react-bootstrap");

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
var DeleteAction = React.createClass({

    mixins: [OverlayMixin],

    displayName: "DeleteAction",

    getInitialState: function () {
        return {
            isModalOpen: false
        };
    },

    getDefaultProps: function() {
        return {
            title: "Confirm delete",
            warning: "Are you sure you want to delete this?",
            text: "This action can not be undone."
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
            <Modal title={this.props.title} animation={false} onRequestHide={this.close}>
                <div className="modal-body">
                    <h4>{this.props.warning}</h4>
                    <p>{this.props.text}</p>
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

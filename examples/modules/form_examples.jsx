/** @jsx React.DOM */

"use strict";

var React   = require("react");
var _       = require("underscore");
var {Alert} = require("react-bootstrap");

var {FormMixin, TextEditGroup, Schema, Attr} = require("../../entry");

/**
 * Edit a contact
 */
var ContactEditor = React.createClass({

    mixins: [FormMixin],

    displayName: "ContactEditor",

    getInitialState: function() {

        var contactSchema = (
            <Schema name="bob">
                <Attr name="first_name" label="First name" placeholder="Enter first name" required={true} validation={{"type": "string"}}/>
                <Attr name="last_name" label="Last name" placeholder="Enter last name" required={true} validation={{"type": "string"}}/>           
                <Attr name="email" label="Email" placeholder="Enter valid email address" validation={{"format": "email"}}/>
            </Schema>
        );

        return {
            formSchema: contactSchema,
            formValues: this.props.contact
        }
    },

    /**
     * Save the form
     */
    handleSubmit: function(e) {
        e.preventDefault();

        if (this.hasMissing()) {
            this.showRequiredOn();
            return;
        }

        //Save form
        this.props.onSubmit && this.props.onSubmit(this.values());

        return false;
    },

    render: function() {
        var disableSubmit = (this.errorCount() !== 0);
        var formStyle = {background: "#FAFAFA", padding: 10, borderRadius:5};
        return (
            <form style={formStyle} noValidate className="form-horizontal" onSubmit={this.handleSubmit}>
                <TextEditGroup attr={this.getAttr("first_name")} width={300} />
                <TextEditGroup attr={this.getAttr("last_name")} width={300} />
                <TextEditGroup attr={this.getAttr("email")} width={300} />

                <input className="btn btn-default" type="submit" value="Submit" disabled={disableSubmit}/>
            </form>
        );
    }
});

var FormExample = React.createClass({

    getInitialState: function() {
        return {
            bob: {
                "first_name": "Bob",
                "last_name": "Smith",
                "email": "bob@gmail.com"
            },
        };
    },

    handleSubmit: function(value) {
        this.setState({"data": value});
    },

    handleAlertDismiss: function() {
        this.setState({"data": undefined});
    },

    renderAlert: function() {
        if (this.state.data) {
            var firstName = this.state.data["first_name"];
            var lastName = this.state.data["last_name"];
            return (
                <Alert bsStyle="success" onDismiss={this.handleAlertDismiss} style={{margin: 5}}>
                  <strong>Success!</strong> {firstName} {lastName} was submitted.
                </Alert>
            );
        } else {
            return null;
        }
    },

    render: function() {
        var bob = this.state.bob;

        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <h3>Contact form</h3>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12">
                        <ContactEditor contact={bob} onSubmit={this.handleSubmit}/>
                    </div>
                    <div className="col-md-12">
                        {this.renderAlert()}
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = FormExample;
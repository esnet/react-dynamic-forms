/** @jsx React.DOM */

"use strict";

var React   = require("react");
var _       = require("underscore");
var {Alert} = require("react-bootstrap");

var {FormMixin, TextEditGroup, Schema, Attr} = require("../../entry");

var description = "This shows a simple form where the schema and values of the form are loaded " +
                  "at some future time, such as if they were read from a REST API.";

var schema = (
    <Schema>
        <Attr name="first_name" label="First name" placeholder="Enter first name" required={true} validation={{"type": "string"}}/>
        <Attr name="last_name" label="Last name" placeholder="Enter last name" required={true} validation={{"type": "string"}}/>
        <Attr name="email" label="Email" placeholder="Enter valid email address" validation={{"format": "email"}}/>
    </Schema>
);

var values = {
    "first_name": "Bill",
    "last_name": "Jones",
    "email": "bill@gmail.com"
};

/**
 * Edit a contact
 */
var ContactForm = React.createClass({

    mixins: [FormMixin],

    displayName: "ContactForm",

    /**
     * Save the form
     */
    handleSubmit: function(e) {
        e.preventDefault();

        if (this.hasMissing()) {
            this.showRequiredOn();
            return;
        }

        this.props.onSubmit && this.props.onSubmit(this.getValues());

        return false;
    },


    componentDidMount: function() {
        var self = this;

        //Simulate ASYNC further update of data
        //setTimeout(function() {
        //    self.setValues({
        //        "first_name": "Bob",
        //        "last_name": "Smith",
        //        "email": "bob@gmail.com"
        //    });
        //}, 1500);
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
            "data":  undefined,
            "loaded": false,
        };
    },

    componentDidMount: function() {
        var self = this;

        //Simulate ASYNC state update
        setTimeout(function() {
            self.setState({
                "loaded": true
            });
        }, 1500);
    },

    handleSubmit: function(value) {
        this.setState({"data": value});
    },

    handleAlertDismiss: function() {
        this.setState({"data": undefined});
    },

    renderAlert: function() {
        if (this.state && this.state.data) {
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

    renderContactForm: function() {
        if (this.state.loaded) {
            return (
                <ContactForm schema={schema} values={values} onSubmit={this.handleSubmit}/>
            );
        } else {
            return (
                <div style={{marginTop: 50}}><b>Loading...</b></div>
            );
        }
    },

    render: function() {
        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <h3>Contact form</h3>
                        <div style={{marginBottom: 20}}>{description}</div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-9">
                        {this.renderContactForm()}
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-9">
                        {this.renderAlert()}
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = FormExample;
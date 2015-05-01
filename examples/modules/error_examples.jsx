"use strict";

var React = require("react/addons");
var _ = require("underscore");
var Markdown = require("react-markdown-el");
var {Alert} = require("react-bootstrap");

var {Form, FormMixin, FormErrors, TextEditGroup, Schema, Attr} = require("../../entry");

var text = require("raw!../markdown/errors_examples.md");

var description = "This shows a simple form where we track form validation errors and incomplete fields";

var schema = (
    <Schema>
        <Attr name="first_name" label="First name" placeholder="Enter first name" required={true} validation={{"type": "string"}}/>
        <Attr name="last_name" label="Last name" placeholder="Enter last name" required={true} validation={{"type": "string"}}/>
        <Attr name="email" label="Email" placeholder="Enter valid email address" validation={{"format": "email"}}/>
    </Schema>
);

var values = {
    "first_name": "",
    "last_name": "",
    "email": ""
};

/**
 * Edit a contact
 */
var ContactForm = React.createClass({

    mixins: [FormMixin],

    displayName: "ContactForm",

    renderForm: function() {
        var disableSubmit = this.hasErrors();
        var formStyle = {background: "#FAFAFA", padding: 10, borderRadius:5};
        return (
            <Form style={formStyle}>
                <TextEditGroup attr="first_name" width={300} />
                <TextEditGroup attr="last_name" width={300} />
                <TextEditGroup attr="email" width={500} />
            </Form>
        );
    }
});

var FormExample = React.createClass({

    getInitialState: function() {
        return {
            "data": null,
            "showRequired": false,
            "missingCount": 0,
            "errorCount": 0
        };
    },


    handleAlertDismiss: function() {
        this.setState({"data": undefined});
    },

    handleMissingCountChange: function(attr, count) {
        this.setState({"missingCount": count});
    },

    handleErrorCountChange: function(attr, count) {
        this.setState({"errorCount": count});
    },

    //
    // Submit and related functions
    //

    formValues: function() {
        if (this.refs.form) {
            return this.refs.form.getValues();
        } else {
            return {};
        }
    },

    hasMissing: function() {
        return this.state.missingCount > 0;
    },

    canSubmit: function() {
        return this.state.errorCount === 0;
    },

    showRequired: function(b) {
        var on = b || true;
        this.setState({"showRequired": on});
    },

    handleSubmit: function() {
        var values = this.formValues();

        if (this.hasMissing()) {
            this.showRequired();
            return;
        }

        this.setState({"data": values});
    },

    //
    // Render functions
    //

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
        return (
            <ContactForm ref="form"
                         attr="contact"
                         schema={schema}
                         values={values}
                         showRequired={this.state.showRequired}
                         onMissingCountChange={this.handleMissingCountChange}
                         onErrorCountChange={this.handleErrorCountChange}
                         onSubmit={this.handleSubmit}/>
        );
    },

    render: function() {
        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <h3>Contact form with error counts</h3>
                        <div style={{marginBottom: 20}}>{description}</div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-9">
                        {this.renderContactForm()}
                    </div>
                    <div className="col-md-3">
                        <FormErrors showRequired={this.state.showRequired}
                                    missingCount={this.state.missingCount}
                                    numErrors={this.state.errorCount} />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-9">
                        <div>
                            <hr />
                            <button className="btn btn-default" type="submit" disabled={!this.canSubmit()} onClick={this.handleSubmit}>Submit</button>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-9">
                        {this.renderAlert()}
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12">
                        <div style={{borderTopStyle: "solid",
                                    borderTopColor: "rgb(244, 244, 244)",
                                    paddingTop: 5,
                                    marginTop: 20}}>
                            <Markdown text={text}/>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
});

module.exports = FormExample;
/** @jsx React.DOM */

"use strict";

var React = require("react");

var {FormMixin, TextEditGroup} = require("../../entry");

/**
 * Edit a contact
 */
var ContactEditor = React.createClass({

    mixins: [FormMixin], // Add missing value and error reporting

    displayName: "ContactEditor",

    getInitialState: function() {
        return {
            "formValues": {"first_name": {initialValue: "Bob", value: "Bob"},
                           "last_name": {initialValue: "Smith", value: "Smith"},
                           "email": {initialValue: "bob@gmail.com", "value": "bob@gmail.com"}},
            "formAttrs": {"first_name": {"name": "First name", "placeholder": "Enter first name"},
                          "last_name": {"name": "Last name", "placeholder": "Enter last name"},
                          "email": {"name": "Email", "placeholder": "Enter email address"}},
            "formRules": {"first_name": {"required": true,  "validation": {type: "string"}},
                          "last_name": {"required": true,  "validation": {type: "string"}},
                          "email": {"required": false, "validation": { "format": "email"}}},
        };
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

        //Save form here!
        console.log("Submit!");

        return false;
    },

    render: function() {
        var errorCount = this.errorCount();
        var missingCount = this.missingCount();
        var canSubmit = (errorCount === 0);

        return (
            <form style={{background: "#FAFAFA", padding: 10, borderRadius:5}} noValidate
                  className="form-horizontal" onSubmit={this.handleSubmit}>
                <TextEditGroup attr={this.getAttr("first_name")} width={300} />
                <TextEditGroup attr={this.getAttr("last_name")} width={300} />
                <TextEditGroup attr={this.getAttr("email")} width={300} />
                <input className="btn btn-default" type="submit" value="Submit" disabled={!canSubmit}/>
            </form>
        );
    }
});

var FormExample = React.createClass({

    getInitialState: function() {
        return {
            choices: {1: "Yes", 2: "No", 3: "Maybe"},
            selection: 1,
        };
    },

    handleChange: function(attr, value) {
        this.setState({"selection": value});
    },

    handleMissingCountChange: function(attr, count) {
        this.setState({"missingCount": count});
    },

    render: function() {
        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <h3>Contact form</h3>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12">
                        <ContactEditor />
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = FormExample;
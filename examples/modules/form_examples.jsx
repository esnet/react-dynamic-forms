/** @jsx React.DOM */

"use strict";

var React = require("react");
var _     = require("underscore");

var {FormMixin, TextEditGroup} = require("../../entry");

class SchemaClass {
    constructor(properties, children) {
        this.properties = properties;
        this.children = children;
    }

    toObject() {
        return this.properties;
    }

    //Return a list of formAttrs
    attrs() {
        var formAttrs = {};
        _.each(this.children, function(attr) {
            formAttrs[attr.properties.name] = attr.properties;
        });
        return formAttrs;
    }

    rules() {
        var formRules = {};
        _.each(this.children, function(attr) {
            var required = attr.properties.required || false;
            var validation = attr.properties.validation;
            formRules[attr.properties.name] = {"required": required, "validation": validation};
        });
        return formRules;        
    }
}

class AttrClass {
    constructor(properties) {
        this.properties = properties;
    }

    toObject() {
        return this.properties;
    }
}

function Schema(properties, ...children) {
    console.log("Schema properies:", properties, "Children:", children);
    return new SchemaClass(properties, children);
}

function Attr(properties) {
    return new AttrClass(properties);
}

/**
 * Edit a contact
 */
var ContactEditor = React.createClass({

    mixins: [FormMixin], // Add missing value and error reporting

    displayName: "ContactEditor",

    getInitialState: function() {

        var contactSchema = (
            <Schema name="bob">
                <Attr name="first_name" label="First name" placeholder="Enter first name" required={true} validation={{"type": "string"}}/>
                <Attr name="last_name" label="Last name" placeholder="Enter last name" required={true} validation={{"type": "string"}}/>           
                <Attr name="email" label="Email" placeholder="Enter valid email address" validation={{"format": "email"}}/>
            </Schema>
        );

        var contactValues = {
            "first_name": "Bob",
            "last_name": "Smith",
            "email": "bob@gmail.com"
        };

        return {
            formSchema: contactSchema,
            formValues: contactValues
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

        //Save form here!
        console.log("Submit!", this.values());

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
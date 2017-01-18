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
import Markdown from "react-markdown";
import { Alert } from "react-bootstrap";
import Form from "../../src/form";
import FormMixin from "../../src/formmixin";
import FormErrors from "../../src/formerrors";
import TextEditGroup from "../../src/texteditgroup";
import Schema from "../../src/schema";
import Attr from "../../src/attr";
import Highlighter from "./highlighter";

const text = require("raw!../markdown/errors_examples.md");
const description = "This shows a simple form where we track form validation errors and incomplete fields";

const schema = (
    <Schema>
        <Attr name="first_name" label="First name" placeholder="Enter first name" required={true} validation={{type: "string"}}/>
        <Attr name="last_name" label="Last name" placeholder="Enter last name" required={true} validation={{type: "string"}}/>
        <Attr name="email" label="Email" placeholder="Enter valid email address" validation={{format: "email"}}/>
    </Schema>
);

const values = {
    first_name: "",
    last_name: "",
    email: ""
};

/**
 * Edit a contact
 */
const ContactForm = React.createClass({

    mixins: [FormMixin],

    displayName: "ContactForm",

    renderForm() {
        const style = {
            background: "#FAFAFA",
            padding: 10,
            borderRadius: 5
        };
        return (
            <Form style={style}>
                <TextEditGroup attr="first_name" width={300} />
                <TextEditGroup attr="last_name" width={300} />
                <TextEditGroup attr="email" width={500} />
            </Form>
        );
    }
});

export default React.createClass({

    mixins: [Highlighter],

    getInitialState() {
        return {
            data: null,
            showRequired: false,
            missingCount: 0,
            errorCount: 0
        };
    },

    handleAlertDismiss() {
        this.setState({data: undefined});
    },

    handleMissingCountChange(attr, count) {
        this.setState({missingCount: count});
    },

    handleErrorCountChange(attr, count) {
        this.setState({errorCount: count});
    },

    //
    // Submit and related functions
    //

    formValues() {
        if (this.refs.form) {
            return this.refs.form.getValues();
        } else {
            return {};
        }
    },

    hasMissing() {
        return this.state.missingCount > 0;
    },

    canSubmit() {
        return this.state.errorCount === 0;
    },

    showRequired(b) {
        const on = b || true;
        this.setState({showRequired: on});
    },

    handleSubmit() {
        const values = this.formValues();
        if (this.hasMissing()) {
            this.showRequired();
            return;
        }
        this.setState({data: values});
    },

    //
    // Render functions
    //

    renderAlert() {
        if (this.state && this.state.data) {
            const firstName = this.state.data["first_name"];
            const lastName = this.state.data["last_name"];
            return (
                <Alert bsStyle="success" onDismiss={this.handleAlertDismiss} style={{margin: 5}}>
                    <strong>Success!</strong> {firstName} {lastName} was submitted.
                </Alert>
            );
        } else {
            return null;
        }
    },

    renderContactForm() {
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

    render() {
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
                            <Markdown source={text}/>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
});

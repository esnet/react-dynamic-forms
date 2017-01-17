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
import {Alert} from "react-bootstrap";
import Form from "../../src/form";
import FormMixin from "../../src/formmixin";
import TextEditGroup from "../../src/texteditgroup";
import DateEditGroup from "../../src/dateeditgroup";
import Schema from "../../src/schema";
import Attr from "../../src/attr";
import ChooserGroup from "../../src/choosergroup";
import Highlighter from "./highlighter";

const description = "This shows a form where the fields can be edited inline.";

const birthday = new Date("1964-08-22");

const schema = (
    <Schema>
        <Attr name="type" label="Type" placeholder="Enter contact type" required={true}/>
        <Attr name="first_name" label="First name" placeholder="Enter first name" required={true} validation={{type: "string"}}/>
        <Attr name="last_name" label="Last name" placeholder="Enter last name" required={true} validation={{type: "string"}}/>
        <Attr name="email" label="Email" placeholder="Enter valid email address" validation={{format: "email"}}/>
        <Attr name="birthdate" label="Birthdate"  required={true} />
    </Schema>
);

const values = {
    type: 0,
    first_name: "Bill",
    last_name: "Jones",
    email: "bill@gmail.com",
    birthdate: birthday
};

/**
 * Edit a contact
 */
const ContactForm = React.createClass({

    mixins: [FormMixin],

    displayName: "ContactForm",

    /**
     * Save the form
     */
    handleSubmit(e) {
        e.preventDefault();

        //Example of checking if the form has missing values and turning required On
        if (this.hasMissing()) {
            this.showRequiredOn();
            return;
        }

        // Example of fetching current and initial values
        // console.log("initial email:", this.initialValue("email"), "final email:", this.value("email"));

        this.props.onSubmit && this.props.onSubmit(this.getValues());

        return false;
    },

    renderForm() {
        const disableSubmit = this.hasErrors();
        const style = {
            background: "#FAFAFA",
            padding: 10,
            borderRadius: 5
        };
        const types = [
            {id: 0, label: "Friend"},
            {id: 1, label: "Acquaintance"}
        ];
        return (
            <Form style={style}>
                <ChooserGroup
                    inline={true}
                    attr="type" width={150}
                    initialChoice={0}
                    initialChoiceList={types}
                    disableSearch={true}/>
                <TextEditGroup attr="first_name" width={300} inline={true}/>
                <TextEditGroup attr="last_name" width={300} />
                <TextEditGroup attr="email" width="100%"/>
                <DateEditGroup attr="birthdate" />
                <hr />
                <input className="btn btn-default" type="submit" value="Submit" disabled={disableSubmit}/>
            </Form>
        );
    }
});

export default React.createClass({

    mixins: [Highlighter],

    getInitialState() {
        return {
            data:  undefined,
            loaded: false
        };
    },

    componentDidMount() {
        //Simulate ASYNC state update (not required)
        setTimeout(() => {
            this.setState({
                loaded: true
            });
        }, 0);
    },

    handleChange(a, b) {
        console.log("Form changed", a, b);
    },

    handleSubmit(value) {
        this.setState({data: value});
    },

    handleAlertDismiss() {
        this.setState({data: undefined});
    },

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
        if (this.state.loaded) {
            return (
                <ContactForm
                    attr="contact"
                    schema={schema}
                    values={values}
                    onSubmit={this.handleSubmit}
                    onChange={this.handleChange} />
            );
        } else {
            return (
                <div style={{marginTop: 50}}><b>Loading...</b></div>
            );
        }
    },

    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <h3>Inline forms</h3>
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

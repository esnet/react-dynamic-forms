/**
 *  Copyright (c) 2015-2017, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import React from "react";
import { Alert } from "react-bootstrap";
import Immutable from "immutable";

import {
    Form,
    Schema,
    Field,
    Chooser,
    TextEdit,
    formGroup,
    formList,
    FormEditStates
} from "react-dynamic-forms";

import list_docs from "./list_docs.md";
import list_thumbnail from "./list_thumbnail.png";

const description = `
This shows an example form with a list of emails that can be added or removed.
`;

/**
 * Renders a form for entering an email address
 */
class EmailForm extends React.Component {
    static defaultValues = Immutable.Map({ email_type: 1, email: "" });

    static header = {
        Email: 250,
        Type: 250
    };

    static actionButtonIndex = 62;

    static schema = (
        <Schema>
            <Field
                name="email"
                defaultValue=""
                label="Email"
                required={true}
                validation={{ format: "email" }}
            />
            <Field name="email_type" defaultValue={1} label="Type" required={true} />
        </Schema>
    );

    emailTypes() {
        return Immutable.fromJS([{ id: 1, label: "Work" }, { id: 2, label: "Home" }]);
    }

    emailTypeLabel() {
        let result;
        this.emailTypes().forEach(obj => {
            if (obj.id === this.props.value.get("email_type")) {
                result = obj.label;
            }
        });
        return result;
    }

    render() {
        const {
            value = EmailForm.defaultValues,
            initialValue = EmailForm.defaultValues
        } = this.props;

        // these supplied callbacks need to be added to the Form below, so that changes to the
        // state within this sub-form are fed up to the main form and user code
        const callbacks = {
            onChange: this.props.onChange,
            onMissingCountChange: this.props.onMissingCountChange,
            onErrorCountChange: this.props.onErrorCountChange
        };

        if (this.props.edit) {
            return (
                <Form
                    name={this.props.name}
                    schema={EmailForm.schema}
                    value={value}
                    initialValue={initialValue}
                    edit={FormEditStates.ALWAYS}
                    labelWidth={50}
                    {...callbacks}
                >
                    <Chooser
                        field="email_type"
                        choiceList={this.emailTypes()}
                        disableSearch={true}
                        width={150}
                    />
                    <TextEdit field="email" width={300} />
                </Form>
            );
        } else {
            return (
                <Form
                    name={this.props.name}
                    schema={EmailForm.schema}
                    value={value}
                    intialValue={initialValue}
                    edit={FormEditStates.TABLE}
                    labelWidth={50}
                    {...callbacks}
                >
                    <TextEdit field="email" width={250} />
                    <Chooser
                        field="email_type"
                        choiceList={this.emailTypes()}
                        disableSearch={true}
                        width={250}
                    />
                </Form>
            );
        }
    }
}

const EmailList = formList(EmailForm);
const Emails = formGroup(EmailList);

/**
 * Edit a contact
 */
class ContactForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editMode: FormEditStates.ALWAYS,
            hasMissing: false,
            hasErrors: false
        };
    }
    schema() {
        return (
            <Schema>
                <Field
                    name="first_name"
                    label="First name"
                    placeholder="Enter first name"
                    required={true}
                    validation={{ type: "string" }}
                />
                <Field
                    name="last_name"
                    label="Last name"
                    placeholder="Enter last name"
                    required={true}
                    validation={{ type: "string" }}
                />
                <Field name="emails" label="Emails" />
            </Schema>
        );
    }

    handleMissingCountChange(form, missingCount) {
        this.setState({ hasMissing: missingCount > 0 });
        if (this.props.onMissingCountChange) {
            this.props.onMissingCountChange(form, missingCount);
        }
    }

    handleErrorCountChange(form, errorCount) {
        this.setState({ hasErrors: errorCount > 0 });
        if (this.props.onErrorCountChange) {
            this.props.onErrorCountChange(form, errorCount);
        }
    }

    handleChange(form, value) {
        if (this.props.onChange) {
            this.props.onChange(form, value);
        }
    }

    handleSubmit() {
        this.setState({
            editMode: FormEditStates.SELECTED
        });
    }

    renderSubmit() {
        let submit;
        if (this.state.editMode === FormEditStates.ALWAYS) {
            let disableSubmit = true;
            let helperText = "";
            if (this.state.hasErrors === false && this.state.hasMissing === false) {
                disableSubmit = false;
            } else {
                helperText =
                    this.state.hasErrors === true
                        ? "* Unable to save because while form has errors"
                        : "* Unable to save because the form has some missing required fields";
            }
            submit = (
                <div>
                    <span>
                        <button
                            type="submit"
                            className="btn btn-default"
                            disabled={disableSubmit}
                            onClick={() => this.handleSubmit()}
                        >
                            Save contact
                        </button>
                    </span>
                    <span
                        style={{
                            fontSize: 12,
                            paddingLeft: 10,
                            color: "orange"
                        }}
                    >
                        {helperText}
                    </span>
                </div>
            );
        } else {
            submit = <div>* Make changes to the form by clicking the pencil icons</div>;
        }
        return submit;
    }

    render() {
        const style = { background: "#FAFAFA", padding: 10, borderRadius: 5 };
        const { value, initialValue } = this.props;
        const emails = value.get("emails");

        return (
            <div className="col-md-8">
                <Form
                    name="contact"
                    field="contact-form"
                    style={style}
                    schema={this.schema()}
                    value={value}
                    initialValue={initialValue}
                    edit={this.state.editMode}
                    labelWidth={100}
                    onSubmit={() => this.handleSubmit()}
                    onChange={(fieldName, value) => this.handleChange(fieldName, value)}
                    onMissingCountChange={(form, missing) =>
                        this.handleMissingCountChange(form, missing)
                    }
                    onErrorCountChange={(form, errors) => this.handleErrorCountChange(form, errors)}
                >
                    <TextEdit field="first_name" width={300} />
                    <TextEdit field="last_name" width={300} />
                    <Emails field="emails" value={emails} />
                    <hr />
                </Form>
                <div className="row">
                    <div className="col-md-3" />
                    <div className="col-md-9">{this.renderSubmit()}</div>
                </div>
            </div>
        );
    }
}

const savedValues = new Immutable.fromJS({
    first_name: "Bill",
    last_name: "Jones",
    emails: [
        { email: "b.jones@work.com", email_type: 1 },
        { email: "bill@gmail.com", email_type: 2 }
    ]
});

class list extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            value: Immutable.Map(), // value will update as the user interacts with the form
            initialValue: Immutable.Map() // initialValue will only update when the user saves the form
        };
        this.handleAlertDismiss = this.handleAlertDismiss.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleErrorCountChange = this.handleErrorCountChange.bind(this);
        this.handleMissingCountChange = this.handleMissingCountChange.bind(this);
    }

    componentDidMount() {
        // Simulate ASYNC state update
        setTimeout(() => {
            this.setState({
                loaded: true,
                value: savedValues,
                initialValue: savedValues
            });
        }, 0);
    }

    handleChange(form, value) {
        this.setState({ value });
    }

    handleMissingCountChange(form, missing) {
        this.setState({ hasMissing: missing > 0 });
    }

    handleErrorCountChange(form, errors) {
        this.setState({ hasErrors: errors > 0 });
    }

    handleAlertDismiss() {
        this.setState({ data: undefined });
    }

    renderAlert() {
        if (this.state && this.state.data) {
            const firstName = this.state.data["first_name"];
            const lastName = this.state.data["last_name"];
            const emailList = this.state.data["emails"];
            return (
                <Alert bsStyle="success" onDismiss={this.handleAlertDismiss} style={{ margin: 5 }}>
                    <strong>Success!</strong>
                    {firstName}
                    {lastName} was submitted with {emailList.length}
                    email(s).
                </Alert>
            );
        } else {
            return null;
        }
    }

    renderContactForm() {
        if (this.state.loaded) {
            return (
                <ContactForm
                    value={this.state.value}
                    initialValue={this.state.initialValue}
                    onChange={this.handleChange}
                    onMissingCountChange={this.handleMissingCountChange}
                    onErrorCountChange={this.handleErrorCountChange}
                />
            );
        } else {
            return (
                <div style={{ marginTop: 50, marginBottom: 100 }}>
                    <b>Loading saved data...</b>
                </div>
            );
        }
    }

    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <h3>List example</h3>
                        <div style={{ marginBottom: 20 }}>{description}</div>
                    </div>
                </div>
                <hr />
                <div className="row">
                    <div className="col-md-12">{this.renderContactForm()}</div>
                    {/* <div className="col-md-4">
                        <b>STATE:</b>
                        <pre style={{ borderLeftColor: "steelblue" }}>
                            value = {JSON.stringify(this.state.value.toJSON(), null, 3)}
                        </pre>
                        <pre style={{ borderLeftColor: "#b94a48" }}>
                            {`hasErrors: ${this.state.hasErrors}`}
                        </pre>
                        <pre style={{ borderLeftColor: "orange" }}>
                            {`hasMissing: ${this.state.hasMissing}`}
                        </pre>
                    </div> */}
                </div>
                <div className="row">
                    <div className="col-md-9">{this.renderAlert()}</div>
                </div>
            </div>
        );
    }
}

export default { list, list_docs, list_thumbnail };

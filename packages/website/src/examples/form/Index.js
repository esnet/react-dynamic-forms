/**
 *  Copyright (c) 2017, The Regents of the University of California,
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
import Immutable from "immutable";
import Chance from "chance";
import {
    Form, 
    Schema, 
    Field, 
    TextEdit, 
    TextArea, 
    DateEdit, 
    Chooser, 
    TagsEdit, 
    CheckBoxes, 
    RadioButtons, 
    View, 
    FormEditStates 
} from "react-dynamic-forms";

import form_docs from "./form_docs.md";
import form_thumbnail from "./form_thumbnail.png";

const description = `
This shows a simple form where the schema and values of the form are loaded
at some future time, such as if they were read from a REST API.
`;

const schema = (
    <Schema>
        <Field name="type" label="Type" placeholder="Enter contact type" required={true} />
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
        <Field
            name="email"
            label="Email"
            placeholder="Enter valid email address"
            required={true}
            validation={{ format: "email" }}
        />
        <Field name="languages" label="Languages" />
        <Field name="options" label="Email preferences" />
        <Field name="birthdate" label="Birthdate" required={true} />
        <Field name="tags" label="Categories" required={true} />
        <Field name="city" label="City" />
        <Field name="notes" label="Notes" />
    </Schema>
);

const availableTypes = Immutable.fromJS([
    { id: 0, label: "Friend" },
    { id: 1, label: "Acquaintance" }
]);

const availableEmailOptions = Immutable.fromJS([
    { id: 0, label: "Never" },
    { id: 1, label: "As items arrive" },
    { id: 2, label: "Daily summary" }
]);

const availableLanguages = Immutable.fromJS(["English", "French", "Spanish", "Japanese"]);

const birthday = new Date("1975-05-15");

const initialValue = {
    type: 0,
    first_name: "Bill",
    last_name: "Jones",
    email: "bill@gmail.com",
    birthdate: birthday,
    languages: ["English", "Spanish"],
    options: 1,
    tags: ["stanford"],
    city: "Berkeley",
    notes: `Here are some notes....`
};

const tagList = Immutable.fromJS([
    "ucberkeley",
    "esnet",
    "stanford",
    "doe",
    "industry",
    "government"
]);

class form extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: Immutable.fromJS(initialValue),
            tagList: Immutable.fromJS(tagList),
            loaded: false,
            editMode: FormEditStates.ALWAYS            
        };
        this.handleAlertDismiss = this.handleAlertDismiss.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleErrorCountChange = this.handleErrorCountChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        //Simulate ASYNC state update (not required)
        setTimeout(
            () => {
                this.setState({ loaded: true });
            },
            0
        );
    }

    handleChange(formName, value) {
        this.setState({ value });
    }

    handleErrorCountChange(field, errors) {
        //console.log("Errors:", errors > 0);
    }

    handleSubmit(e) {
        // console.log("handleSubmit");
        this.setState({
            editMode: FormEditStates.SELECTED
        });
    }

    handleAlertDismiss() {
        this.setState({ data: undefined });
    }

    random() {
        const chance = new Chance();
        const randomValue = {
            type: chance.integer({ min: 0, max: 1 }),
            first_name: chance.first(),
            last_name: chance.last(),
            email: chance.email(),
            birthdate: chance.birthday(),
            languages: chance.pickset(
                ["English", "French", "Spanish", "Japanese"],
                chance.integer({ min: 0, max: 4 })
            ),
            options: chance.integer({ min: 0, max: 2 }),
            tags: chance.pickset(
                ["ucberkeley", "esnet", "stanford", "doe", "industry", "government"],
                chance.integer({ min: 0, max: 3 })
            ),
            city: chance.city()
        };

        this.setState({ value: new Immutable.fromJS(randomValue) });
    }

    renderAlert() {
        if (this.state && this.state.data) {
            const firstName = this.state.data["first_name"];
            const lastName = this.state.data["last_name"];
            return (
                <Alert bsStyle="success" onDismiss={this.handleAlertDismiss} style={{ margin: 5 }}>
                    <strong>Success! </strong>
                    <span>{`${firstName} ${lastName} was submitted.`}</span>
                </Alert>
            );
        } else {
            return null;
        }
    }

    renderContactForm() {
        //const disableSubmit = false;
        //this.hasErrors();
        const style = { background: "#FAFAFA", padding: 10, borderRadius: 5 };

        let submit;
        if (this.state.editMode === FormEditStates.ALWAYS) {
            let disableSubmit = true;
            if (this.state.hasErrors === false && this.state.hasMissing === false) {
                disableSubmit = false;
            }
            // console.log("Render submit button, disabled=", disableSubmit);
            submit = (
                <button
                    type="submit"
                    className="btn btn-default"
                    disabled={disableSubmit}
                    onClick={() => this.handleSubmit()}
                >
                    Submit contact
                </button>
            );
        } else {
            submit = <div>* Make changes to the form by clicking the pencil icons</div>;
        }

        // console.log("Render form");

        if (this.state.loaded) {
            return (
                <Form
                    name="basic"
                    style={style}
                    schema={schema}
                    value={this.state.value}
                    edit={this.state.editMode}
                    labelWidth={200}
                    onSubmit={this.handleSubmit}
                    onChange={this.handleChange}
                    onMissingCountChange={(fieldName, missing) =>
                        this.setState({ hasMissing: missing > 0 })}
                    onErrorCountChange={(fieldName, errors) =>
                        this.setState({ hasErrors: errors > 0 })}
                >
                    <Chooser
                        field="type"
                        width={150}
                        choiceList={availableTypes}
                        disableSearch={true}
                    />
                    <TextEdit field="first_name" width={300} />
                    <TextEdit field="last_name" width={300} />
                    <TextEdit
                        field="email"
                        width={400}
                        view={value => {
                            return (
                                <a>
                                    {value}
                                </a>
                            );
                        }}
                    />
                    <DateEdit field="birthdate" width={100} />
                    <CheckBoxes field="languages" optionList={availableLanguages} />
                    <RadioButtons field="options" optionList={availableEmailOptions} />
                    <TagsEdit
                        field="tags"
                        tagList={this.state.tagList}
                        onTagListChange={(name, tagList) => this.setState({ tagList })}
                        width={400}
                    />
                    <TextArea
                        field="notes"
                        width={400}
                        view={value => {
                            return <Markdown source={value} />;
                        }}
                    />
                    <View
                        field="city"
                        width={400}
                        view={value => {
                            return (
                                <b>
                                    {value}
                                </b>
                            );
                        }}
                    />
                    <hr />
                    <div className="row">
                        <div className="col-md-3" />
                        <div className="col-md-9">
                            {submit}
                        </div>
                    </div>
                </Form>
            );
        } else {
            return <div style={{ marginTop: 50 }}><b>Loading...</b></div>;
        }
    }

    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <h3>Basic form</h3>
                        <div style={{ marginBottom: 20 }}>{description}</div>
                    </div>
                </div>
                <hr />
                <div className="row">
                    <div className="col-md-8">
                        {this.renderContactForm()}
                    </div>
                    <div className="col-md-4">
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
                        <button className="btn btn-default btn-sm" onClick={() => this.random()}>
                            Random
                        </button>
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
};

export default { form, form_docs, form_thumbnail };
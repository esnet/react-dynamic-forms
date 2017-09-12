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
import Markdown from "react-markdown";
import { Alert } from "react-bootstrap";
import Immutable from "immutable";
import Highlighter from "../Highlighter";

import Form from "../../forms/components/Form";
import Schema from "../../forms/components/Schema";
import Field from "../../forms/components/Field";

import Chooser from "../../forms/components/Chooser";
import TextEdit from "../../forms/components/TextEdit";

import formGroup from "../../forms/formGroup";
import formList from "../../forms/formList";

import { FormEditStates } from "../../forms/constants";
import _ from "underscore";

const text = `
### Schema example
`;

const description = `
This shows an example form with a schema generated dynamically from a list of choices with
different validation requirements
`;

/**
 * Renders a form for entering an email address
 */

function limitedHstoreChooserList(currentChoice, attributes, usedAttributes) {
    const usedAttrs = [];
    _.each(usedAttributes, attr => {
        usedAttrs.push(attr.key);
    });
    const newChooserList = [];

    _.each(attributes, attr => {
        if (!_.contains(usedAttrs, attr.keyname)) {
            newChooserList.push(attr);
        }
    });
    //console.log(currentChoice, attributes, usedAttributes)

    const existingValue = _.findWhere(attributes, { keyname: currentChoice });
    if (existingValue) {
        newChooserList.push(existingValue);
    }

    const chooser = Immutable.fromJS(
        _.map(newChooserList, attr => {
            return {
                id: attr.keyname,
                label: attr.keyname
            };
        })
    );
    return chooser;
}

class HstoreForm extends React.Component {
    static defaultValues = { key: "", value: "" };

    buildSchema(value) {
        const keyObject = _.findWhere(this.props.types, { keyname: value.get("key") });
        let dataType = "";
        let description = "";
        if (keyObject) {
            dataType = keyObject.datatype;
            description = keyObject.description;
        }
        let validation = null;

        switch (dataType) {
            case "string":
                validation = {
                    type: "string"
                };
                break;
            case "integer":
                validation = {
                    type: "number"
                };
                break;
            case "url":
                validation = {
                    type: "string",
                    format: "url"
                };
                break;
            default:
                break;
        }

        return (
            <Schema>
                <Field name="key" label="Key Name" required={true} />
                <Field
                    name="value"
                    label="Value"
                    required={true}
                    placeholder={description}
                    validation={validation}
                />
            </Schema>
        );
    }

    render() {
        const {
            onChange,
            onMissingCountChange,
            onErrorCountChange,
            types, // Available HstoreAttributes brought in as an Array
            options, // Immutable list of maps of existing Choices brought in with [{key: "" value: ""}]
            value = HstoreForm.defaultValues
        } = this.props;
        const callbacks = { onChange, onMissingCountChange, onErrorCountChange };

        const choiceList = limitedHstoreChooserList(value.get("key"), types, options.toJS());
        const schema = this.buildSchema(value);

        if (this.props.edit) {
            return (
                <Form
                    name={this.props.name}
                    schema={schema}
                    value={value}
                    edit={FormEditStates.ALWAYS}
                    labelWidth={150}
                    {...callbacks}
                >
                    <Chooser field="key" choiceList={choiceList} width={350} disableSearch={true} />
                    <TextEdit field="value" width={350} />
                </Form>
            );
        } else {
            const a = value.get("key");
            const attr = _.findWhere(types, { keyname: a });
            const datatype = attr ? attr.datatype : "";
            const val = value.get("value");
            let display = <TextEdit field="value" width={300} />;
            if (datatype === "url") {
                display = (
                    <div>
                        <a href={val}>{val}</a>
                    </div>
                );
            }
            return (
                <Form
                    name={this.props.name}
                    schema={schema}
                    value={value}
                    edit={FormEditStates.TABLE}
                    labelWidth={150}
                    {...callbacks}
                >
                    <Chooser field="key" choiceList={choiceList} width={100} disableSearch={true} />
                    {display}
                </Form>
            );
        }
    }
}

const HstoreEditor = formGroup(formList(HstoreForm));

/**
 * Edit a Location
 */
const LocationForm = React.createClass({
    displayName: "LocationForm",
    schema() {
        return (
            <Schema>
                <Field
                    name="location"
                    label="Location"
                    placeholder="Enter Location Name"
                    required={true}
                    validation={{ type: "string" }}
                />
                <Field name="details" label="Details" />
            </Schema>
        );
    },
    // Save the form
    handleSubmit(e) {
        e.preventDefault();
        if (this.hasMissing()) {
            this.showRequiredOn();
            return;
        }
        if (this.props.onSubmit) {
            this.props.onSubmit(this.getValues());
        }
    },
    handleMissingCountChange(form, missingCount) {
        if (this.props.onMissingCountChange) {
            this.props.onMissingCountChange(form, missingCount);
        }
    },
    handleErrorCountChange(form, errorCount) {
        if (this.props.onErrorCountChange) {
            this.props.onErrorCountChange(form, errorCount);
        }
    },
    handleChange(form, value) {
        if (this.props.onChange) {
            this.props.onChange(form, value);
        }
    },
    render() {
        const disableSubmit = false;
        const style = { background: "#FAFAFA", padding: 10, borderRadius: 5 };
        const { value } = this.props;
        const details = value.get("details");

        return (
            <Form
                field="location-form"
                style={style}
                schema={this.schema()}
                value={value}
                edit={FormEditStates.SELECTED}
                labelWidth={100}
                onSubmit={() => this.handleSubmit()}
                onChange={(fieldName, value) => this.handleChange(fieldName, value)}
                onMissingCountChange={(form, missing) =>
                    this.handleMissingCountChange(form, missing)}
                onErrorCountChange={(form, errors) => this.handleErrorCountChange(form, errors)}
            >
                <TextEdit field="location" width={300} />
                <HstoreEditor
                    field="details"
                    value={details}
                    options={details}
                    types={this.props.detailsAttributes}
                />
                <hr />
                <input
                    className="btn btn-default"
                    type="submit"
                    value="Submit"
                    disabled={disableSubmit}
                />
            </Form>
        );
    }
});

const detailsAttributes = [
    {
        keyname: "Website",
        description: "A favorite website for this location",
        datatype: "url"
    },
    {
        keyname: "Address",
        description: "Street Address for this location",
        datatype: "string"
    },
    {
        keyname: "Residents",
        description: "The total number of residents",
        datatype: "integer"
    },
    {
        keyname: "Other Name",
        description: "Another name for this Location",
        datatype: "string"
    },
    {
        keyname: "Total Pets",
        description: "The number of pets at this location",
        datatype: "integer"
    }
];

export default React.createClass({
    mixins: [Highlighter],

    getInitialState() {
        const loaded = false;
        const value = new Immutable.fromJS({
            location: "Office",
            details: [
                { key: "Website", value: "https://home.com" },
                { key: "Address", value: "123 Anystreet" }
            ]
        });
        return { value, loaded };
    },
    componentDidMount() {
        // Simulate ASYNC state update
        setTimeout(
            () => {
                this.setState({ loaded: true });
            },
            0
        );
    },
    handleSubmit(value) {
        this.setState({ data: value });
    },
    handleChange(form, value) {
        this.setState({ value });
    },
    handleMissingCountChange(form, missing) {
        this.setState({ hasMissing: missing > 0 });
    },
    handleErrorCountChange(form, errors) {
        this.setState({ hasErrors: errors > 0 });
    },
    handleAlertDismiss() {
        this.setState({ data: undefined });
    },
    renderAlert() {
        if (this.state && this.state.data) {
            const location = this.state.data["location"];
            const details = this.state.data["details"];
            return (
                <Alert bsStyle="success" onDismiss={this.handleAlertDismiss} style={{ margin: 5 }}>
                    <strong>Success!</strong>
                    {location}} was submitted with {details.length}.
                </Alert>
            );
        } else {
            return null;
        }
    },
    renderLocationForm() {
        if (this.state.loaded) {
            return (
                <LocationForm
                    value={this.state.value}
                    detailsAttributes={detailsAttributes}
                    onChange={this.handleChange}
                    onMissingCountChange={this.handleMissingCountChange}
                    onErrorCountChange={this.handleErrorCountChange}
                    onSubmit={this.handleSubmit}
                />
            );
        } else {
            return (
                <div style={{ marginTop: 50 }}>
                    <b>Loading...</b>
                </div>
            );
        }
    },
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
                    <div className="col-md-8">{this.renderLocationForm()}</div>
                    <div className="col-md-4">
                        <b>STATE:</b>
                        <pre style={{ borderLeftColor: "steelblue" }}>
                            value = {JSON.stringify(this.state.value, null, 3)}
                        </pre>
                        <pre style={{ borderLeftColor: "#b94a48" }}>
                            {`hasErrors: ${this.state.hasErrors}`}
                        </pre>
                        <pre style={{ borderLeftColor: "orange" }}>
                            {`hasMissing: ${this.state.hasMissing}`}
                        </pre>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-9">{this.renderAlert()}</div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div
                            style={{
                                borderTopStyle: "solid",
                                borderTopColor: "rgb(244, 244, 244)",
                                paddingTop: 5,
                                marginTop: 20
                            }}
                        >
                            <Markdown source={text} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

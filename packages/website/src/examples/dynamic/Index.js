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
import { Alert } from "react-bootstrap";
import * as Immutable from "immutable";
import {
    Form,
    Schema,
    Field,
    TextEdit,
    TextArea,
    Chooser,
    FormEditStates
} from "react-dynamic-forms";

import dynamic_docs from "./dynamic_docs.md";
import dynamic_thumbnail from "./dynamic_thumbnail.png";

const description = `This shows a more complicated form where there's
conditional fields and pre-filling.  To use, either select from the top
pulldown to choose a preset, or play with the form. The type will control
which fields below it are hidden or shown. The number of required
fields should stay correct.
`;

const schema = (
    <Schema>
        <Field name="bookmarked" label="Endpoint" tags={["all"]} required={true} />
        <Field name="name" label="Name" tags={["all"]} required={true} />
        <Field name="description" label="Description" tags={["all"]} required={true} />
        <Field name="type" label="Type" tags={["all"]} required={true} />
        <Field name="device_name" label="Device name" tags={["Equipment Port"]} required={true} />
        <Field name="interface" label="Interface" tags={["Equipment Port"]} required={true} />
        <Field
            name="foreign_description"
            label="Foreign description"
            tags={["Foreign"]}
            required={true}
        />
        <Field name="organization" label="Organization" tags={["Foreign"]} required={true} />
        <Field name="panel_name" label="Panel name" tags={["Patch Panel"]} required={true} />
        <Field name="port_id" label="Port Id" tags={["Patch Panel"]} required={true} />
        <Field name="port_side" label="Port side" tags={["Patch Panel"]} required={true} />
        <Field name="port_location" label="Port location" tags={["Patch Panel"]} required={true} />
    </Schema>
);

// Database

const endpointTypes = Immutable.fromJS([
    { id: "type-id-1", label: "Patch Panel" },
    { id: "type-id-2", label: "Equipment Port" },
    { id: "type-id-3", label: "Foreign" }
]);

const bookmarked = Immutable.fromJS({
    "id-1": {
        name: "EQX-ASH-RT1:ge-0/0/2",
        description: "An equipment endpoint",
        type: "type-id-2",
        device_name: "EQX-ASH-RT1",
        interface: "ge-0/0/2"
    },
    "id-2": {
        name: "TELIANET:telianet-eqx-ash:Peer",
        description: "A foreign endpoint",
        type: "type-id-3",
        foreign_description: "",
        organization: "TeliaNet"
    },
    "id-3": {
        name: "PPx1322:1254",
        description: "A patch panel endpoint",
        type: "type-id-1",
        panel_name: "PPx1322",
        port_id: "1254",
        port_side: "BACK",
        port_location: "BOIS"
    }
});

// Initial values
const initialValues = {
    bookmarked: "id-3",
    ...bookmarked.get("id-3").toJS()
};

class dynamic extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: Immutable.fromJS(initialValues),
            visibility: "all",
            loaded: false,
            editMode: FormEditStates.ALWAYS
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        // Simulate ASYNC state update (not necessary)
        setTimeout(() => {
            this.setState({ loaded: true });
        }, 0);
    }

    handleChange(formName, value) {
        // If the bookmark changes then merge in the attr
        // values associated with that bookmark
        if (value.get("bookmarked") !== this.state.value.get("bookmarked")) {
            const endpoint = bookmarked.get(value.get("bookmarked"));
            const updatedValue = value.merge(endpoint);
            this.setState({ value: updatedValue });
        } else {
            this.setState({ value });
        }
    }

    handleErrorCountChange(attr, errors) {
        // console.log("Errors:", errors > 0);
    }

    handleSubmit(e) {
        // console.log("Submit:", this.state.value);
        this.setState({
            editMode: FormEditStates.SELECTED
        });
    }

    renderAlert() {
        if (this.state && this.state.data) {
            const firstName = this.state.data["first_name"];
            const lastName = this.state.data["last_name"];
            return (
                <Alert bsStyle="success" onDismiss={this.handleAlertDismiss} style={{ margin: 5 }}>
                    <strong>Success!</strong> {firstName} {lastName} was submitted.
                </Alert>
            );
        } else {
            return null;
        }
    }

    renderForm() {
        const { value } = this.state;
        const style = { background: "#FAFAFA", padding: 10, borderRadius: 5 };

        // Bookmark list for chooser
        const bookmarkList = bookmarked.map(
            (bookmark, id) =>
                new Immutable.Map({
                    id,
                    label: bookmark.get("name")
                })
        );

        // Visibility tag. Here we look at our endpointTypes and
        // find the one with id = the current value of "type" in our values.
        // This is the lower chooser in this example. Based on that type
        // we need to set a visibility tag to show and hide widgets based
        // on that type.
        const currentType = value.get("type");
        const object = endpointTypes.find(item => {
            return item.get("id") === currentType;
        });
        const visiblityTag = object.get("label");

        if (this.state.loaded) {
            return (
                <Form
                    name="dynamic"
                    style={style}
                    schema={schema}
                    value={value}
                    edit={this.state.editMode}
                    visible={visiblityTag}
                    onSubmit={this.handleSubmit}
                    onChange={(formName, value) => this.handleChange(formName, value)}
                    onMissingCountChange={(formName, missing) =>
                        this.setState({ hasMissing: missing > 0 })
                    }
                    onErrorCountChange={(formName, errors) =>
                        this.setState({ hasErrors: errors > 0 })
                    }
                >
                    <h5>Bookmarked endpoints</h5>
                    <Chooser
                        field="bookmarked"
                        width={300}
                        disableSearch={false}
                        choiceList={bookmarkList}
                    />
                    <hr />
                    <h5>General information</h5>
                    <TextEdit field="name" width={300} />
                    <TextArea field="description" />
                    <hr />
                    <h5>Endpoint type</h5>
                    <Chooser
                        field="type"
                        width={200}
                        disableSearch={true}
                        choiceList={endpointTypes}
                    />
                    <TextEdit field="device_name" />
                    <TextEdit field="interface" hidden={true} />
                    <TextEdit field="foreign_description" />
                    <TextEdit field="organization" />
                    <TextEdit field="panel_name" />
                    <TextEdit field="port_id" />
                    <TextEdit field="port_side" />
                    <TextEdit field="port_location" />
                    <hr />
                </Form>
            );
        } else {
            return (
                <div style={{ marginTop: 50 }}>
                    <b>Loading...</b>
                </div>
            );
        }
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
                            Save endpoint
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
        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <h3>Dynamic form</h3>
                        <div style={{ marginBottom: 20 }}>{description}</div>
                    </div>
                </div>
                <hr />
                <div className="row">
                    <div className="col-md-8">
                        {this.renderForm()}
                        <div className="row">
                            <div className="col-md-3" />
                            <div className="col-md-9">{this.renderSubmit()}</div>
                        </div>
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
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-9">{this.renderAlert()}</div>
                </div>
            </div>
        );
    }
}

export default { dynamic, dynamic_docs, dynamic_thumbnail };

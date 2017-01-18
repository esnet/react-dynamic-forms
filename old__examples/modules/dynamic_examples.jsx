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
import _ from "underscore";
import Markdown from "react-markdown";
import {Alert} from "react-bootstrap";
import Form from "../../src/form";
import FormMixin from "../../src/formmixin";
import FormErrors from "../../src/formerrors";
import TextEditGroup from "../../src/texteditgroup";
import TextAreaGroup from "../../src/textareagroup";
import ChooserGroup from "../../src/choosergroup";
import Schema from "../../src/schema";
import Attr from "../../src/attr";
import Highlighter from "./highlighter";

const text = require("raw!../markdown/dynamic_examples.md");
const description = "This shows a more complicated form where there's conditional fields and pre-filling. " +
    "To use, either select from the top pulldown to choose a preset, or play with the form. The type " +
    "will control which fields below it are hidden or shown. The number of required fields should stay correct.";

const schema = (
    <Schema>
        <Attr name="bookmarked" label=""  tags={["all"]} />
        <Attr name="name" label="Name"  tags={["all"]} required={true} />
        <Attr name="description" label="Description"  tags={["all"]} required={true} />
        <Attr name="type" label="Type"  tags={["all"]} required={true} />
        <Attr name="device_name" label="Device name"  tags={["Equipment Port"]} required={true} />
        <Attr name="interface" label="Interface" tags={["Equipment Port"]} required={true} />
        <Attr name="foreign_description" label="Foreign description" tags={["Foreign"]} required={true} />
        <Attr name="organization" label="Organization" tags={["Foreign"]} required={true} />
        <Attr name="panel_name" label="Panel name" tags={["Patch Panel"]} required={true}  />
        <Attr name="port_id" label="Port Id" tags={["Patch Panel"]} required={true} />
        <Attr name="port_side" label="Port side" tags={["Patch Panel"]} required={true} />
        <Attr name="port_location" label="Port location" tags={["Patch Panel"]} required={true} />
    </Schema>
);

// Data
const values = {
    type: 2
};
const endpointTypes = [
    {id: 1, label: "Patch Panel"},
    {id: 2, label: "Equipment Port"},
    {id: 3, label: "Foreign"}
];
const bookmarked = {
    1: {
        name: "EQX-ASH-RT1:ge-0/0/2",
        description: "An equipment endpoint",
        type: 2,
        device_name: "EQX-ASH-RT1",
        interface: "ge-0/0/2"
    },
    2: {
        name: "TELIANET:telianet-eqx-ash:Peer",
        description: "A foreign endpoint",
        type: 3,
        foreign_description: "",
        organization: "TeliaNet"
    },
    3: {
        name: "PPx1322:1254",
        description: "A patch panel endpoint",
        type: 1,
        panel_name: "PPx1322",
        port_id: "1254",
        port_side: "BACK",
        port_location: "BOIS"
    }
};

/**
 * Edit a contact
 */
const EndpointForm = React.createClass({

    mixins: [FormMixin],

    displayName: "EndpointForm",

    getInitialVisibility() {
        const currentObj = _.findWhere(endpointTypes, {
            id: this.props.values["type"]
        });
        return currentObj.label;
    },

    willHandleChange(attrName, value) {
        switch (attrName) {
            case "bookmarked":
                if (value) {
                    // bookmarked pulldown was changed so transfer existing
                    // endpoint values onto the form using setValues()
                    const endpoint = bookmarked[value];
                    this.setValues({
                        name: endpoint.name,
                        description: endpoint.description,
                        type: endpoint.type,
                        device_name: endpoint.device_name,
                        interface: endpoint.interface,
                        foreign_description: endpoint.foreign_description,
                        organization: endpoint.organization,
                        panel_name: endpoint.panel_name,
                        port_id: endpoint.port_id,
                        port_side: endpoint.port_side,
                        port_location: endpoint.port_location
                    });
                }
                break;
            case "type":
                // The endpoint type changed, which changes fields visible,
                // so set this with setVisibility() using the type as a filter.
                const obj = _.findWhere(endpointTypes, {
                    id: parseInt(value)
                });
                this.setVisibility(obj.label);
                break;
        }
    },
   
    /**
     * Save the form
     */
    handleSubmit(e) {
        e.preventDefault();

        if (this.hasMissing()) {
            this.showRequiredOn();
            return;
        }

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
        const bookmarks = _.map(bookmarked, (bookmark, id) => ({
            id,
            label: bookmark.name
        }));

        return (
            <Form style={style}>

                <h5>Bookmarked endpoints</h5>

                <ChooserGroup attr="bookmarked" width={300} disableSearch={false}
                              initialChoice={this.value("bookmarked")} initialChoiceList={bookmarks}/>

                <hr />

                <h5>General information</h5>

                <TextEditGroup attr="name" width={300} />
                <TextAreaGroup attr="description" />

                <hr />

                <h5>Endpoint type</h5>

                <ChooserGroup attr="type" width={200} disableSearch={true}
                              initialChoice={this.value("type")}
                              initialChoiceList={endpointTypes} />
                <TextEditGroup attr="device_name" />
                <TextEditGroup attr="interface" hidden={true}/>
                <TextEditGroup attr="foreign_description" />
                <TextEditGroup attr="organization" />
                <TextEditGroup attr="panel_name" />
                <TextEditGroup attr="port_id" />
                <TextEditGroup attr="port_side" />
                <TextEditGroup attr="port_location" />

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
            loaded: false,
            missingCount: 0,
            errorCount: 0
        };
    },

    componentDidMount() {
        //Simulate ASYNC state update (not necessary)
        setTimeout(() => {
            this.setState({
                loaded: true
            });
        }, 0);
    },

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

    handleAlertDismiss() {
        this.setState({data: undefined});
    },

    handleMissingCountChange(attr, count) {
        this.setState({missingCount: count});
    },

    handleErrorCountChange(attr, count) {
        this.setState({errorCount: count});
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

    renderEndpointForm() {
        if (this.state.loaded) {
            return (
                <EndpointForm ref="form"
                              attr="endpoint"
                              schema={schema}
                              values={values}
                              showRequired={this.state.showRequired}
                              onMissingCountChange={this.handleMissingCountChange}
                              onErrorCountChange={this.handleErrorCountChange}
                              onSubmit={this.handleSubmit}/>
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
                        <h3>Dynamic endpoint form</h3>
                        <div style={{marginBottom: 20}}>{description}</div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-9">
                        {this.renderEndpointForm()}
                    </div>
                    <div className="col-md-3">
                        Errors:
                        <FormErrors showRequired={this.state.showRequired}
                                    missingCount={this.state.missingCount}
                                    numErrors={this.state.errorCount} />
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

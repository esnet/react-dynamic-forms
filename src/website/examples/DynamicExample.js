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
import _ from "underscore";
import Markdown from "react-markdown";
import { Alert } from "react-bootstrap";
import Immutable from "immutable";

import Form from "../../forms/components/Form";
import Schema from "../../forms/components/Schema";
import Field from "../../forms/components/Field";
import TextEdit from "../../forms/components/TextEdit";
import TextArea from "../../forms/components/TextArea";
import Chooser from "../../forms/components/Chooser";
import { FormEditStates } from "../../forms/constants";

import Highlighter from "../Highlighter";

const description = `
This shows a more complicated form where there's
conditional fields and pre-filling.  To use, either select from the top
pulldown to choose a preset, or play with the form. The type will control
which fields below it are hidden or shown. The number of required
fields should stay correct.
`;

const text = `
### Dynamic form example

The forms library allows you to create forms that dynamically change
depending on other filled out fields. An example of this is a form which
has a type field and that field controls several other fields that only
apply to that type. In this case we want to:

 * Hide and show fields in reaction to a change in the type
 * Have hidden fields not be required, i.e. support conditional requires

#### Render

The above example begins with a pretty simple \`renderForm()\`
implementation. In fact there's not much to see here. Regardless of the
visibility that we'll control in a minute, we can just render all the
fields and the forms code will take care of selectively hiding fields
for us. Here is the main part of the renderForm() function, excluding
    a little code to get out bookmarks map for the Bookmark chooser
choice list.

    return (
        <Form style={formStyle}>
            <Chooser field="bookmarked" width={300} initialChoiceList={bookmarks}/>
                <hr />
            <TextEdit field="name" width={300} />
            <TextArea field="description" />
                <hr />
            <Chooser field="type" width={200} initialChoice={this.value("type")}
                          initialChoiceList={endpointTypes} disableSearch={true} />
            <TextEdit field="device_name" />
            <TextEdit field="interface" />
            <TextEdit field="foreign_description" />
            <TextEdit field="organization" />
            <TextEdit field="panel_name" />
            <TextEdit field="port_id" />
            <TextEdit field="port_side" />
            <TextEdit field="port_location" />
                <hr />
            <input className="btn btn-default" type="submit" value="Submit" disabled={disableSubmit}/>
        </Form>
    );


#### Tags

The forms library schema supports visibility tags, which can be used
to quickly control which set of fields show be visible and which should
not, rather than setting each one. The schema for our example looks like
this

    <Schema>
        <Field name="bookmarked" label=""  tags={["all"]} />
        <Field name="name" label="Name"  tags={["all"]} required={true} />
        <Field name="description" label="Description"  tags={["all"]} required={true} />
        <Field name="type" label="Type"  tags={["all"]} required={true} />
        <Field name="device_name" label="Device name"  tags={["Equipment Port"]} required={true} />
        <Field name="interface" label="Interface" tags={["Equipment Port"]} required={true} />
        <Field name="foreign_description" label="Foreign description" tags={["Foreign"]} required={true} />
        <Field name="organization" label="Organization" tags={["Foreign"]} required={true} />
        <Field name="panel_name" label="Panel name" tags={["Patch Panel"]} required={true}  />
        <Field name="port_id" label="Port Id" tags={["Patch Panel"]} required={true} />
        <Field name="port_side" label="Port side" tags={["Patch Panel"]} required={true} />
        <Field name="port_location" label="Port location" tags={["Patch Panel"]} required={true} />
    </Schema>

You can see that for each Field we've defined a tags prop. This is a list
of visibility tags. Here we've named our tags based on our type values
("Equipment Port", "Patch Panel" and "Foreign"). A special tag "all"
can also be added meaning that the attr will always be visible.

To turn on visibility we use the \`visibility\` prop on the \`Form\`.
This method takes as its argument the tag to match against the schema
to control the visibility of the fields. For example, if we passed in
"Equipment Port" then all the attrs with a tag of "all" would be shown,
as would those with a tag of "Equipment Port" ("device_name" and
"interface"). All others would be hidden.

## Dynamic changing the form

In this form we have a bookmark chooser. When the user selects a preset
from this chooser it will fill the form with values. The subtle thing here
is that this also sets the type chooser further down the form, which itself
controls what fields will be shown. It's this kind of behavior that the
forms code is designed to handle.

Let's think this through:

 1. The first thing that happens is that the user selects a bookmark
    from the top chooser.
 2. We know when the user changes something by handling onChange in
    handleChange(), so we can compare the previous and next version
    of the form value.
 3. If the bookmark has indeed changed then we can merge in some
    pre-baked data for that bookmark into the form value before setting
    it as our source of truth. In this way the change of a single item
    can be applied to many items.

        if (value.get("bookmarked") !== this.state.value.get("bookmarked")) {
            const bookmark = bookmarked[value.get("bookmarked")];
            const merged = value.merge(bookmark);
            this.setState({ value: merged });
        } else {
            this.setState({ value });
        }

 4. The form will then re-render and update to show the new values. However
    we need to handle the visibility state of the form. The visibility
    of the form is a function of the data in the form (at least in this case),
    meaning that if the form data is in a particular state, we only show
    certain fields. In this case when we set the "type" between three possible
    values we show different fields that only apply to that "type". Therefore,
    in our render function we get the "type" out of our form state and then
    set our visibility based on that:

    render() {

        // Current type
        const currentType = values.get("type");

        // Find the visibility tag given our current type
        const visiblityTag = getVisibilityTag(currentType);

        ...
    }

    As mentioned above, we encode the tags within the Schema, so here we are
    simply mapping between those tags and the type.

 5. Finally, to complete the dynamically updating form, we simply render
    the form but set the visibility prop to our \`visibilityTag\`.

    render() {
        ...

        return (
            <Form
                ...
                visible={visiblityTag}
                ...
            >
                ...
            </Form>
        );
    }
`;

const schema = (
    <Schema>
        <Field name="bookmarked" label="" tags={["all"]} required={true} />
        <Field name="name" label="Name" tags={["all"]} required={true} />
        <Field
            name="description"
            label="Description"
            tags={["all"]}
            required={true}
        />
        <Field name="type" label="Type" tags={["all"]} required={true} />
        <Field
            name="device_name"
            label="Device name"
            tags={["Equipment Port"]}
            required={true}
        />
        <Field
            name="interface"
            label="Interface"
            tags={["Equipment Port"]}
            required={true}
        />
        <Field
            name="foreign_description"
            label="Foreign description"
            tags={["Foreign"]}
            required={true}
        />
        <Field
            name="organization"
            label="Organization"
            tags={["Foreign"]}
            required={true}
        />
        <Field
            name="panel_name"
            label="Panel name"
            tags={["Patch Panel"]}
            required={true}
        />
        <Field
            name="port_id"
            label="Port Id"
            tags={["Patch Panel"]}
            required={true}
        />
        <Field
            name="port_side"
            label="Port side"
            tags={["Patch Panel"]}
            required={true}
        />
        <Field
            name="port_location"
            label="Port location"
            tags={["Patch Panel"]}
            required={true}
        />
    </Schema>
);

// Database

const endpointTypes = [
    { id: "type-id-1", label: "Patch Panel" },
    { id: "type-id-2", label: "Equipment Port" },
    { id: "type-id-3", label: "Foreign" }
];

const bookmarked = {
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
};

// Initial values
const initialValues = {
    bookmarked: "id-3",
    ...bookmarked["id-3"]
};

export default React.createClass({
    mixins: [Highlighter],
    getInitialState() {
        return {
            value: Immutable.fromJS(initialValues),
            visibility: "all",
            loaded: false
        };
    },
    componentDidMount() {
        //Simulate ASYNC state update (not necessary)
        setTimeout(
            () => {
                this.setState({ loaded: true });
            },
            0
        );
    },
    handleChange(formName, value) {
        // If the bookmark changes then merge in the attr
        // values associated with that bookmark
        if (value.get("bookmarked") !== this.state.value.get("bookmarked")) {
            const endpoint = bookmarked[value.get("bookmarked")];
            const updatedValue = value.merge(endpoint);
            this.setState({ value: updatedValue });
        } else {
            this.setState({ value });
        }
    },
    handleErrorCountChange(attr, errors) {
        console.log("Errors:", errors > 0);
    },
    handleSubmit() {
        console.log("Submit:", this.state.value);
    },
    renderAlert() {
        if (this.state && this.state.data) {
            const firstName = this.state.data["first_name"];
            const lastName = this.state.data["last_name"];
            return (
                <Alert
                    bsStyle="success"
                    onDismiss={this.handleAlertDismiss}
                    style={{ margin: 5 }}
                >
                    <strong>Success!</strong>
                    {" "}
                    {firstName}
                    {" "}
                    {lastName}
                    {" "}was submitted.
                </Alert>
            );
        } else {
            return null;
        }
    },
    renderForm() {
        const { value } = this.state;
        const style = { background: "#FAFAFA", padding: 10, borderRadius: 5 };

        // Bookmark list for chooser
        const bookmarkList = _.map(bookmarked, (bookmark, id) => ({
            id,
            label: bookmark.name
        }));

        // Visibility tag. Here we look at our endpointTypes and
        // find the one with id = the current value of "type" in our values.
        // This is the lower chooser in this example. Based on that type
        // we need to set a visibility tag to show and hide widgets based
        // on that type.
        const currentType = value.get("type");
        const object = _.findWhere(endpointTypes, {
            id: currentType
        });
        const visiblityTag = object.label;

        if (this.state.loaded) {
            return (
                <Form
                    name="dynamic"
                    style={style}
                    schema={schema}
                    value={value}
                    edit={FormEditStates.ALWAYS}
                    visible={visiblityTag}
                    onSubmit={this.handleSubmit}
                    onChange={this.handleChange}
                    onMissingCountChange={(formName, missing) =>
                        this.setState({ hasMissing: missing > 0 })}
                    onErrorCountChange={(formName, errors) =>
                        this.setState({ hasErrors: errors > 0 })}
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
                    <input
                        className="btn btn-default"
                        type="submit"
                        value="Submit"
                        disabled={this.state.hasErrors || this.state.hasMissing}
                    />
                </Form>
            );
        } else {
            return <div style={{ marginTop: 50 }}><b>Loading...</b></div>;
        }
    },
    render() {
        console.log("@@ RENDER", this.state.value.toJSON());
        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <h3>Dynamic endpoint form</h3>
                        <div style={{ marginBottom: 20 }}>{description}</div>
                    </div>
                </div>
                <hr />
                <div className="row">
                    <div className="col-md-8">
                        {this.renderForm()}
                    </div>
                    <div className="col-md-4">
                        <b>STATE:</b>
                        <pre style={{ borderLeftColor: "steelblue" }}>
                            value = {" "}
                            {JSON.stringify(this.state.value.toJSON(), null, 3)}
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
                    <div className="col-md-9">
                        {this.renderAlert()}
                    </div>
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

/** @jsx React.DOM */

"use strict";

var React = require("react/addons");
var _ = require("underscore");
var Markdown = require("react-markdown-el");
var {Alert} = require("react-bootstrap");

var {Form, FormMixin, FormErrors, TextEditGroup, TextAreaGroup, ChooserGroup, Schema, Attr} = require("../../entry");

var text = require("raw!../markdown/dynamic_examples.md");

var description = "This shows a more complicated form where there's conditional fields and pre-filling. " +
    "To use, either select from the top pulldown to choose a preset, or play with the form. The type " +
    "will control which fields below it are hidden or shown. The number of required fields should stay correct.";

//var text = "Testing *this* markdown";

var schema = (
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

var values = {
    "type": 2,
};

var endpointTypes = {1: "Patch Panel", 2: "Equipment Port", 3: "Foreign"};

var bookmarked = {
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
        foreign_description: "telianet-eqx-ash:Peer",
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
}

/**
 * Edit a contact
 */
var EndpointForm = React.createClass({

    mixins: [FormMixin],

    displayName: "EndpointForm",

    getInitialVisibility: function() {
        return endpointTypes[this.props.values["type"]];
    },

    willHandleChange: function(attrName, value) {
        switch (attrName) {
            case "bookmarked":
                if (value) {
                    //bookmarked pulldown was changed so transfer existing
                    //endpoint values onto the form using setValues()
                    var endpoint = bookmarked[value];
                    this.setValues({
                        "name": endpoint.name,
                        "description": endpoint.description,
                        "type": endpoint.type,
                        "device_name": endpoint.device_name,
                        "interface": endpoint.interface,
                        "foreign_description": endpoint.foreign_description,
                        "organization": endpoint.organization,
                        "panel_name": endpoint.panel_name,
                        "port_id": endpoint.port_id,
                        "port_side": endpoint.port_side,
                        "port_location": endpoint.port_location
                    });
                }
                break;
            case "type":
                //The endpoint type changed, which changes fields visible,
                //so set this with setVisibility() using the type as a filter.
                this.setVisibility(endpointTypes[value]);
                break;
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

        this.props.onSubmit && this.props.onSubmit(this.getValues());

        return false;
    },

    renderForm: function() {
        var disableSubmit = this.hasErrors();
        var formStyle = {background: "#FAFAFA", padding: 10, borderRadius:5};

        var bookmarks = {};
        _.each(bookmarked, function(bookmark, id) {
            bookmarks[id] = bookmark.name;
        });

        return (
            <Form style={formStyle}>

                <h5>Bookmarked endpoints</h5>

                <ChooserGroup attr="bookmarked" width={300} initialChoice={this.value("bookmarked")} initialChoiceList={bookmarks}/>

                <hr />

                <h5>General information</h5>

                <TextEditGroup attr="name" width={300} />
                <TextAreaGroup attr="description" />

                <hr />

                <h5>Endpoint type</h5>

                <ChooserGroup attr="type" width={200} initialChoice={this.value("type")}
                              initialChoiceList={endpointTypes} disableSearch={true} />
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

var FormExample = React.createClass({

    getInitialState: function() {
        return {
            "data":  undefined,
            "loaded": false,
        };
    },

    componentDidMount: function() {
        var self = this;

        //Simulate ASYNC state update
        setTimeout(function() {
            self.setState({
                "loaded": true
            });
        }, 1500);
    },

    formValues: function() {
        if (this.refs.form) {
            return this.refs.form.getValues();
        } else {
            return {};
        }
    },

    hasMissing: function() {
        return this.state.missingCount > 0;
    },

    canSubmit: function() {
        return this.state.errorCount === 0;
    },

    showRequired: function(b) {
        var on = b || true;
        this.setState({"showRequired": on});
    },

    handleSubmit: function() {
        var values = this.formValues();

        if (this.hasMissing()) {
            this.showRequired();
            return;
        }

        this.setState({"data": values});
    },

    handleAlertDismiss: function() {
        this.setState({"data": undefined});
    },

    handleMissingCountChange: function(attr, count) {
        this.setState({"missingCount": count});
    },

    handleErrorCountChange: function(attr, count) {
        this.setState({"errorCount": count});
    },

    renderAlert: function() {
        if (this.state && this.state.data) {
            var firstName = this.state.data["first_name"];
            var lastName = this.state.data["last_name"];
            return (
                <Alert bsStyle="success" onDismiss={this.handleAlertDismiss} style={{margin: 5}}>
                    <strong>Success!</strong> {firstName} {lastName} was submitted.
                </Alert>
            );
        } else {
            return null;
        }
    },

    renderEndpointForm: function() {
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

    render: function() {
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
                            <Markdown text={text}/>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
});

module.exports = FormExample;
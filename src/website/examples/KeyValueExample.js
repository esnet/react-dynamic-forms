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
import { Alert } from "react-bootstrap";

import Attr from "../../../src/components/Attr";
import Form from "../../../src/components/Form";
import FormMixin from "../../../src/components/FormMixin";
import Group from "../../../src/components/Group";
import KeyValueEdit from "../../../src/components/KeyValueEditor";
import Schema from "../../../src/components/Schema";

// Data
const keyValues = {
  "Arbor ID": "12345678",
  "Site Wiki": "https://eng-wiki.es.net/foswiki/Site/CHIC-HUB"
};

const constraints = [
  { keyname: "Arbor ID", datatype: "integer", content_type: "organization" },
  { keyname: "Site Wiki", datatype: "url", content_type: "location" },
  { keyname: "Web Portal", datatype: "url", content_type: "organization" },
  { keyname: "Google Folder", datatype: "url", content_type: "location" },
  { keyname: "Special Email", datatype: "email", content_type: "location" },
  { keyname: "Site Router Name", datatype: "string", content_type: "location" },
  { keyname: "Stub Address", datatype: "ip-address", content_type: "location" }
];

const keyValueEditSchema = (
  <Schema>
    <Attr name="keyValues" label="Key Values" />
  </Schema>
);

const KeyValueForm = React.createClass({
  displayName: "KeyValueForm",
  mixins: [ FormMixin ],
  handleSubmit(e) {
    e.preventDefault();
    //Example of checking if the form has missing values and turning required On
    if (this.hasMissing()) {
      this.showRequiredOn();
      return;
    }

    // Example of fetching current and initial values
    // console.log("values:", this.getValues());

    if (this.props.onSubmit) {
      this.props.onSubmit(this.getValues());
    }
  },
  renderForm() {
    const style = { background: "#FDFDFD", padding: 10, borderRadius: 5 };
    const disableSubmit = this.hasErrors();
    const keyValues = this.props.keyValues;
    const constraints = this.props.constraints;
    return (
      <Form style={style} attr="keyvalue-form">
        <Group attr="keyValues">
          <KeyValueEdit keyValues={keyValues} constraints={constraints} />
        </Group>
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

export default React.createClass({
  displayName: "KeyValueExamples",
  getInitialState() {
    return { data: undefined, loaded: false };
  },
  componentDidMount() {
    // Simulate ASYNC state update (not necessary)
    setTimeout(
      () => {
        this.setState({ loaded: true });
      },
      1500
    );
  },
  handleChange(a, b) {
    console.log("Form changed", a, b);
  },
  handleSubmit(data) {
    console.log("submit value", data);
    this.setState({ data });
  },
  handleAlertDismiss() {
    this.setState({ data: undefined });
  },
  renderAlert() {
    if (this.state && this.state.data) {
      return (
        <Alert
          bsStyle="success"
          onDismiss={this.handleAlertDismiss}
          style={{ margin: 5 }}
        >
          <strong>Success!</strong>
        </Alert>
      );
    } else {
      return null;
    }
  },
  render() {
    return (
      <div>
        <div className="row">
          <div className="col-md-12">
            <h3>Key-Value Example</h3>
             The Key-Value widget converts an object of key value pairs to an array which it passes 
                        to the list editor for formatting.<br
            />
            <br />
             The Key-Value editor also takes a list of constraints which it uses to populate the 
                        chooser.  This list is filtered each time a constraint is used until the list of possible
                        constraints is exhausted.<br
            />
            <br />
             Each constraint also has a datatype which is used for validation by the textedit.<br
            />
            <br />
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <KeyValueForm
              schema={keyValueEditSchema}
              keyValues={keyValues}
              constraints={constraints}
              onSubmit={this.handleSubmit}
              onChange={this.handleChange}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            {this.renderAlert()}
          </div>
        </div>
      </div>
    );
  }
})


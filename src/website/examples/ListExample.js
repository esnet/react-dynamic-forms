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
import Highlighter from "../Highlighter";

import Form from "../../forms/components/Form";
import Schema from "../../forms/components/Schema";
import Attr from "../../forms/components/Attr";

import Chooser from "../../forms/components/Chooser";
import TextEdit from "../../forms/components/TextEdit";

import formGroup from "../../forms/formGroup";
import formList from "../../forms/formList";

import { FormEditStates } from "../../forms/constants";

const text = `
### List example
`;

const description = `
This shows an example form with a list of emails that can be added or removed.
`;

/**
 * Renders a form for entering an email address
 */
class EmailForm extends React.Component {
  static defaultValues = { email_type: 1, email: "" };
  static schema = (
    <Schema>
      <Attr
        name="email"
        defaultValue=""
        label="Email"
        required={true}
        validation={{ format: "email" }}
      />
      <Attr name="email_type" defaultValue={1} label="Type" required={true} />
    </Schema>
  );

  handleChange(attr, values) {
    if (this.props.onChange) {
      this.props.onChange(attr, values);
    }
  }

  emailTypes() {
    return [{ id: 1, label: "Work" }, { id: 2, label: "Home" }];
  }

  emailTypeLabel() {
    let result;
    this.emailTypes().forEach(obj => {
      if (obj.id === this.props.values["email_type"]) {
        result = obj.label;
      }
    });
    return result;
  }

  render() {
    const values = this.props.values || EmailForm.defaultValues;
    if (this.props.edit) {
      return (
        <Form
          attr={this.props.attr}
          schema={EmailForm.schema}
          values={values}
          edit={FormEditStates.ALWAYS}
          labelWidth={50}
          onChange={(attr, values) => this.handleChange(attr, values)}
        >
          <Chooser
            attr="email_type"
            choiceList={this.emailTypes()}
            disableSearch={true}
            width={150}
          />
          <TextEdit attr="email" width={300} />
        </Form>
      );
    } else {
      return (
        <tr>
          <td>{this.props.values["email"]}</td>
          <td>
            <span style={{ padding: 5, color: "#AAA" }}>
              ({this.emailTypeLabel()})
            </span>
          </td>
        </tr>
      );
    }
  }
}

const EmailList = formList(EmailForm);
const Emails = formGroup(EmailList);

/**
 * Edit a contact
 */
const ContactForm = React.createClass({
  displayName: "ContactForm",
  schema() {
    return (
      <Schema>
        <Attr
          name="first_name"
          label="First name"
          placeholder="Enter first name"
          required={true}
          validation={{ type: "string" }}
        />
        <Attr
          name="last_name"
          label="Last name"
          placeholder="Enter last name"
          required={true}
          validation={{ type: "string" }}
        />
        <Attr name="emails" label="Emails" />
      </Schema>
    );
  },
  // Save the form
  handleSubmit(e) {
    e.preventDefault();

    // Example of checking if the form has missing values and turning required On
    if (this.hasMissing()) {
      this.showRequiredOn();
      return;
    }

    // Example of fetching current and initial values
    console.log("values:", this.getValues());

    if (this.props.onSubmit) {
      this.props.onSubmit(this.getValues());
    }
  },
  handleChange(attr, values) {
    if (this.props.onChange) {
      this.props.onChange(attr, values);
    }
  },
  handleErrorCountChange(attr, errors) {
    console.log("Errors:", errors > 0);
  },
  render() {
    const disableSubmit = false;
    //this.hasErrors();
    const style = { background: "#FAFAFA", padding: 10, borderRadius: 5 };
    const { values } = this.props;
    const emails = values.emails;

    return (
      <Form
        attr="contact-form"
        style={style}
        schema={this.schema()}
        values={values}
        onSubmit={() => this.handleSubmit()}
        onChange={(attr, values) => this.handleChange(attr, values)}
        onMissingCountChange={(attr, missing) =>
          this.setState({ hasMissing: missing > 0 })}
        onErrorCountChange={(attr, errors) =>
          this.setState({ hasErrors: errors > 0 })}
      >
        <TextEdit attr="first_name" width={300} />
        <TextEdit attr="last_name" width={300} />
        <Emails attr="emails" values={emails} />
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
  mixins: [Highlighter],
  getInitialState() {
    const loaded = false;
    const values = {
      first_name: "Bill",
      last_name: "Jones",
      emails: [
        { email: "b.jones@work.com", email_type: 1 },
        { email: "bill@gmail.com", email_type: 2 }
      ]
    };
    return { values, loaded };
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
  handleChange(attr, values) {
    this.setState({ values });
  },
  handleErrorCountChange(attr, errors) {
    console.log("Errors:", errors > 0);
  },
  handleSubmit(value) {
    this.setState({ data: value });
  },
  handleAlertDismiss() {
    this.setState({ data: undefined });
  },
  renderAlert() {
    if (this.state && this.state.data) {
      const firstName = this.state.data["first_name"];
      const lastName = this.state.data["last_name"];
      const emailList = this.state.data["emails"];
      return (
        <Alert
          bsStyle="success"
          onDismiss={this.handleAlertDismiss}
          style={{ margin: 5 }}
        >
          <strong>Success!</strong>
          {firstName}
          {lastName}
          {" "}was submitted with{" "}
          {emailList.length}
          email(s).
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
          values={this.state.values}
          onChange={this.handleChange}
          onSubmit={this.handleSubmit}
        />
      );
    } else {
      return <div style={{ marginTop: 50 }}><b>Loading...</b></div>;
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
          <div className="col-md-8">
            {this.renderContactForm()}
          </div>
          <div className="col-md-4">
            <b>STATE:</b>
            <pre style={{ borderLeftColor: "steelblue" }}>
              values = {" "}
              {JSON.stringify(this.state.values, null, 3)}
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

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

  handleChange(form, value) {
    console.log("handleChange", form, value);
    if (this.props.onChange) {
      this.props.onChange(form, value);
    }
  }

  handleMissingCountChange(form, count) {
    if (this.props.onMissingCountChange) {
      this.props.onMissingCountChange(form, count);
    }
  }

  handleErrorCountChange(form, count) {
    if (this.props.onErrorCountChange) {
      this.props.onErrorCountChange(form, count);
    }
  }

  emailTypes() {
    return [{ id: 1, label: "Work" }, { id: 2, label: "Home" }];
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
    const value = this.props.value || EmailForm.defaultValues;
    //if (this.props.edit) {
    //
    return (
      <Form
        name={this.props.name}
        schema={EmailForm.schema}
        value={value}
        edit={this.props.edit ? FormEditStates.ALWAYS : FormEditStates.NEVER}
        labelWidth={50}
        onChange={(fieldName, value) => this.handleChange(fieldName, value)}
        onMissingCountChange={(fieldName, value) =>
          this.handleMissingCountChange(fieldName, value)}
        onErrorCountChange={(fieldName, value) =>
          this.handleErrorCountChange(fieldName, value)}
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
    /*
    } else {
      return (
        <div>
          <span>
            {this.props.value.get("email")}
          </span>
          <span style={{ padding: 5, color: "#AAA" }}>
            ({this.emailTypeLabel()})
          </span>
        </div>
      );
    }
    */
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
    const emails = value.get("emails");

    return (
      <Form
        field="contact-form"
        style={style}
        schema={this.schema()}
        value={value}
        edit={FormEditStates.SELECTED}
        labelWidth={100}
        onSubmit={() => this.handleSubmit()}
        onChange={(fieldName, value) => this.handleChange(fieldName, value)}
        onMissingCountChange={(form, missing) =>
          this.handleMissingCountChange(form, missing)}
        onErrorCountChange={(form, errors) =>
          this.handleErrorCountChange(form, errors)}
      >
        <TextEdit field="first_name" width={300} />
        <TextEdit field="last_name" width={300} />
        <Emails field="emails" value={emails} />
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
    const value = new Immutable.fromJS({
      first_name: "Bill",
      last_name: "Jones",
      emails: [
        { email: "b.jones@work.com", email_type: 1 },
        { email: "bill@gmail.com", email_type: 2 }
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
          value={this.state.value}
          onChange={this.handleChange}
          onMissingCountChange={this.handleMissingCountChange}
          onErrorCountChange={this.handleErrorCountChange}
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
              value = {" "}
              {JSON.stringify(this.state.value, null, 3)}
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

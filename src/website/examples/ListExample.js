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
import TextArea from "../../forms/components/TextArea";

import formGroup from "../../forms/formGroup";
import formList from "../../forms/formList";
import RadioButtons from "../../forms/components/RadioButtons";
import CheckBoxes from "../../forms/components/CheckBoxes";

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
  static defaultValues = { email_type: 1, email: "", options: ["Never"], actions: 1, notes: "" };

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
      <Field name="options" label="Email preferences" />
      <Field name="actions" label="Email actions" />
      <Field name="notes" label="Notes" />
    </Schema>
  );

  emailTypeLabel() {
    let result;
    this.props.types.forEach(obj => {
      if (obj.id === this.props.value.get("email_type")) {
        result = obj.label;
      }
    });
    return result;
  }

  render() {
    const {
      onChange,
      onMissingCountChange,
      onErrorCountChange,
      types,
      options,
      actions,
      value = EmailForm.defaultValues
    } = this.props;
    const callbacks = { onChange, onMissingCountChange, onErrorCountChange };

    if (this.props.edit) {
      return (
        <Form
          name={this.props.name}
          schema={EmailForm.schema}
          value={value}
          edit={FormEditStates.ALWAYS}
          labelWidth={125}
          {...callbacks}
        >
          <Chooser
            field="email_type"
            choiceList={types}
            disableSearch={true}
            width={150}
          />
          <TextEdit field="email" width={300} />
          <TextArea field="notes" />
          <CheckBoxes field="options" optionList={options} />
          <RadioButtons field="actions" optionList={actions} />
        </Form>
      );
    } else {
      return (
        <Form
          name={this.props.name}
          schema={EmailForm.schema}
          value={value}
          edit={FormEditStates.TABLE}
          labelWidth={125}
          {...callbacks}
        >
          <TextEdit field="email" width={250} />
          <TextArea field="notes" />
          <Chooser
            field="email_type"
            choiceList={types}
            disableSearch={true}
            width={250}
            view={(name, id) => <a href={`email/${id}`}>{name}</a>}
          />
          <CheckBoxes field="options" optionList={options} />
          <RadioButtons field="actions" optionList={actions} />
        </Form>
      );
    }
  }
}

const EmailList = formList(EmailForm);
const Emails = formGroup(EmailList, true);

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
    const emailTypes = Immutable.fromJS([
      { id: 1, label: "Work" },
      { id: 2, label: "Home" },
      { id: 3, label: "Noc"}
    ]);
    const availableEmailOptions = Immutable.fromJS([
      "Never" ,
      "As items arrive",
      "Daily summary"
    ]);
    const availableEmailActions = Immutable.fromJS([
      { id: 1, label: "Add" },
      { id: 2, label: "Edit" },
      { id: 3, label: "Delete" }
    ]);
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
        <Emails
          field="emails"
          types={emailTypes}
          options={availableEmailOptions}
          actions={availableEmailActions}
          value={emails} />
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
        { email: "b.jones@work.com", email_type: 1, options: ["Never"], notes: "My work email", actions: 1},
        { email: "bill@gmail.com", email_type: 2, options: ["As items arrive"],
          notes: "My home email.  Please do not call unless absolutely necessary", actions: 1}
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

    Contact GitHub API Training Shop Blog About

    © 2017 GitHub, Inc. Terms Privacy Security Status Help


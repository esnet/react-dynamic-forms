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

import Form from "../../forms/components/Form";
import Schema from "../../forms/components/Schema";
import Attr from "../../forms/components/Attr";

import TextEdit from "../../forms/components/TextEdit";
import DateEdit from "../../forms/components/DateEdit";
import Chooser from "../../forms/components/Chooser";

import { FormEditStates } from "../../forms/constants";

import Highlighter from "../Highlighter";

const description = `
This shows a simple form where the schema and values of the form are loaded
at some future time, such as if they were read from a REST API.
`;

const text = `
### Forms example

The forms library can, of course, help to build a complete form. This gives you automatic tracking of errors within the form, as the user edits it, as well as a telly of required fields that are not yet filled out. The form also keeps track of initial vs final values.

The form elements are defined by a **schema**. Schemas can be defined with JSX or manually. Here's the schema used in this page:

    var schema = (
        <Schema>
            <Attr name="first_name" label="First name" placeholder="Enter first name"
                  required={true} validation={{"type": "string"}}/>
            <Attr name="last_name" label="Last name" placeholder="Enter last name"
                  required={true} validation={{"type": "string"}}/>
            <Attr name="email" label="Email" placeholder="Enter valid email address"
                  validation={{"format": "email"}}/>
            <Attr name="birthdate" label="Birthdate"  required={true} />
        </Schema>
    );

As you can see the schema is used to associate the Attr name ("first_name" for example) with some properties which define how it looks and what is a valid value for that Attr. Here we define a label ("First name"), a placeholder text, and some validation properties. Required can be set true to have the form track that this Attr field needs to be filled out before the form is submitted. More on errors and missing value counts below. In addition to being required or not, the Attr can have a validation prop set which will be passed to Revalidator for field validation while the user interacts with the form. It is most common to use it to specify the type ("string", "integer", or "number"), but you can also specify a format, such as in the example above where the email Attr is checked to make sure it is a valid email address. Maximum string lengths, or ranges of numeric values can also be specified. For full details see the [Revalidator website](https://github.com/flatiron/revalidator).

Rendering is not automatic. Instead the form itself is a React component that you define. This React component will need to use the **FormMixin** to get the proper behavior, as well as implement a layout of the form widgets with special render method called \`renderForm()\`.

We define the form itself like this:

    var ContactForm = React.createClass({

        mixins: [FormMixin],

And then implement the form layout like this:

        renderForm: function() {
            var disableSubmit = this.hasErrors();
            return (
                <Form>
                    <TextEdit attr="first_name" width={300} />
                    <TextEdit attr="last_name" width={300} />
                    <TextEdit attr="email" width={500} />
                    <DateEdit attr="birthdate" />
                    <hr />
                    <input className="btn btn-default" type="submit" value="Submit" disabled={disableSubmit}/>
                </Form>
            );
        }

As you can see, we return a \`<Form>\` element which contains further JSX, which is a convenience. In fact, you can define this with a \`<form>\` too. You can use any JSX in here to render the form however you like. This makes the layout of the form as flexible as any other React code.

The special elements here are the \`TextEdit\`s. They specify an \`attr\` prop which references the schema (we'll see how to get the schema hooked up in a minute). Each TextEditGroup will generate a label and a form control (in this case a \`TextEdit\`). We use Bootstrap for the layout. In addition to TextEditGroups there's also: \`TextAreaGroup\`, \`ChooserGroup\`, \`OptionsGroup\` and \`TagsGroup\`. You can also wrap your own controls in the generic \`Group\`.

Now that we have out form it's time to use it. Typically the form will be contained (rendered by) another React component which will hold the business logic of sourcing the schema and initial values, as well as handling the submit of the form in some way.

To render the form we created above we need to pass in the initial values and schema. Here is the key part of render function for this page's example:

        render: function() {
            ...
            <ContactForm schema={schema} values={values} onSubmit={this.handleSubmit}/>
            ...
        }

Note that the schema is required, so you cannot render the form until one is available. If this is being loaded from the server you would display a Spinner until it is available.

`;

const birthday = new Date("1964-08-22");

const schema = (
  <Schema>
    <Attr
      name="type"
      label="Type"
      placeholder="Enter contact type"
      required={true}
    />
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
    <Attr
      name="email"
      label="Email"
      placeholder="Enter valid email address"
      required={true}
      validation={{ format: "email" }}
    />
    <Attr name="birthdate" label="Birthdate" required={true} />
  </Schema>
);

const initialValues = {
  type: 0,
  first_name: "Bill",
  last_name: "Jones",
  email: "bill@gmail.com",
  birthdate: birthday
};

export default React.createClass({
  mixins: [Highlighter],
  getInitialState() {
    return {
      values: initialValues,
      loaded: false,
      editMode: FormEditStates.ALWAYS
    };
  },
  componentDidMount() {
    //Simulate ASYNC state update (not required)
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
  handleSubmit(e) {
    console.log("HANDLE SUBMIT", this.state.values);
    this.setState({
      editMode: FormEditStates.SELECTED
    });
  },
  handleAlertDismiss() {
    this.setState({ data: undefined });
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
          <strong>Success! </strong>
          <span>{`${firstName} ${lastName} was submitted.`}</span>
        </Alert>
      );
    } else {
      return null;
    }
  },
  renderContactForm() {
    //const disableSubmit = false;
    //this.hasErrors();
    const style = { background: "#FAFAFA", padding: 10, borderRadius: 5 };
    const types = [
      { id: 0, label: "Friend" },
      { id: 1, label: "Acquaintance" }
    ];

    let submit;
    if (this.state.editMode === FormEditStates.ALWAYS) {
      submit = (
        <input
          className="btn btn-primary"
          type="submit"
          value="Submit"
          disabled={this.state.hasErrors || this.state.hasMissing}
        />
      );
    } else {
      submit = <div>Make changes to the form by clicking the pencil icons</div>;
    }

    if (this.state.loaded) {
      return (
        <Form
          style={style}
          schema={schema}
          values={this.state.values}
          edit={this.state.editMode}
          labelWidth={200}
          onSubmit={this.handleSubmit}
          onChange={this.handleChange}
          onMissingCountChange={(attr, missing) =>
            this.setState({ hasMissing: missing > 0 })}
          onErrorCountChange={(attr, errors) =>
            this.setState({ hasErrors: errors > 0 })}
        >
          <Chooser
            attr="type"
            width={150}
            choiceList={types}
            disableSearch={true}
          />
          <TextEdit attr="first_name" width={300} />
          <TextEdit attr="last_name" width={300} />
          <TextEdit attr="email" width={400} />
          <DateEdit attr="birthdate" width={100} />
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
  },
  render() {
    return (
      <div>
        <div className="row">
          <div className="col-md-12">
            <h3>Contact form</h3>
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

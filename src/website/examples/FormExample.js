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
import Markdown from "react-markdown";
import { Alert } from "react-bootstrap";
import Immutable from "immutable";
import Chance from "chance";

import Form from "../../forms/components/Form";
import Schema from "../../forms/components/Schema";
import Field from "../../forms/components/Field";

import TextEdit from "../../forms/components/TextEdit";
import TextArea from "../../forms/components/TextArea";
import DateEdit from "../../forms/components/DateEdit";
import Chooser from "../../forms/components/Chooser";
import TagsEdit from "../../forms/components/TagsEdit";
import CheckBoxes from "../../forms/components/CheckBoxes";
import RadioButtons from "../../forms/components/RadioButtons";
import View from "../../forms/components/View";

import { FormEditStates } from "../../forms/constants";

import Highlighter from "../Highlighter";

const description = `
This shows a simple form where the schema and values of the form are loaded
at some future time, such as if they were read from a REST API.
`;

const text = `
### Forms example

The forms library is designed to help you build a complete form. In this example
we create a simple contacts form. There are other examples too of forms which change
their structure as the user interacts with tham, as well as demostrating the use
of lists within the forms. But here we keep it relatively simple.

What do we want from our form?

Essentially we want to provide perhaps some initial
data, our form "value", defaults in the case of a new form, or maybe our current
database state in the case of editing an existing entity.

As the user edits the data, we'll want to track that. We may choose to save
it on submit (if it's a new form, that's likely), or save it as the user edits it
(perhaps if they are using inline editing we might
want to save the data when any fields are changed). Either way, the forms library
allows you to provide a callback function, which will be called whenever the values
in the form change. How you want to respond to that is up to you, but this example
demostrates one possible approach.

In addition to knowing that the form values have changed, we also need to know if
the form has any errors or missing fields. We do this via callbacks as well, where
each callback will tell you the number of missing or empty fields that exist within
the form. You can use that to control if the user can submit the form or not, as
we do in this example.

Okay, so we have initial values and we have some callbacks. How do we get a form
up and running to use those?

Forms have two concerns. Each form has a schema which we use to provide the meta
data for fields within the form. This includes UI elements like the label for each
fields, the placeholder text, etc, but also rules around the field itself. For
example a field (called an Field in this library),

The form elements are defined by a **schema**. Schemas can be defined with JSX or manually. Here's the schema used in this page:

    var schema = (
        <Schema>
            <Field name="first_name" label="First name" placeholder="Enter first name"
                  required={true} validation={{"type": "string"}}/>
            <Field name="last_name" label="Last name" placeholder="Enter last name"
                  required={true} validation={{"type": "string"}}/>
            <Field name="email" label="Email" placeholder="Enter valid email address"
                  validation={{"format": "email"}}/>
            <Field name="birthdate" label="Birthdate"  required={true} />

        </Schema>
    );

As you can see the schema is used to associate the Field name ("first_name" for example) with some properties which define how it looks and what is a valid value for that Field. Here we define a label ("First name"), a placeholder text, and some validation properties. Required can be set true to have the form track that this Field field needs to be filled out before the form is submitted. More on errors and missing value counts below. In addition to being required or not, the Field can have a validation prop set which will be passed to Revalidator for field validation while the user interacts with the form. It is most common to use it to specify the type ("string", "integer", or "number"), but you can also specify a format, such as in the example above where the email Field is checked to make sure it is a valid email address. Maximum string lengths, or ranges of numeric values can also be specified. For full details see the [Revalidator website](https://github.com/flatiron/revalidator).

Rendering is not automatic. Instead the form itself is a React component that you define. This React component will need to use the **FormMixin** to get the proper behavior, as well as implement a layout of the form widgets with special render method called \`renderForm()\`.

We define the form itself like this:

    var ContactForm = React.createClass({

        mixins: [FormMixin],

And then implement the form layout like this:

        renderForm: function() {
            var disableSubmit = this.hasErrors();
            return (
                <Form>
                    <TextEdit field="first_name" width={300} />
                    <TextEdit field="last_name" width={300} />
                    <TextEdit field="email" width={500} />
                    <DateEdit field="birthdate" />
                    <hr />
                    <input className="btn btn-default" type="submit" value="Submit" disabled={disableSubmit}/>
                </Form>
            );
        }

As you can see, we return a \`<Form>\` element which contains further JSX, which is a convenience. In fact, you can define this with a \`<form>\` too. You can use any JSX in here to render the form however you like. This makes the layout of the form as flexible as any other React code.

The special elements here are the \`TextEdit\`s. They specify an \`field\` prop which references the schema (we'll see how to get the schema hooked up in a minute). Each TextEditGroup will generate a label and a form control (in this case a \`TextEdit\`). We use Bootstrap for the layout. In addition to TextEditGroups there's also: \`TextAreaGroup\`, \`ChooserGroup\`, \`OptionsGroup\` and \`TagsGroup\`. You can also wrap your own controls in the generic \`Group\`.

Now that we have out form it's time to use it. Typically the form will be contained (rendered by) another React component which will hold the business logic of sourcing the schema and initial values, as well as handling the submit of the form in some way.

To render the form we created above we need to pass in the initial values and schema. Here is the key part of render function for this page's example:

        render: function() {
            ...
            <ContactForm schema={schema} values={values} onSubmit={this.handleSubmit}/>
            ...
        }

Note that the schema is required, so you cannot render the form until one is available. If this is being loaded from the server you would display a Spinner until it is available.

`;

const schema = (
  <Schema>
    <Field
      name="type"
      label="Type"
      placeholder="Enter contact type"
      required={true}
    />
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
    <Field
      name="email"
      label="Email"
      placeholder="Enter valid email address"
      required={true}
      validation={{ format: "email" }}
    />
    <Field name="languages" label="Languages" />
    <Field name="options" label="Email preferences" />
    <Field name="birthdate" label="Birthdate" required={true} />
    <Field name="tags" label="Categories" required={true} />
    <Field name="city" label="City" />
    <Field name="notes" label="Notes" />
  </Schema>
);

const availableTypes = Immutable.fromJS([
  { id: 0, label: "Friend" },
  { id: 1, label: "Acquaintance" }
]);

const availableEmailOptions = Immutable.fromJS([
  { id: 0, label: "Never" },
  { id: 1, label: "As items arrive" },
  { id: 2, label: "Daily summary" }
]);

const availableLanguages = Immutable.fromJS([
  "English",
  "French",
  "Spanish",
  "Japanese"
]);

const birthday = new Date("1975-05-15");

const initialValue = {
  type: 0,
  first_name: "Bill",
  last_name: "Jones",
  email: "bill@gmail.com",
  birthdate: birthday,
  languages: ["English", "Spanish"],
  options: 1,
  tags: ["stanford"],
  city: "Berkeley",
  notes: `Here are some notes in Markdown
#### Title
A text field with information that would otherwise overun the line.
This is here to test how the textarea functions when presented with a blob of data
* We also have a bullet here to show Markdown`
};

const tagList = Immutable.fromJS([
  "ucberkeley",
  "esnet",
  "stanford",
  "doe",
  "industry",
  "government"
]);

export default React.createClass({
  mixins: [Highlighter],
  getInitialState() {
    return {
      value: Immutable.fromJS(initialValue),
      tagList: Immutable.fromJS(tagList),
      loaded: false,
      editMode: FormEditStates.SELECTED
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
  handleChange(formName, value) {
    this.setState({ value });
  },
  handleErrorCountChange(field, errors) {
    //console.log("Errors:", errors > 0);
  },
  handleSubmit(e) {
    //console.log("handleSubmit");
    this.setState({
      editMode: FormEditStates.SELECTED
    });
  },
  handleAlertDismiss() {
    this.setState({ data: undefined });
  },
  random() {
    const chance = new Chance();
    const randomValue = {
      type: chance.integer({min: 0, max: 1}),
      first_name: chance.first(),
      last_name: chance.last(),
      email: chance.email(),
      birthdate: chance.birthday(),
      languages: chance.pickset([
        "English",
        "French",
        "Spanish",
        "Japanese"], chance.integer({min: 0, max: 4})),
      options: chance.integer({min: 0, max: 2}),
      tags:  chance.pickset([
        "ucberkeley",
        "esnet",
        "stanford",
        "doe",
        "industry",
        "government"], chance.integer({min: 0, max: 3})),
      city: chance.city()
    };

    this.setState({value: new Immutable.fromJS(randomValue)});
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

    let submit;
    if (this.state.editMode === FormEditStates.ALWAYS) {
      let disableSubmit = true;
      if (this.state.hasErrors === false && this.state.hasMissing === false) {
        disableSubmit = false;
      }
      console.log(disableSubmit)
      submit = (
        <button
          type="submit"
          className="btn btn-default"
          disabled={disableSubmit}
          onClick={() => this.handleSubmit()}
        >
          Submit contact
        </button>
      );
    } else {
      submit = (
        <div>* Make changes to the form by clicking the pencil icons</div>
      );
    }

    if (this.state.loaded) {
      return (
        <Form
          name="basic"
          style={style}
          schema={schema}
          value={this.state.value}
          edit={this.state.editMode}
          labelWidth={200}
          onSubmit={this.handleSubmit}
          onChange={this.handleChange}
          onMissingCountChange={(fieldName, missing) =>
            this.setState({ hasMissing: missing > 0 })}
          onErrorCountChange={(fieldName, errors) =>
            this.setState({ hasErrors: errors > 0 })}
        >
          <Chooser
            field="type"
            width={150}
            choiceList={availableTypes}
            disableSearch={true}
          />
          <TextEdit field="first_name" width={300} />
          <TextEdit field="last_name" width={300} />
          <TextEdit
            field="email"
            width={400}
            view={(value) => {
              return <a>{value}</a>
            }}
          />
          <DateEdit field="birthdate" width={100} />
          <CheckBoxes field="languages" optionList={availableLanguages} />
          <RadioButtons field="options" optionList={availableEmailOptions} />
          <TagsEdit
            field="tags"
            tagList={this.state.tagList}
            onTagListChange={(name, tagList) => this.setState({ tagList })}
            width={400} />
          <TextArea
            field="notes"
            width={800}
            view={(value) => {
              return <Markdown source={value}/>
            }} />
          <View
            field="city"
            width={400}
            view={(value) => {
              return <b>{value}</b>
            }} />
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
            <h3>Basic form</h3>
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
              {JSON.stringify(this.state.value.toJSON(), null, 3)}
            </pre>
            <pre style={{ borderLeftColor: "#b94a48" }}>
              {`hasErrors: ${this.state.hasErrors}`}
            </pre>
            <pre style={{ borderLeftColor: "orange" }}>
              {`hasMissing: ${this.state.hasMissing}`}
            </pre>
            <button
              className="btn btn-default btn-sm"
              onClick={() => this.random()}
            >
              Random
            </button>
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
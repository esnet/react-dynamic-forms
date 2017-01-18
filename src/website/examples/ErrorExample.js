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
import Attr from "../../../src/components/Attr";
import Form from "../../../src/components/Form";
import FormErrors from "../../../src/components/FormErrors";
import FormMixin from "../../../src/components/FormMixin";
import Schema from "../../../src/components/Schema";
import TextEditGroup from "../../../src/components/TextEditGroup";

const text = `
### Error example

The forms library has several facilities to help with tracking of
errors and missing values on the form. To understand how to use this
ability we need to understand how data flows in the form. We'll
start at the lowest level, the form widgets themselves.

---

#### Widgets

At the lowest level, each widget, such as a TextEdit widget,
has been wrapped to keep track of its status with respect to the
validation rules that were passed to it, either directly or using a
form schema. Any react control can be wrapped in this way, but the
library provides most of the common ones so that should be rarely
necessary.


The rules each widget handles specifies both what kind of data or format
is valid for a field as well as if the field is required or not. As the
status of the form widget changes with user input (typing, selection,
blur, focus and so on) the field will pass its value and status up to
the creator of the widget via callbacks. For example if the field is
required and the user clears the input, that status change is reported.

---

#### Forms

At the next level up, a \`Form\` contains many widgets. Using the \`Group\`
wrappers such as \`TextEditGroup\` within a \`FormMixin\`'s \`renderForm()\`
method will add tracking of its widgets by adding callbacks to those widgets
and keeping track of the result. The resulting state on the form will be
a mapping of widgets to if they are currently displaying a error as well
as a mapping of widget to if they are required to be filled but aren't.

From these two mappings we can sum the totals allowing a form to known how
many errors and missing fields exist within its widgets. To access these
totals you can call \`errorCount()\` (or \`hasErrors()\`) and
\`missingCount()\` (or \`hasMissing()\`) on the \`FormMixin\` component.
You can also get notifications from outside of the \`FormMixin\` component
by adding callbacks as props, such as in this example:

    <ContactForm
        attr="contacts"
        schema={schema}
        values={values}
        onMissingCountChange={this.handleMissingCountChange}
        onErrorCountChange={this.handleErrorCountChange}
    />

An example error handler would then look like this (where \`attr\`
will be the name supplied as the \`attr\` prop to the form ("contacts"
in the above example) and \`count\` will be the number of errors
currently in the form:

    handleErrorCountChange: function(attr, count) {
        this.setState({"errorCount": count});
    },

Missing values can be similarly handled.

*Note* that all of this applied to list editors as well. Total counts
of the list editors within a form will be correctly reported back
up to the form, no matter how deep.

---

#### Show Required

Showing the user which forms are required is a tricky user
experience dance. On one hand you don't want to throw up all
missing fields as errors from the beginning. That would be kind
of hostile. On the other hand it needs to be clear which form
fields must be filled out.

The way we approach this is to display each field label that is
required in bold with a * next to it. This is a fairly common
convention in form layouts. Secondly will can display the number
of missing fields using the above described callbacks or with the
Form Error widget described below. If the user has not filled out
all the fields and still presses submit we place the form into a
"showRequired" mode. In this mode all required fields will be shown
in their error state (outlined in red).

The way this works is to call \`showRequired()\` on the \`FormMixin\`,
or pass \`showRequired={true}\` to form. It will handle passing
that down to each widget where each widget knows how to render
based on that prop as well as its current required state (i.e. if
it is required and not filled out, it will render in the error state).

In this example, showRequired is simply a state which is turned on
by hitting the submit button (instead of actually submitting). We
simply pass that state down to the \`<ContactForm ...>\` on render
and the rest happens automatically.

**Note**: The way we handle required fields may be refined over time.

---

#### Error Component

Above all this the forms library also has a component called
\`FormErrors\` for displaying these errors and warnings in a
consistent way across our applications. This is shown in the example
to the right of the form. You can, of course, just listen to the
callbacks and display the totals in whatever way you want, as well
as implement any other logic you need to based on them. This is just
a helper.

Here is an example of using the FormErrors:

    <FormErrors
        showRequired={this.state.showRequired}
        missingCount={this.state.missingCount}
        numErrors={this.state.errorCount}
    />

In this form we use the callbacks to hold our own state as to what
the error and missing counts are, as well as the \`showRequired\` field.
These are passed into the \`FormErrors\` component and the result is nicely
displayed.

This manages three types of error/warning information that is displayed
to the user:

  - A hard error, which will display in preference to other messages. A hard error
    might be something like "The form could not be saved". This type of error, passed
    in as the \`error\` prop, is an object of shape:
       \`msg\`     - The main error message
       \`details\` - Further information about the message, like "Unable to
       make Internet connection", or perhaps a raw server message.

  - error count, passed in as \`numErrors\` prop. If this is passed
    in then this component will display the number of errors on the
    form. This is used with the Form code so that the user can see
    live how many validation errors are left on the page

  - missing count, passed in as \`missingCount\` prop. If there is
    not an error on the page but \`missingCount > 0\` then this
    component will display a n fields to complete message. If the prop
    'showRequired' is passed in as true, then the form is in the
    mode of actually displaying as an error all missing fields. The
    message in this case will be simply "Form incomplete".

As mentioned above you can also pass in a direct error message to
the \`FormErrors\` component. We use this in the case of a server
error where we want that information displayed to the user.

`;

const description = `This shows a simple form where we track
form validation errors and incomplete fields as centralized state
on the top level form. You can use this information to display
whatever user message you like, or block submit of the form as
needed. In this form you can experiment with missing values, or
with errors by entering an invalid email address.
`;

const schema = (
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
    <Attr
      name="email"
      label="Email"
      placeholder="Enter valid email address"
      validation={{ format: "email" }}
    />
  </Schema>
);

const values = { first_name: "", last_name: "", email: "" };

/**
 * Edit a contact
 */
const ContactForm = React.createClass({
  mixins: [ FormMixin ],
  displayName: "ContactForm",
  renderForm() {
    const style = { background: "#FAFAFA", padding: 10, borderRadius: 5 };
    return (
      <Form style={style}>
        <TextEditGroup attr="first_name" width={300} />
        <TextEditGroup attr="last_name" width={300} />
        <TextEditGroup attr="email" width={500} />
      </Form>
    );
  }
});

export default React.createClass({
  mixins: [ Highlighter ],
  getInitialState() {
    return { data: null, showRequired: false, missingCount: 0, errorCount: 0 };
  },
  handleAlertDismiss() {
    this.setState({ data: undefined });
  },
  handleMissingCountChange(attr, count) {
    this.setState({ missingCount: count });
  },
  handleErrorCountChange(attr, count) {
    this.setState({ errorCount: count });
  },
  //
  // Submit and related functions
  //
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
    this.setState({ showRequired: on });
  },
  handleSubmit() {
    const values = this.formValues();
    if (this.hasMissing()) {
      this.showRequired();
      return;
    }
    this.setState({ data: values });
  },
  //
  // Render functions
  //
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
    return (
      <ContactForm
        ref="form"
        attr="contact"
        schema={schema}
        values={values}
        showRequired={this.state.showRequired}
        onMissingCountChange={this.handleMissingCountChange}
        onErrorCountChange={this.handleErrorCountChange}
        onSubmit={this.handleSubmit}
      />
    );
  },
  render() {
    return (
      <div>
        <div className="row">
          <div className="col-md-12">
            <h3>Error and required field handling</h3>
            <div style={{ marginBottom: 20 }}>{description}</div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-9">
            {this.renderContactForm()}
          </div>
          <div className="col-md-3">
            <FormErrors
              showRequired={this.state.showRequired}
              missingCount={this.state.missingCount}
              numErrors={this.state.errorCount}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-9">
            <div>
              <hr />
              <button
                className="btn btn-default"
                type="submit"
                disabled={!this.canSubmit()}
                onClick={this.handleSubmit}
              >
                Submit
              </button>
            </div>
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
              style={
                {
                  borderTopStyle: "solid",
                  borderTopColor: "rgb(244, 244, 244)",
                  paddingTop: 5,
                  marginTop: 20
                }
              }
            >
              <Markdown source={text} />
            </div>
          </div>
        </div>
      </div>
    );
  }
})


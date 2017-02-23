
**NOTE: v1.0 adds support for React 15, but since the way Mixins work in React 15, this is a fairly substantial rewrite to provide an API that doesn't use Mixins at all.**

This repository contains a set of React based forms components which are used within ESnet for our network database application (ESDB), but could be used by any React based project needing to build complex forms.

Our approach is to treat a form as a controlled input, essentially an input with many inputs (which may have many inputs, and so on...) You maintain your form's state however you want, you pass that state down into the form as its value prop. If the form is edited, a callback is called and you can update your form state. When it comes time to save the form, that's up to you, you always have your form's state. On top of this the form has a schema defining rules. Therefore, you can also listen to changes in the count of either missing values or errors. With this information it is simple to control if the user can submit the form as well.

The library is built on Immutable.js, so form state should be passed into the form as an Immutable.Map. This allows efficient operations on your form data, minimizing copying while ensuring safety as the form state is mutated.

While part of defining a form is to specify a schema for your form, you still maintain complete control over the layout in the form in your `render()` method, just like any other react app. The schema and presentation are entirely separate.  This React friendly approach makes it easy to build forms which dynamically change values or structure based on the current state of the form.

This library contains:

 * Low level forms control wrappers that communicate errors and missing values to parent components and style themselves appropriately for errors and missing value state. You can write your own in the same way. Supplied standard form controls:
    - Textedit
    - TextArea
    - Checkboxes
    - RadioButtons
    - Chooser (internally we use react-select)
    - TagsEdit (again using react-select)
    - DateEdit (react-datepicker)
 * A <Schema> component that lets you define the rules for each field. Each field is specified in a <Field> component
 * A <Forms> component that acts as a top level controlled input for all of the form state, to assemble controls together and track state change, errors and missing values and enabling dynamic forms with via a declarative schema
 * Higher Order Components:
    - for grouping of controls with their labels, required state and editing control
    - building lists of forms
 * Inline editing
 * List editing

The library is build on several other open source libraries, especially:
 * react
 * immutable.js
 * revalidator
 * react-bootstrap
 * react-select
 * react-virtualized
 * react-datepicker

Please browse the examples for a feel for the library, or read on to get started.

Getting Started
---------------

Install the forms library with npm:

    npm install react-dynamic-forms --save

Once installed, you can import the necessary components from the library:

    import {Form, Schema, Field, TextEdit, Chooser} from "react-dynamic-forms";


Anatomy of a form
-----------------

A form will contain:
 1. Your form's state
 2. A schema describing the form's fields
 3. Implementation of render() that specified controls for each form field
 4. Handling of form changes, missing values and errors
 5. Submit logic

Form State
----------

As the creator of the form, you bring the form's state to the table, either in the form of an initial value or previous state you're loaded up to be edited. The form state will be passed into the form via the `value` prop, and should be an Immutable.Map. In the examples, we just keep this on this.state, but a flux store or redux would be other options.

    const ContactForm = React.createClass({
        ...
        getInitialState() {
            return {
                value: Immutable.fromJS({
                    first_name: "Bill",
                    last_name: "Jones",
                    email: "bill@mail.com",
                }),
            };
        },
        ...
    });

Schema
------

A schema is specified using JSX to define the rules and meta data for each form field. As an example, here is a form that will take the first name, last name and email of a contact. The name here is the key for each value, so there would be corresponding keys in the form state (see initialValue above) and in the render of the form controls (see below). We can define also that the email should be of format `email` and that the first_name and last_name fields are `required`:

    const schema = (
        <Schema>
            <Field name="first_name" label="First name" required={true} validation={{"type": "string"}} />
            <Field name="last_name" label="Last name" required={true} validation={{"type": "string"}} />
            <Field name="email" label="Email" validation={{"format": "email"}} />
        </Schema>
    );

In ESDB, we actually derive the schema from information we get from our server.

Implementation of render()
--------------------------

We've found from experience that we want a separation between schema and presentation, so instead we lay out the form out in the form component's `render()` function, just like any other React component, but in a way that we refer to our schema attributes using an `field` prop on each control.


        render() {
            ...
            return (
                <Form
                    name="basic"
                    schema={schema}
                    value={this.state.value}
                    onChange={(fieldName, value) =>
                        this.setState({ value })}
                    onMissingCountChange={(fieldName, missing) =>
                        this.setState({ hasMissing: missing > 0 })}
                    onErrorCountChange={(fieldName, errors) =>
                        this.setState({ hasErrors: errors > 0 })}
                >
                    <TextEdit field="first_name" width={300} />
                    <TextEdit field="last_name" width={300} />
                    <TextEdit field="email" />
                    <hr />
                    <Button className="btn btn-default" onClick={() => handleSubmit()} disabled={disableSubmit} />
                </Form>
            );
        }
    });

Things to note here:

 * The schema is supplied to the Form with the `schema` prop
 * The current state of the form is supplied with the `value` prop.
 * The value is updated by listening to the `onChange` callback.
 * Value's state is potentially invalid, because it will at times likely reflect that the user has partially filled out a form (i.e. may contain missing values) or has filled out a field with an error. For this reason we listen to `onMissingCountChange` and `onErrorCountChange` to keep our form updated with respect to form validity.

Beyond this
-----------

Given what you know now, you should be ready to start building a form. Please also see the examples for how you can control the appearance of the form using tags specified in the schema as well as how to create lists.

Developing
----------

Within a forked repo, you first need to run:

    npm install

This will install the development dependencies into your node_modules directory.

You can then start up the test server, as well as automatic source building, by doing:

    npm run start-website

Then, point your browser to:

[http://localhost:8080/webpack-dev-server/](http://localhost:8080/webpack-dev-server/)

To build the lib directory, use:

    npm run build

License
-------

This code is distributed under a BSD style license, see the LICENSE file for complete information.

Copyright
---------

ESnet's React Dynamic Forms Library, Copyright (c) 2015-2017, The Regents of the University of California, through Lawrence Berkeley National Laboratory (subject to receipt of any required approvals from the U.S. Dept. of Energy). All rights reserved.

If you have questions about your rights to use or distribute this software, please contact Berkeley Lab's Technology Transfer Department at TTD@lbl.gov.

NOTICE. This software is owned by the U.S. Department of Energy. As such, the U.S. Government has been granted for itself and others acting on its behalf a paid-up, nonexclusive, irrevocable, worldwide license in the Software to reproduce, prepare derivative works, and perform publicly and display publicly. Beginning five (5) years after the date permission to assert copyright is obtained from the U.S. Department of Energy, and subject to any subsequent five (5) year renewals, the U.S. Government is granted for itself and others acting on its behalf a paid-up, nonexclusive, irrevocable, worldwide license in the Software to reproduce, prepare derivative works, distribute copies to the public, perform publicly and display publicly, and to permit others to do so.

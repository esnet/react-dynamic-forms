## Getting Started

Install the forms library with npm:

    yarn add react-dynamic-forms

Once installed, you can import the necessary components from the library:

    import { Form, Schema, Field, TextEdit, Chooser } from "react-dynamic-forms";

## Anatomy of a form

A form will contain:

*   Your form's state, described as an Immutable.Map
*   A schema describing the form's fields
*   Implementation of render() that specified controls for each form field
*   Handling of form changes, missing values and errors
*   Submit logic

## Form State

As the creator of the form, you bring the form's state to the table, either in the form of an initial value or previous state you're loaded up to be edited. The form state will be passed into the form via the Form's `value` prop, and should be an `Immutable.Map`. In the examples, we just keep this on `this.state`, but a flux store or redux would be other options.

Here we construct the initial state of the form containing three fields: `first_name`, `last_name` and `email` as an `Immutable.Map` and keep this is the current state of the form:

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

## Schema

A schema is specified using JSX to define the rules and meta data for each form field.

As an example, here is a form that will take the first name, last name and email of a contact. The name here is the field name for each value, so there would be corresponding keys in the form state (see the `getInitialState()` code above) and in the render of the form controls (see below). Alongside each field we define all the metadata we need associated with the field. For example we can define that the email should be of format `email` (validation rule) and that the `first_name` and `last_name` fields are `required` and need to be a `string`:

    const schema = (
        <Schema>
            <Field name="first_name" label="First name" required={true} validation={{"type": "string"}} />
            <Field name="last_name" label="Last name" required={true} validation={{"type": "string"}} />
            <Field name="email" label="Email" validation={{"format": "email"}} />
        </Schema>
    );

In our applications, we actually derive the schema from information we get from our database.

## Implementation of render()

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

Things to note here:

*   The schema is supplied to the `Form` with the `schema` prop
*   The current state of the form is supplied with the `value` prop.
*   The value is updated by listening to the `onChange` callback.
*   Value's state is potentially invalid, because it will at times likely reflect that the user has partially filled out a form (i.e. may contain missing values) or has filled out a field with an error. For this reason we listen to `onMissingCountChange` and `onErrorCountChange` to keep our form updated with respect to form validity.

## Beyond this

Given what you know now, you should be ready to start building a form. Please also see the examples for how you can control the appearance of the form using tags specified in the schema as well as how to create lists.

## Developing

Within a forked repo, you first need to run:

    lerna bootstrap

This will install the dependencies into both of the packages: react-dynamic-forms and the website. It will also link the website to the local source of the library.

You can then start up the test website by doing:

    npm run start

Then, point your browser to: [http://localhost:3000](http://localhost:3000/)

To build the lib directory, use:

    cd packages/react-dynamic-forms
    npm run build

## License

This code is distributed under a BSD style license, see the LICENSE file for complete information.

## Copyright

ESnet's React Dynamic Forms Library, Copyright (c) 2015-2018, The Regents of the University of California, through Lawrence Berkeley National Laboratory (subject to receipt of any required approvals from the U.S. Dept. of Energy). All rights reserved.

If you have questions about your rights to use or distribute this software, please contact Berkeley Lab's Technology Transfer Department at TTD@lbl.gov.

NOTICE. This software is owned by the U.S. Department of Energy. As such, the U.S. Government has been granted for itself and others acting on its behalf a paid-up, nonexclusive, irrevocable, worldwide license in the Software to reproduce, prepare derivative works, and perform publicly and display publicly. Beginning five (5) years after the date permission to assert copyright is obtained from the U.S. Department of Energy, and subject to any subsequent five (5) year renewals, the U.S. Government is granted for itself and others acting on its behalf a paid-up, nonexclusive, irrevocable, worldwide license in the Software to reproduce, prepare derivative works, distribute copies to the public, perform publicly and display publicly, and to permit others to do so.

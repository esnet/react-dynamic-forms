<img src="https://github.com/esnet/react-dynamic-forms/blob/react-15/src/website/img/forms.png" alt="logo" width="160px"/>

**NOTE: v0.17.0 adds support for React 15, but since the way Mixins work in React 15, this is a fairly substantial rewrite to provide an API that doesn't use Mixins at all.**

This repository contains a set of React based forms components which are used within ESnet for our network database application (ESDB), but could be used by any React based project needing to build complex forms.

Built on Immutable.js, it allows you to specify form schema while still allowing complete control over layout in the form render(). It makes it simple to track errors and missing values within a page, even within nested forms and lists. It also makes it easy to build forms which dynamically change values or structure based on the current state of the form.

This library contains:

 * Low level forms controls such as Textedit or Chooser (react-select)type controls that communicate errors and missing values to parent components and style themselves appropriately
 * A <Forms> component that acts as a top level controlled input to assemble controls together and track state change, errors and missing values and enabling dynamic forms with declarative schema
 * Higher Order Components for grouping of controls with their labels, required state and editing control and for building lists of forms
 * Inline editing
 * List and Key-Value editing

The library is build on several other open source libraries, especially:
 * react
 * immutable.js
 * revalidator
 * react-bootstrap
 * react-select

Please browse the examples for a feel for the library, or read on to get started.

Getting Started
---------------

Install the forms library with npm:

    npm install react-dynamic-forms --save

Once installed, you can import the necessary components from the library:

    import {Form, Schema, Field, TextEdit, Chooser} from "react-dynamic-forms";

A schema is specified using JSX to define the rules and meta data for each form fields. As an example, here is a form that will take the first name, last name and email of a contact. We can define also that the email should be of format `email` and that the first and last names are `required`:

    const schema = (
        <Schema>
            <Field name="first_name" label="First name" required={true} validation={{"type": "string"}} />
            <Field name="last_name" label="Last name" required={true} validation={{"type": "string"}} />
            <Field name="email" label="Email" validation={{"format": "email"}} />
        </Schema>
    );

We've found from experience that we want a separation between schema and presentation, so instead we lay out the form out in the form component's `render()` function, just like any other React component, but in a way that we refer to our schema attributes using an `field` prop. In ESDB, we actually derive the schema from information we get from our server. Here's an example:

    const initialValue = {
      first_name: "Bill",
      last_name: "Jones",
      email: "bill@gmail.com",
    };

    const ContactForm = React.createClass({
        ...
        getInitialState() {
            return {
                value: Immutable.fromJS(initialValue),
            };
        },
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
                    <input className="btn btn-default" type="submit" value="Submit" disabled={disableSubmit}/>
                </Form>
            );
        }
    });

Things to note here: The schema is supplied to the Form, along with the current state of the form `value`. Value always holds the current state of the form. As you can see it is supplied to the Form with the `value` prop and updated by listening to the `onChange` callback. Value's state is potentially invalid, because it will at times likely reflect that the user has partially filled out a form (i.e. may contain missing values) or has filled out a field with an error. For this reason we listen to `onMissingCountChange` and `onErrorCountChange` to keep our form updated with respect to if the form can be saved.


Developing
----------

The repository contains the examples website. This is very helpful in developing new functionality. Within a forked repo, you first need to run:

    npm install

This will install the development dependencies into your node_modules directory.

You can then start up the test server, as well as automatic source building, by doing:

    npm run start-website

Then, point your browser to:

[http://localhost:8080/webpack-dev-server/](http://localhost:8080/webpack-dev-server/)

Licence
-------

This code is distributed under a BSD style license, see the LICENSE file for complete information.

Copyright
---------

ESnet's React Dynamic Forms Library, Copyright (c) 2015-2017, The Regents of the University of California, through Lawrence Berkeley National Laboratory (subject to receipt of any required approvals from the U.S. Dept. of Energy). All rights reserved.

If you have questions about your rights to use or distribute this software, please contact Berkeley Lab's Technology Transfer Department at TTD@lbl.gov.

NOTICE. This software is owned by the U.S. Department of Energy. As such, the U.S. Government has been granted for itself and others acting on its behalf a paid-up, nonexclusive, irrevocable, worldwide license in the Software to reproduce, prepare derivative works, and perform publicly and display publicly. Beginning five (5) years after the date permission to assert copyright is obtained from the U.S. Department of Energy, and subject to any subsequent five (5) year renewals, the U.S. Government is granted for itself and others acting on its behalf a paid-up, nonexclusive, irrevocable, worldwide license in the Software to reproduce, prepare derivative works, distribute copies to the public, perform publicly and display publicly, and to permit others to do so.

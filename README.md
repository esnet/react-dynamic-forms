This repository contains a set of React based forms components which are used within the internal ESDB (ESnet Database) project, but could be used by any React based project. It allows you to specify schemas while still allowing complete control over layout in the render().

![Contact Editor](https://raw.githubusercontent.com/esnet/esnet-react-forms/master/screenshots/list.png)


This library contains four main pieces:

 * Low level forms widget wrappings such as textedit or chooser type controls that communicate errors and missing values to parent components
 * A forms mixin (FormMixin) to help you assemble controls together and track errors and missing values and enabling dynamic forms and declarative schemas
 * Helper wrappings (Group and friends) for the low level widget to use within the form mixin
 * List and Key-Value mixins editors

Please browse the examples for a feel for the library, or read on to get started.

Getting Started
---------------

Install the forms library with npm:

    npm install @esnet/react-forms --save

Once installed, you can import the necessary components from the library:

    var {Form, FormMixin, TextEditGroup,
         Schema, Attr, ChooserGroup} = require("@esnet/react-forms");

A schema can be specified to define the basic rules of each form fields. For example, here is a form that will take the first name, last name and email of a contact. We can define, for example, that the email should be of format `email` and that the first and last names are `required`:

    var schema = (
        <Schema>
            <Attr name="first_name" label="First name" placeholder="Enter first name"
                  required={true} validation={{"type": "string"}}/>
            <Attr name="last_name" label="Last name" placeholder="Enter last name"
                  required={true} validation={{"type": "string"}}/>
            <Attr name="email" label="Email" placeholder="Enter valid email address"
                  validation={{"format": "email"}}/>
        </Schema>
    );

We don't generate the form directly from the schema. We've found we want a separation, so instead you lay the form out in the form component's `render()` function like any other component, but refer to our schema using the `attr` prop:

    var ContactForm = React.createClass({

        mixins: [FormMixin],

        ...

        render() {
            ...
            return (
                <Form style={formStyle}>
                    <TextEditGroup attr="first_name" width={300} />
                    <TextEditGroup attr="last_name" width={300} />
                    <TextEditGroup attr="email" />
                    <hr />
                    <input className="btn btn-default" type="submit" value="Submit" disabled={disableSubmit}/>
                </Form>
            );
        }
    });

Finally use your new form:

    <ContactForm
        schema={schema}
        values={initialValues}
        onSubmit={this.handleSubmit}
        onChange={this.handleChange} />

This is just the beginning. The forms library is built to support dynamically changing the forms, building lists of forms, building key value pairs and will track all errors and unfilled required fields automatically.

Developing
----------

The repo contains the examples website. This is very helpful in developing new functionality. Within a cloned repo, you first need to run:

    npm install

This will install the development dependencies into your node_modules directory.

You can then start up the test server, as well as automatic source building, by doing:

    npm start-website

Then, point your browser to:

[http://localhost:8080/webpack-dev-server/](http://localhost:8080/webpack-dev-server/)

Licence
-------

This code is distributed under a BSD style license, see the LICENSE file for complete information.

Copyright
---------

ESnet's React Forms Library, Copyright (c) 2015, The Regents of the University of California, through Lawrence Berkeley National Laboratory (subject to receipt of any required approvals from the U.S. Dept. of Energy). All rights reserved.

If you have questions about your rights to use or distribute this software, please contact Berkeley Lab's Technology Transfer Department at TTD@lbl.gov.

NOTICE. This software is owned by the U.S. Department of Energy. As such, the U.S. Government has been granted for itself and others acting on its behalf a paid-up, nonexclusive, irrevocable, worldwide license in the Software to reproduce, prepare derivative works, and perform publicly and display publicly. Beginning five (5) years after the date permission to assert copyright is obtained from the U.S. Department of Energy, and subject to any subsequent five (5) year renewals, the U.S. Government is granted for itself and others acting on its behalf a paid-up, nonexclusive, irrevocable, worldwide license in the Software to reproduce, prepare derivative works, distribute copies to the public, perform publicly and display publicly, and to permit others to do so.

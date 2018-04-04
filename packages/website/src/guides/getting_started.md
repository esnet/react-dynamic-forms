## Getting Started

Install the forms library with npm:

    yarn add react-dynamic-forms

Once installed, you can import the necessary components from the library:

    import { Form, Schema, Field, TextEdit, Chooser } from "react-dynamic-forms";

Keep reading for a simple example to get you going.

## Working example

Below is a walk though of creating a simple form. If you are integration a form into an existing React app, you can skip this section.

Otherwise, to get started from scratch we'll create a basic app with create-react-app (this assumes you have node.js installed):

```
$ npm install -g create-react-app
$ create-react-app simple-form
$ cd simple-form
```

You will be about to run the app created by running

```
$ npm run start
```

You should see a webpage with a spinning react logo. We'll ditch the spinning logo code in a moment and replace it with a basic form.

## Example dependencies

In the example we have three dependencies we need to install:

*   react-dynamic-forms (of course)
*   immutable.js (which we use for form state)
*   react-bootstrap (which is optional, but will style our page)

We install those with yarn:

```
$ yarn add react-dynamic-forms immutable react-bootstrap
```

Or you can do it with npm

```
$ npm install react-dynamic-forms immutable react-bootstrap --save
```

As mentioned above you don't really need react-bootstrap, but the forms will look very 1995 if you don't bring in some styling. As part of Bootstrap you need to bring in the Bootstrap CSS old school. To do this open **public/index.html**
and paste in this next to the other Link tags:

```
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u"
crossorigin="anonymous">
```

This loads the Bootstrap CSS from a CDN.

Now onto the form itself...

## Imports

Open up src/App.js. This is where the code is that made the spinning logo placeholder page.

First we'll replace the imports in there with our own set:

```js
import React, { Component } from "react";
import { Form, Schema, Field, TextEdit, FormEditStates } from "react-dynamic-forms";
import Immutable from "immutable";
import { Grid, Row, Col, Button } from "react-bootstrap";
```

## Schema

The schema for the form defines what each field that makes up our form. Below the imports add a `schema`:

```js
const schema = (
    <Schema>
        <Field
            name="first_name"
            label="First name"
            required={true}
            validation={{ type: "string" }}
        />
        <Field name="last_name" label="Last name" required={true} validation={{ type: "string" }} />
        <Field name="email" label="Email" validation={{ format: "email" }} />
    </Schema>
);
```

This creates a schema object that tells us some properties of three fields. The first and last name will be validated to be a string and are required on the form. The email needs to be a valid email format but isn't required.

## Replace the component

Replace `class App...` with the some new code:

```
class App extends Component {
    constructor() {
        super();
        this.state = {
            hasMissing: false,
            hasErrors: false,
            value: Immutable.Map({
                first_name: "Bob",
                last_name: "Smith",
                email: "bob@gmail.com"
            })
        };
    }

    handleSubmit() {
        this.setState({ submit: true });
    }

    render() {
        <div>
            Form will go here
        </div>
    }
}
```

## Anatomy of a form

A form will contain:

*   Your form's state, described as an Immutable.Map (see [Immutable.js](https://facebook.github.io/immutable-js/docs/#/))
*   A schema describing the form's fields (which we've already added)
*   Implementation of `render()` that lays out the form with controls for each form field
*   Handling of form changes, missing values and errors
*   Submit logic

## Form State

As the creator of the form, you bring the form's state to the table, either in the form of an initial value or previous state you're loaded up to be edited. The form state will be passed into the form via the Form's `value` prop as we'll see, and should be an `Immutable.Map`. In the examples, we just keep this on `this.state`, but a flux store or redux would be other options.

Here we construct the initial state of the form containing three fields: `first_name`, `last_name` and `email` as an `Immutable.Map`. These correspond to the field names in the Schema. In this example we'll keep these on the component state. Replace the constructor with the following code, which adds in initial component state. Specifically note the `value` (this.state.value) which we set to an Immutable.Map with our initial form state in it:

```js
constructor() {
    super();
    this.state = {
        hasMissing: false,
        hasErrors: false,
        value: Immutable.Map({
            first_name: "Bob",
            last_name: "Smith",
            email: "bob@gmail.com"
        })
    };
}
```

Also in our initial state is `hasMissing` and `hasErrors`. We'll come back to these, but they hold the current state of the form in terms of if there's errors or missing values.

## Implementation of render()

We've found from experience that we want a separation between schema and presentation, so instead we lay out the form in the Component's `render()` function, just like any other React component, but in a way that we refer to our schema attributes using an `field` prop on each control.

Replace the component render function with the following code, then we'll walk through it:

```js
render() {
    const { hasMissing, hasErrors } = this.state;
    const disableSubmit = hasMissing || hasErrors;
    return (
        <Grid>
            <Row>
                <Col md={12}>
                    <h1>Contact form</h1>
                </Col>
            </Row>

            <Row>
                <Col md={12}>
                    <Form
                        name="basic"
                        schema={schema}
                        value={this.state.value}
                        edit={this.state.submit ? FormEditStates.NEVER : FormEditStates.ALWAYS}
                        labelWidth={100}
                        onChange={(fieldName, value) => this.setState({ value })}
                        onMissingCountChange={(fieldName, missing) =>
                            this.setState({ hasMissing: missing > 0 })
                        }
                        onErrorCountChange={(fieldName, errors) =>
                            this.setState({ hasErrors: errors > 0 })
                        }
                    >
                        <TextEdit field="first_name" width={200} />
                        <TextEdit field="last_name" width={200} />
                        <TextEdit field="email" width={500} />
                        {!this.state.submit ? (
                            <Button
                                className="btn btn-success"
                                style={{ marginLeft: 130, marginTop: 10 }}
                                onClick={() => this.handleSubmit()}
                                disabled={disableSubmit}
                            >
                                Submit
                            </Button>
                        ) : (
                            <div />
                        )}
                    </Form>
                </Col>
            </Row>
            <Row>
                <Col md={12} style={{ marginTop: 50 }}>
                    <h3>Current value</h3>
                    <pre>{JSON.stringify(this.state.value.toJS(), null, 3)}</pre>
                    <p>hasMissing is {JSON.stringify(this.state.hasMissing)}</p>
                    <p>hasErrors is {JSON.stringify(this.state.hasErrors)}</p>
                </Col>
            </Row>
        </Grid>
    );
}
```

Things to note here:

`Grid`, `Row` and `Col` are react-bootstrap helping us to lay this out in a grid on the page. Just consider them `divs` with some styling attached. The interesting part is within the second row where we define the Form itself

```jsx
<Form
    name="basic"
    schema={schema}
    value={this.state.value}
    edit={this.state.submit ? FormEditStates.NEVER : FormEditStates.ALWAYS}
    labelWidth={100}
    onChange={(fieldName, value) => this.setState({ value })}
    onMissingCountChange={(fieldName, missing) => this.setState({ hasMissing: missing > 0 })}
    onErrorCountChange={(fieldName, errors) => this.setState({ hasErrors: errors > 0 })}
>
    ... controls
</Form>
```

Here's what's going on here:

*   The `name` prop helps us if we have multiple forms on a page, but is less important here
*   The `Schema` we defined earlier is supplied to the `Form` with the `schema` prop
*   The current state of the form is supplied with the `value` prop, which is what we gave an initial value in our constructor
*   The `value` is updated by listening to the `onChange()` callback, which sets the new form state onto `this.state.value`
*   The `edit` state is either `FormEditStates.ALWAYS` meaning all fields are always editable, or `FormEditStates.NEVER` for a view only rendering of the form after the user submits it. You can also enable inline editing with `FormEditStates.SELECTED`. `this.state.submit` will be set when we handle the user clicking the Submit button
*   The `labelWidth` prop tells the form to give 100 pixels space to the labels for each control
*   Value's state is potentially invalid, because it will at times likely reflect that the user has partially filled out a form (i.e. may contain missing values) or has filled out a field with an error. For this reason we listen to `onMissingCountChange()` and `onErrorCountChange()` to keep our form updated with respect to form validity. These set `this.state.hasMissing` and `this.state.hasErrors` respectively.

## The form controls

Within each <Form> are the form layout itself. You can mix in Form controls like the TextEdit controls here, along with any other JSX. In this way you have complete control on what gets displayed. One such control is the one for the `first_name` field:

```jsx
<TextEdit field="first_name" width={200} />
```

As you can see this control is linked to its `Schema` field with the `field` prop "first_name", so when this renders it will get the "First name" label, be validated to be a string, and will be required. This binding is fundamental to how the forms library works.

## Submit logic

We also provide a Submit button in our render() function.

```jsx
    <Button ... onClick={() => this.handleSubmit()} disabled={disableSubmit}>
        Submit
    </Button>
```

Two things going on here: firstly we handle `onClick()` by calling `this.handleSubmit()`. We can added this method into our component when we first replaced the placeholder App component:

```js
    handleSubmit() {
        this.setState({ submit: true });
    }
```

Secondly we disable the button if there are errors or missing values on the form. This logic was added to the first two lines of the render function:

```
const { hasMissing, hasErrors } = this.state;
const disableSubmit = hasMissing || hasErrors;
```

In a real application this is where you would send the new state to the server for persistence of the form. That logic is up to you.

## Beyond this

Given what you know now, you should be ready to start building any type of form. Please also see the examples for more advanced usage such as how you can control the appearance of the form using tags specified in the schema (the dynamic part of react-dynamic-forms) as well as how to create compound forms such as lists.

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

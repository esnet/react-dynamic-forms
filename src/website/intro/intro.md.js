export default `

React Dynamic Forms
-------------------

---

This library contains a set of React based forms components which are used within ESnet for our network database application (ESDB), but could be used by any React based project needing to build complex forms. It allows you to specify form schema while still allowing complete control over layout in the form render(). It makes it simple to track errors and missing values within a page. And it makes it easy to build forms which dynamically change based on the current state of the form.

This library contains four main pieces:

 * Low level forms widget wrappings such as textedit or chooser type controls that communicate errors and missing values to parent components
 * A forms mixin (FormMixin) to help you assemble controls together and track errors and missing values and enabling dynamic forms and declarative schemas
 * Helper wrappings (Group and friends) for the low level widgets
 * List and Key-Value mixins editors

The library is build on several other open source libraries, especially:
 * react
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

A schema is specified using JSX to define the rules and meta data for each
form fields. As an example, here is a form that will take the first name,
last name and email of a contact. We can define also that the email
should be of format \`email\` and that the first and last names are \`required\`:

    const schema = (
        <Schema>
            <Field name="first_name" label="First name" required={true} validation={{"type": "string"}} />
            <Field name="last_name" label="Last name" required={true} validation={{"type": "string"}} />
            <Field name="email" label="Email" validation={{"format": "email"}} />
        </Schema>
    );

We've found from experience that we want a separation between schema and
presentation, so instead we lay out the form out in the form component's
\`render()\` function, just like any other React component, but in a way
that we refer to our schema attributes using an \`field\` prop. In ESDB,
we actually derive the schema from information we get from our server.
Here's an example:

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

Things to note here: The schema is supplied to the Form, along with the current
state of the form \`value\`. Value always holds the current state of the form.
As you can see it is supplied to the Form with the \`value\` prop and updated by
listening to the \`onChange\` callback. Value's state is potentially invalid, because
it will at times likely reflect that the user has partially filled out a form (i.e.
may contain missing values) or has filled out a field with an error. For this reason
we listen to \`onMissingCountChange\` and \`onErrorCountChange\` to keep our form
updated with respect to if the form can be saved.
`;

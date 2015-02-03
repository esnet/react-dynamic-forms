###Forms example###

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
        </Schema>
    );

As you can see the schema is used to associate the Attr name ("first_name" for example) with some properties which define how it looks and what is a valid value for that Attr. Here we define a label ("First name"), a placeholder text, and some validation properties. Required can be set true to have the form track that this Attr field needs to be filled out before the form is submitted. More on errors and missing value counts below. In addition to being required or not, the Attr can have a validation prop set which will be passed to Revalidator for field validation while the user interacts with the form. It is most common to use it to specify the type ("string", "integer", or "number"), but you can also specify a format, such as in the example above where the email Attr is checked to make sure it is a valid email address. Maximum string lengths, or ranges of numeric values can also be specified. For full details see the [Revalidator website](https://github.com/flatiron/revalidator).

Rendering is not automatic. Instead the form itself is a React component that you define. This React component will need to use the **FormMixin** to get the proper behavior, as well as implement a layout of the form widgets with special render method called `renderForm()`.

We define the form itself like this:

    var ContactForm = React.createClass({

        mixins: [FormMixin],

And then implement the form layout like this:

        renderForm: function() {
            var disableSubmit = this.hasErrors();
            return (
                <Form>
                    <TextEditGroup attr="first_name" width={300} />
                    <TextEditGroup attr="last_name" width={300} />
                    <TextEditGroup attr="email" width={500} />
                    <hr />
                    <input className="btn btn-default" type="submit" value="Submit" disabled={disableSubmit}/>
                </Form>
            );
        }

As you can see, we return a `<Form>` element which contains further JSX, which is a convenience. In fact, you can define this with a `<form>` too. You can use any JSX in here to render the form however you like. This makes the layout of the form as flexable as any other React code.

The special elements here are the `TextEditGroup`s. They specify an `attr` prop which references the schema (we'll see how to get the schema hooked up in a minute). Each TextEditGroup will generate a label and a form control (in this case a `TextEdit`). We use Bootstrap for the layout. In addition to TextEditGroups there's also: `TextAreaGroup`, `ChooserGroup`, `OptionsGroup` and `TagsGroup`. You can also wrap your own controls in the generic `Group`.

Now that we have out form it's time to use it. Typically the form will be contained (rendered by) another React component which will hold the buisness logic of sourcing the schema and initial values, as well as handling the submit of the form in some way.

To render the form we created above we need to pass in the initial values and schema. Here is the key part of render function for this page's example:

        render: function() {
            ...
            <ContactForm schema={schema} values={values} onSubmit={this.handleSubmit}/>
            ...
        }

Note that the schema is required, so you cannot render the form until one is available. If this is being loaded from the server you would display a Spinner until it is available.

Currently values can only be passed in once. After that they will always be the initial state of the form. Changing values in later renders of the form will not change the form.


---

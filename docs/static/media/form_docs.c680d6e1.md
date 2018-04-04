### Forms example

The forms library is designed to help you build a complete form. In this example
we create a simple contacts form. There are other examples too of forms which change
their structure as the user interacts with tham, as well as demostrating the use
of lists within the forms. But here we keep it relatively simple.

**What do we want from our form?**

Essentially we want to provide perhaps some initial data, our form `"value"`, 
defaults in the case of a new form, or maybe our current
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

Okay, so we have initial values and we have some callbacks.

**How do we get a form up and running to use those?**

Forms have two concerns. Each form has a schema which we use to provide the meta
data for fields within the form. This includes UI elements like the label for each
fields, the placeholder text, etc, but also rules around the field itself. For
example a field (called an Field in this library),

The form elements are defined by a **schema**. Schemas can be defined with JSX or manually. Here's the schema used in this page:

    const schema = (
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

As you can see the schema is used to associate the Field name (`"first_name"` for example) with some properties which define how it looks and what is a valid value for that Field. Here we define a label (`"First name"`), a placeholder text, and some validation properties. Required can be set true to have the form track that this Field field needs to be filled out before the form is submitted. More on errors and missing value counts below. In addition to being required or not, the Field can have a validation prop set which will be passed to Revalidator for field validation while the user interacts with the form. It is most common to use it to specify the type (`"string", "integer", or "number"`), but you can also specify a format, such as in the example above where the email Field is checked to make sure it is a valid email address. Maximum string lengths, or ranges of numeric values can also be specified. For full details see the [Revalidator website](https://github.com/flatiron/revalidator).

Rendering is not automatic. Instead the form itself is a React component that you define. We define the form itself like this:

    class ContactForm extends React.Component {

    }

And then implement the form layout like this:

    renderForm() {
        const disableSubmit = this.hasErrors();
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

As you can see, we return a `<Form>` element which contains further JSX, which is a convenience. In fact, you can define this with a `<form>` too. You can use any JSX in here to render the form however you like. This makes the layout of the form as flexible as any other React code.

The special elements here are the `TextEdit`s. They specify an `field` prop which references the schema (we'll see how to get the schema hooked up in a minute). Each TextEditGroup will generate a label and a form control (in this case a `TextEdit`). We use Bootstrap for the layout. In addition to TextEditGroups there's also: `TextAreaGroup`, `ChooserGroup`, `OptionsGroup` and `TagsGroup`. You can also wrap your own controls in the generic `Group`.

Now that we have out form it's time to use it. Typically the form will be contained (rendered by) another React component which will hold the business logic of sourcing the schema and initial values, as well as handling the submit of the form in some way.

To render the form we created above we need to pass in the initial values and schema. Here is the key part of render function for this page's example:

    render: function() {
        ...
        <ContactForm 
            schema={schema} 
            values={values} 
            onSubmit={this.handleSubmit}
        />
        ...
    }

Note that the schema is required, so you cannot render the form until one is available. If this is being loaded from the server you would display a Spinner until it is available.

---
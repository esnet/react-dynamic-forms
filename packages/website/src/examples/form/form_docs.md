### About

This shows a simple contact form that demonstrates most of the low level controls you can use in the forms library. In this form the schema and values of the form are loaded at some future time (just using `setTimeout()` in this demo), such as if they were read from a REST API. The form shows two modes:

-   full form editing
-   inline editing

The form starts off in full edit mode. If you "Save" the form, it will show it in the inline editing mode. This mode would be used like a view, only the user can make single line changes to the values by hovering over the item and clicking the pencil icon. To get back to the full form editing mode you press the "Edit" button.

Under the action buttons is the data the user code sees (i.e. the Immutable Map) and the currently states: missing and errors. These two values are reported continuously by the form and can be used to block user submission until the issue is fixed.

### Walk through

The forms library is designed to help you build a complete form, rather than use the individual controls by themselves. In this example we create a contacts form.

See other examples for forms which change their structure as the user interacts with them, as well as demonstrating the use of lists within the forms. But here we keep it relatively simple.

### Form requirements

Let's first look at what we need from our form:

1. **Initial state**. This will be the form's defaults in the case of a new form, or our current database state in the case of editing an existing entity.

2. **Track form changes**. As the user edits the data, we'll want to track that. We may choose to save it on submit (if it's a new form, that's likely), or save it as the user edits it (perhaps if they are using inline editing we might want to save the data when any fields are changed). This depends on your requirements. Either way, the forms library allows you to provide a callback function, which will be called whenever the values in the form change. How you want to respond to that is up to you, but this example demonstrates one possible approach.

3. **Error and missing values**. We do this via callbacks as well, where each callback will tell you the number of missing or empty fields that exist within the form. You can use that to control if the user can submit the form or not, as we do in this example.

Okay, so we have initial values and we have some callbacks. Now to build a form.

### Building the form

Forms have two concerns:

1. The form schema
2. The form render

#### Form Schema

Each form has a `Schema` which we use to provide the meta data for fields within the form. This includes UI elements like the `label` for each fields, the `placeholder` text, etc, but also validation rules around the field itself.

Schemas can be defined with JSX or manually. Here's the schema used in this page:

```js
const schema = (
    <Schema>
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
            validation={{ format: "email" }}
        />
        <Field name="birthdate" label="Birthdate" required={true} />
    </Schema>
);
```

As you can see the schema is used to associate the `<Field>` `name` (`first_name` for example) with some properties which define how it looks and what is a valid value for that Field.

Here, for each field, we define:

-   a `label` text
-   a `placeholder` text
-   a `validation` properties
-   a `required` flag

Some quick notes on these: firstly, `required` can be set `true` to have the form track that this field needs to be filled out before the form is submitted (More on errors and missing value counts below.) Secondly, in addition to being required or not, the `Field` can have a `validation` prop set which will be passed to the "Revalidator" library for field validation while the user interacts with the form. It is most common to use it to specify the type ("string", "integer", or "number"), but you can also specify a format, such as in the example above where the `email` field is checked to make sure it is a valid email address. Maximum string lengths, or ranges of numeric values can also be specified. For full details see the [Revalidator website](https://github.com/flatiron/revalidator).

#### Form render

Now that we have a schema we should have a form. Not so much. This library separates the presentation of the form from the schema. This fits in with React as you can use regular React `render()` code to render the form but with the addition that when you render a control you refer to the field name in the schema to add this information into the control.

We define the form itself like this:

```js
    class ContactForm extends React.Component {
        render() {
            return (
                ...
            )
        }
    }
```

And then implement the form `render()` like this:

```js
render() {
    const disableSubmit = this.hasErrors();
    return (
            return (
                <Form
                    name="basic"
                    style={style}
                    schema={schema}
                    value={this.state.value}
                    edit={this.state.editMode}
                    labelWidth={200}
                    onSubmit={this.handleSubmit}
                    onChange={(formName, value) => this.handleChange(formName, value)}
                    onMissingCountChange={(fieldName, missing) =>
                        this.setState({ hasMissing: missing > 0 })}
                    onErrorCountChange={(fieldName, errors) =>
                        this.setState({ hasErrors: errors > 0 })}
                >
                    <TextEdit field="first_name" width={300} />
                    <TextEdit field="last_name" width={300} />
                    <TextEdit
                        field="email"
                        width={400}
                        view={value => {
                            return (
                                <a>
                                    {value}
                                </a>
                            );
                        }}
                    />
                    ...
                </Form>
            );
    );
}
```

As you can see, we return a `<Form>` element which contains further JSX. You can use any JSX in here to render the form however you like. This makes the layout of the form as flexible as any other React code.

Let's walk through the important parts of this example:

1.  we provide the `schema` to the `Form` as a prop. This tells the form to expect fields contained in the schema provided.

2.  we provide the current state of the `Form` by providing the `value` prop. Initially this is the default state or loaded state of the form, but as the user changes the form it will reflect the current state. `value` is an Immutable.JS Map that we typically keep in component state (`this.state.value`) and update via the form callback (`onChange()`).

3.  we provide the mode the form is in, which can be view only (NEVER), view with inline editing (SELECTED) or a fully editable (ALWAYS)

4.  we provide the actual controls. Let's look at the `TextEdit`s as an example. They specify an `field` prop which references the schema `Field`'s `name`. Each `TextEdit` will generate a label and a corresponding form control (in this case a single line text edit control). There's a useful set of controls provided with the library which are built mostly on Bootstrap standard controls.

5.  we provide callback for important changes to the form. `onChange()` gives continuous changes to the form. These need to be passed back down into the form (the form is "controlled"). `onMissingCountChange()` and `onErrorCountChange()` gives us notification of how many missing fields and errors are in our form at any given moment. These include errors inside sub forms and lists of forms etc. You can use the states of these to give feedback to the user and block the user from submitting.

6.  finally we provide an onSubmit callback which tells us the user submitted the form. Given you have the onChange callback you could also save continuously. It depends on the user experience you want.

#### Using the form

Now that we have our `ContactForm` it's time to use it. Typically the form will be contained (rendered by) another React component which will hold the business logic of sourcing the `schema` and providing initial values, as well as handling the submit of the form in some way.

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

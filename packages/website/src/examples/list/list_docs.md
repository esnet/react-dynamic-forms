### List example

To create a list that can be added and removed, the Forms library provides a ListEditorMixin.

The first step is to create the item itself. The item can be a form itself (i.e. use the FormMixin) but it doesn't have to be. If it is, values, as well as error and missing count information will flow up to the List itself. In the case of this example we do have a little form that asks for the email address and email type. In that case we specify a schema and a form component to render that form:

    var emailSchema = (
        <Schema>
            <Attr name="email" defaultValue="" label="Email" required={true} validation={{"format": "email"}}/>
            <Attr name="email_type" defaultValue={1} label="Type" required={true}/>
        </Schema>
    );

    /**
    * Renders a form for entering an email address
    */
    var EmailItemEditor = React.createClass({

        mixins: [FormMixin],

        renderForm: function() {
            var id = this.value("email_type");
            return (
                <div>
                    <ChooserGroup attr="email_type"
                                initialChoice={id}
                                initialChoiceList={emailTypes}
                                disableSearch={true}
                                width={100} />
                    <TextEditGroup attr="email" width={300} />
                </div>
            );
        }
    });

Having defined that, we can now use it in the list itself:

    var EmailListEditor = React.createClass({

        mixins: [ListEditorMixin],

        /** Set initial items */
        initialItems: function() {
            return this.props.emails || [];
        },

        /** Create a new item */
        createItem: function() {
            return {
                "email": "",
                "email_type": 1
            };
        },

        /** Render one of the items */
        renderItem: function(item) {
            return (
                <EmailItemEditor schema={emailSchema}
                                values={item} />
            );
        },
    });

Here we see the main pieces of the API:

* `initialItems()` is used to populate the initial list, which in this case we pass in as a prop from the larger contact form. It is an array of objects, each object containing the `email` and `email_type`.

* `createItem()` is the new item creation function. This is called when the [+] button is pressed. It is expected to return an object representing the new item of the list. In this case we create an empty email and a default type.

* `renderItem()` is called to render each item. It will be called for each item as the list itself renders. Passed in is the item to render. In our case we return an instance of our `EmailItemEditor` form, passing in the item as the values for the form.

Finally, to use the `EmailListEditor` in our main form's `renderForm()` we surround it with a <Group> like so:

    <Group attr="emails" >
        <EmailListEditor emails={emails}/>
    </Group>

---
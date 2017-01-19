/**
 *  Copyright (c) 2015, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import React from "react";
import Markdown from "react-markdown";
import { Alert } from "react-bootstrap";
import Highlighter from "../Highlighter";

import Attr from "../../../src/components/Attr";
import ChooserGroup from "../../../src/components/ChooserGroup";
import Form from "../../../src/components/Form";
import FormMixin from "../../../src/components/FormMixin";
import Group from "../../../src/components/Group";
import ListEditorMixin from "../../../src/components/ListEditorMixin";
import Schema from "../../../src/components/Schema";
import TextEditGroup from "../../../src/components/TextEditGroup";

const text = `
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
    const EmailItemEditor = React.createClass({

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

    const EmailListEditor = React.createClass({

        mixins: [ListEditorMixin],

        /**  Set initial items */
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

* \`initialItems()\` is used to populate the initial list, which in this case we pass in as a prop from the larger contact form. It is an array of objects, each object containing the \`email\` and \`email_type\`.

* \`createItem()\` is the new item creation function. This is called when the [+] button is pressed. It is expected to return an object representing the new item of the list. In this case we create an empty email and a default type.

* \`renderItem()\` is called to render each item. It will be called for each item as the list itself renders. Passed in is the item to render. In our case we return an instance of our \`EmailItemEditor\` form, passing in the item as the values for the form.

Finally, to use the \`EmailListEditor\` in our main form's \`renderForm()\` we surround it with a <Group> like so:

    <Group attr="emails" >
        <EmailListEditor emails={emails}/>
    </Group>

---

`;

const description = `
This shows an example form with a list of emails that can be added or removed.
`;

const emailTypes = [ { id: 1, label: "Work" }, { id: 2, label: "Home" } ];

const emailSchema = (
    <Schema>
        <Attr name="key" />
        <Attr
            name="email"
            defaultValue=""
            label="Email"
            required={true}
            validation={{ format: "email" }}
        />
        <Attr name="email_type" defaultValue={1} label="Type" required={true} />
    </Schema>
);

/**
 * Renders a form for entering an email address
 */
const EmailItemEditor = React.createClass({
    mixins: [ FormMixin ],
    renderForm() {
        const id = this.value("email_type");
        return (
            <div>
                <ChooserGroup
                    key={id}
                    attr="email_type"
                    initialChoice={id}
                    initialChoiceList={emailTypes}
                    disableSearch={true}
                    width={150}
                />
                <TextEditGroup attr="email" width={300} />
            </div>
        );
    }
});

/**
 * Renders a list of emails that can be edited. Each item in the list is a EmailItemEditor.
 */
const EmailListEditor = React.createClass({
    mixins: [ ListEditorMixin ],
    /**  Set initial items */
    initialItems() {
        return this.props.emails || [];
    },
    /** Create a new item */
    createItem() {
        return { email: "", email_type: 1 };
    },
    /** Render one of the items */
    renderItem(item) {
        return (
            <EmailItemEditor
                schema={emailSchema}
                values={item}
                showRequired={this.props.showRequired}
            />
        );
    }
});

const schema = (
    <Schema>
        <Attr
            name="first_name"
            label="First name"
            placeholder="Enter first name"
            required={true}
            validation={{ type: "string" }}
        />
        <Attr
            name="last_name"
            label="Last name"
            placeholder="Enter last name"
            required={true}
            validation={{ type: "string" }}
        />
        <Attr name="emails" label="Emails" />
    </Schema>
);

const values = {
    first_name: "Bill",
    last_name: "Jones",
    emails: [
        { email: "b.jones@work.com", email_type: 1 },
        { email: "bill@gmail.com", email_type: 2 }
    ]
};

/**
 * Edit a contact
 */
const ContactForm = React.createClass({
    mixins: [ FormMixin ],
    displayName: "ContactForm",
    /**
     * Save the form
     */
    handleSubmit(e) {
        e.preventDefault();

        // Example of checking if the form has missing values and turning required On
        if (this.hasMissing()) {
            this.showRequiredOn();
            return;
        }

        // Example of fetching current and initial values
        console.log("values:", this.getValues());

        if (this.props.onSubmit) {
            this.props.onSubmit(this.getValues());
        }
    },
    renderForm() {
        const disableSubmit = this.hasErrors();
        const style = { background: "#FAFAFA", padding: 10, borderRadius: 5 };
        const emails = this.value("emails");

        return (
            <Form style={style} ref="form" attr="contact-form">
                <TextEditGroup attr="first_name" width={300} />
                <TextEditGroup attr="last_name" width={300} />
                <Group attr="emails">
                    <EmailListEditor emails={emails} />
                </Group>
                <hr />
                <input
                    className="btn btn-default"
                    type="submit"
                    value="Submit"
                    disabled={disableSubmit}
                />
            </Form>
        );
    }
});

export default React.createClass({
    mixins: [ Highlighter ],
    getInitialState() {
        return { data: undefined, loaded: false };
    },
    componentDidMount() {
        // Simulate ASYNC state update
        setTimeout(
            () => {
                this.setState({ loaded: true });
            },
            0
        );
    },
    handleSubmit(value) {
        this.setState({ data: value });
    },
    handleAlertDismiss() {
        this.setState({ data: undefined });
    },
    renderAlert() {
        if (this.state && this.state.data) {
            const firstName = this.state.data["first_name"];
            const lastName = this.state.data["last_name"];
            const emailList = this.state.data["emails"];
            return (
                <Alert
                    bsStyle="success"
                    onDismiss={this.handleAlertDismiss}
                    style={{ margin: 5 }}
                >
                    <strong>Success!</strong>{firstName}{
                        lastName
                    } was submitted with {emailList.length}email(s).
                </Alert>
            );
        } else {
            return null;
        }
    },
    renderContactForm() {
        if (this.state.loaded) {
            return (
                <ContactForm
                    schema={schema}
                    values={values}
                    onSubmit={this.handleSubmit}
                />
            );
        } else {
            return <div style={{ marginTop: 50 }}><b>Loading...</b></div>;
        }
    },
    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <h3>List example</h3>
                        <div style={{ marginBottom: 20 }}>{description}</div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-9">
                        {this.renderContactForm()}
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-9">
                        {this.renderAlert()}
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div
                            style={
                                {
                                    borderTopStyle: "solid",
                                    borderTopColor: "rgb(244, 244, 244)",
                                    paddingTop: 5,
                                    marginTop: 20
                                }
                            }
                        >
                            <Markdown source={text} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
})


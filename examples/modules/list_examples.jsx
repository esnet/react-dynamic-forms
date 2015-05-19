"use strict";

var React = require("react/addons");
var _ = require("underscore");
var Markdown = require("react-markdown-el");
var {Alert} = require("react-bootstrap");

var {Form,
     FormMixin,
     ListEditorMixin,
     TextEditGroup, Group, ChooserGroup,
     Schema, Attr} = require("../../entry");

var text        = require("raw!../markdown/list_examples.md");
var description = "This shows an example form with a list of emails that can be added or removed.";

var emailTypes = [
    {"id": 1, "label": "Work"},
    {"id": 2, "label": "Home"}
];

var emailSchema = (
    <Schema>
        <Attr name="key" />
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
                <ChooserGroup key={id}
                              attr="email_type"
                              initialChoice={id}
                              initialChoiceList={emailTypes}
                              disableSearch={true}
                              width={100} />
                <TextEditGroup attr="email" width={300} />
            </div>
        );
    }
});

/**
 * Renders a list of emails that can be edited. Each item in the list is a EmailItemEditor.
 */
var EmailListEditor = React.createClass({

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
                             values={item}
                             showRequired={this.props.showRequired}/>
        );
    },
});

var schema = (
    <Schema>
        <Attr name="first_name" label="First name" placeholder="Enter first name" required={true} validation={{"type": "string"}}/>
        <Attr name="last_name" label="Last name" placeholder="Enter last name" required={true} validation={{"type": "string"}}/>
        <Attr name="emails" label="Emails"/>
    </Schema>
);

var values = {
    "first_name": "Bill",
    "last_name": "Jones",
    "emails": [
        {"email": "b.jones@work.com", "email_type": 1},
        {"email": "bill@gmail.com", "email_type": 2},
    ]
};

/**
 * Edit a contact
 */
var ContactForm = React.createClass({

    mixins: [FormMixin],

    displayName: "ContactForm",

    /**
     * Save the form
     */
    handleSubmit: function(e) {
        e.preventDefault();

        //Example of checking if the form has missing values and turning required On
        if (this.hasMissing()) {
            this.showRequiredOn();
            return;
        }

        //Example of fetching current and initial values
        console.log("values:", this.getValues());

        this.props.onSubmit && this.props.onSubmit(this.getValues());
    },

    renderForm: function() {
        var disableSubmit = this.hasErrors();
        var formStyle = {background: "#FAFAFA", padding: 10, borderRadius:5};
        var emails = this.value("emails");

        return (
            <Form style={formStyle} ref="form" attr="contact-form">

                <TextEditGroup attr="first_name" width={300} />
                <TextEditGroup attr="last_name" width={300} />
                <Group attr="emails" >
                    <EmailListEditor emails={emails}/>
                </Group>

                <hr />

                <input className="btn btn-default" type="submit" value="Submit" disabled={disableSubmit}/>

            </Form>
        );
    }
});

var FormExample = React.createClass({

    getInitialState: function() {
        return {
            "data":  undefined,
            "loaded": false,
        };
    },

    componentDidMount: function() {
        var self = this;

        //Simulate ASYNC state update
        setTimeout(function() {
            self.setState({
                "loaded": true
            });
        }, 1500);
    },

    handleSubmit: function(value) {
        this.setState({"data": value});
    },

    handleAlertDismiss: function() {
        this.setState({"data": undefined});
    },

    renderAlert: function() {
        if (this.state && this.state.data) {
            var firstName = this.state.data["first_name"];
            var lastName = this.state.data["last_name"];
            var emailList = this.state.data["emails"];
            return (
                <Alert bsStyle="success" onDismiss={this.handleAlertDismiss} style={{margin: 5}}>
                    <strong>Success!</strong> {firstName} {lastName} was submitted with {emailList.length} email(s). 
                </Alert>
            );
        } else {
            return null;
        }
    },

    renderContactForm: function() {
        if (this.state.loaded) {
            return (
                <ContactForm schema={schema} values={values} onSubmit={this.handleSubmit}/>
            );
        } else {
            return (
                <div style={{marginTop: 50}}><b>Loading...</b></div>
            );
        }
    },

    render: function() {
        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <h3>List example</h3>
                        <div style={{marginBottom: 20}}>{description}</div>
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
                        <div style={{borderTopStyle: "solid",
                                    borderTopColor: "rgb(244, 244, 244)",
                                    paddingTop: 5,
                                    marginTop: 20}}>
                            <Markdown text={text}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = FormExample;
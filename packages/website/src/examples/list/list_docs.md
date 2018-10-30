### List example

The first step is to render a form for entering an email address. In the case of this example we do have a little form that asks for the email address and email type. In that case we specify a schema and a form component to render that form:

    const schema = (
        <Schema>
            <Field
                name="email"
                defaultValue=""
                label="Email"
                required={true}
                validation={{ format: "email" }}
            />
            <Field name="email_type" defaultValue={1} label="Type" required={true} />
        </Schema>
    );

    /**
    * Renders a form for entering an email address
    */
    class EmailForm extends React.Component {

        renderForm() {
            const id = this.value("email_type");
            return (
                <Form
                    name={this.props.name}
                    schema={EmailForm.schema}
                    value={value}
                    edit={FormEditStates.ALWAYS}
                    labelWidth={50}
                    {...callbacks}
                >
                    <Chooser
                        field="email_type"
                        choiceList={this.emailTypes()}
                        disableSearch={true}
                        width={150}
                    />
                    <TextEdit field="email" width={300} />
                </Form>
            );
        }
    };

    const EmailList = formList(EmailForm);
    const Emails = formGroup(EmailList);

Having defined that, we can now create a form to edit a contact:

    class ContactForm extends React.Component {

        schema() {
            return (
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
                    <Field name="emails" label="Emails" />
                </Schema>
            );
        }

        render() {
            const disableSubmit = false;
            const style = { background: "#FAFAFA", padding: 10, borderRadius: 5 };
            const { value } = this.props;
            const emails = value.get("emails");

            return (
                <Form
                    field="contact-form"
                    style={style}
                    schema={this.schema()}
                    value={value}
                    edit={FormEditStates.SELECTED}
                    labelWidth={100}
                    onChange={(fieldName, value) => this.handleChange(fieldName, value)}
                    onMissingCountChange={(form, missing) =>
                        this.handleMissingCountChange(form, missing)}
                    onErrorCountChange={(form, errors) => this.handleErrorCountChange(form, errors)}
                >
                    <TextEdit field="first_name" width={300} />
                    <TextEdit field="last_name" width={300} />
                    <Emails field="emails" value={emails} />
                    <hr />
                </Form>
            );
        }

    });
---
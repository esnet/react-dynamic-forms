import Immutable from "immutable";
import React, { FunctionComponent, useEffect } from "react";
import { Field, Form, FormEditStates, formGroup, formList, Schema, TextEdit } from "..";
import { ListItemProps } from "../hoc/list";
import { FieldValue } from "./Form";

export default { title: "List" };

const defaultEmailItem = Immutable.Map<string, FieldValue>(
    Immutable.fromJS({ email_type: 1, email: "" })
);

// Represents each member of an Email list
const EmailForm: FunctionComponent<ListItemProps> = props => {
    const schema = (
        <Schema>
            <Field name="email" label="Email" required={true} validation={{ format: "email" }} />
            {/* <Field name="email_type" defaultValue={1} label="Type" required={true} /> */}
        </Schema>
    );

    const {
        name,
        edit,
        value = defaultEmailItem,
        initialValue = defaultEmailItem,
        onChange,
        onMissingCountChange,
        onErrorCountChange
    } = props;

    // Callbacks supplied by the list need to be hooked up to the form below
    const callbacks = { onChange, onMissingCountChange, onErrorCountChange };

    console.log("XXX", edit);
    
    if (edit) {
        
        return (
            <Form
                name={name}
                schema={schema}
                value={value}
                initialValue={initialValue}
                edit={FormEditStates.ALWAYS}
                labelWidth={50}
                {...callbacks}
            >
                <TextEdit field="email" width={250} />
                {/* <Chooser
                field="email_type"
                choiceList={this.emailTypes()}
                disableSearch={true}
                width={250}
            /> */}
            </Form>
        );
    } else {
        return (
            <Form
                name={name}
                schema={schema}
                value={value}
                initialValue={initialValue}
                edit={FormEditStates.TABLE}
                labelWidth={50}
                {...callbacks}
            >
                <TextEdit field="email" width={250} />
                {/* <Chooser
                    field="email_type"
                    choiceList={this.emailTypes()}
                    disableSearch={true}
                    width={250}
                /> */}
            </Form>
        );
    }
};

const EmailList = formList(EmailForm, false, 0, defaultEmailItem);
const Emails = formGroup(EmailList);

//
// Wraps a Contact form with a component that encapsuates the schema,
// initial data and the Form itself. This component will report to callbacks
// passed in the props for onChange, onMissingCountChange and onErrorCountChange.
// For input you supply the initial and current value as an Immutable.Map
//

interface ContactFormProps {
    value: Immutable.Map<string, any>;
    initialValue: Immutable.Map<string, any>;
    onChange: (name: string, value: Immutable.Map<string, any>) => void;
    onMissingCountChange: (name: string, count: number) => void;
    onErrorCountChange: (name: string, count: number) => void;
}

const ContactForm: FunctionComponent<ContactFormProps> = (props: ContactFormProps) => {
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
            <Field name="emails" label="Emails" required={false} />
        </Schema>
    );

    const [editMode /* setEditMode*/] = React.useState<string>(FormEditStates.ALWAYS);
    const [, /* hasErrors */ setHasErrors] = React.useState<boolean>(false);
    const [, /* hasMissing */ setHasMissing] = React.useState<boolean>(false);

    const { value, initialValue, onMissingCountChange, onErrorCountChange, onChange } = props;
    const emails = value.get("emails");

    const handleMissingCountChange = (form: string, missingCount: number) => {
        setHasMissing(missingCount > 0);
        if (onMissingCountChange) {
            onMissingCountChange(form, missingCount);
        }
    };

    const handleErrorCountChange = (form: string, errorCount: number) => {
        setHasErrors(errorCount > 0);
        if (onErrorCountChange) {
            onErrorCountChange(form, errorCount);
        }
    };

    const handleChange = (form: string, value: Immutable.Map<string, any>) => {
        if (onChange) {
            onChange(form, value);
        }
    };

    // TODO: Add this when we have a chooser
    // const emailTypes = Immutable.fromJS([
    //     { id: 1, label: "Work" },
    //     { id: 2, label: "Home" }
    // ]);

    const style = { background: "#FAFAFA", padding: 10, borderRadius: 5 };

    console.log("CONTACT FORM", value);

    return (
        <Form
            name="contact"
            formStyle={style}
            schema={schema}
            value={value}
            initialValue={initialValue}
            edit={editMode}
            labelWidth={100}
            onChange={(fieldName, value) => handleChange(fieldName, value)}
            onMissingCountChange={(form, missing) => handleMissingCountChange(form, missing)}
            onErrorCountChange={(form, errors) => handleErrorCountChange(form, errors)}
        >
            <TextEdit field="first_name" width={300} />
            <TextEdit field="last_name" width={300} />
            <Emails field="emails" value={emails} />
        </Form>
    );
};

const savedValues = Immutable.fromJS({
    first_name: "Bill",
    last_name: "Jones",
    emails: [
        { email: "b.jones@work.com", email_type: 1 },
        { email: "bill@gmail.com", email_type: 2 }
    ]
});

//
// Main story creates a ContactForm and monitors data changes, along with error and missing counts
// The form contains a couple of contact field along with a list view with email addresses in it.
//

export const ListExample = () => {
    // We simulate async loading of the form data and this state lets us know that it was loaded
    // In the real world, the data is probably being loaded from an API, so this is a common usecase.
    const [loaded, setLoaded] = React.useState<boolean>(false);

    // Value will update as the user interacts with the form
    const [value, setValue] = React.useState<Immutable.Map<string, string>>(Immutable.Map());

    // initialValue will only update when the user saves the form
    const [initialValue, setInitialValue] = React.useState<Immutable.Map<string, string>>(
        Immutable.Map()
    );

    const [hasMissing, setHasMissing] = React.useState<boolean>(false);
    const [hasErrors, setHasErrors] = React.useState<boolean>(false);

    // Similate loading data from an API. When it's "loaded" it sets the loaded state to
    // true and we actually render the form below
    useEffect(() => {
        setTimeout(() => {
            setValue(savedValues);
            setInitialValue(savedValues);
            setLoaded(true);
        }, 0);
    }, []);

    console.log("STORY RENDER", loaded, value);

    // Main form rendering (or loader message)
    if (loaded) {
        console.log("STORY LOADED", value);
        return (
            <div>
                <pre style={{ fontSize: 18 }}>
                    <span>List example</span>
                </pre>

                <ContactForm
                    value={value}
                    initialValue={initialValue}
                    onChange={(_: string, value) => setValue(value)}
                    onMissingCountChange={(_: string, count) => setHasMissing(count > 0)}
                    onErrorCountChange={(_: string, count) => setHasErrors(count > 0)}
                />

                <pre style={{ margin: 20, padding: 10, background: "#F3F3F3", borderRadius: 5 }}>
                    <span>{hasMissing ? "has missing" : "no missing"}</span>
                    <span style={{ marginLeft: 20 }}>{hasErrors ? "has errors" : "no errors"}</span>
                </pre>

                <pre style={{ margin: 20, padding: 10, background: "#F3F3F3", borderRadius: 5 }}>
                    {JSON.stringify(value.toJS(), null, 3)}
                </pre>
            </div>
        );
    } else {
        return (
            <div style={{ marginTop: 50, marginBottom: 100 }}>
                <b>Loading saved data...</b>
            </div>
        );
    }
};

import Immutable, { fromJS } from "immutable";
import React from "react";
import { Chooser, Field, Form, FormEditStates, Schema, TextEdit } from "../index";

export default { title: "Forms.Basic" };

const storyHeaderStyle = { fontSize: 12, paddingTop: 30 };
const outputStyle = {
    background: "#F3F3F3",
    borderRadius: 5,
    margin: 20,
    padding: 10
};

const initialValue = {
    name: "Bob"
};

// The form schema
const basicSchema = (
    <Schema>
        <Field
            name="name"
            label="Name"
            placeholder="Enter the thing's name"
            required={false}
            validation={{ type: "string" }}
        />
    </Schema>
);

export const basic = () => {
    // State
    const [value, setValue] = React.useState<Immutable.Map<string, any>>(fromJS(initialValue));
    const [hasMissing, setHasMissing] = React.useState<boolean>(false);
    const [hasErrors, setHasErrors] = React.useState<boolean>(false);
    const [editMode] = React.useState<string>(FormEditStates.ALWAYS);

    // Styles
    const style = { background: "#FAFAFA", padding: 10, borderRadius: 5 };

    return (
        <div style={{ padding: 50 }}>
            <pre style={{ fontSize: 18 }}>
                <span>Basic form</span>
            </pre>

            <div style={{ width: "80%", fontFamily: "Courier New" }}>
                Shows a form with a simple schema containing one field
            </div>

            <pre style={storyHeaderStyle}>
                <span>: Form :</span>
            </pre>

            <Form
                name="basic"
                formStyle={style}
                schema={basicSchema}
                value={value}
                initialValue={value}
                edit={editMode}
                labelWidth={200}
                onChange={(_, value) => setValue(value)}
                onMissingCountChange={(_, missing) => setHasMissing(missing > 0)}
                onErrorCountChange={(_, errors) => setHasErrors(errors > 0)}
                // onSubmit={() => console.log("Submit")}
            >
                <TextEdit field="name" width={300} />
            </Form>

            <pre style={storyHeaderStyle}>
                <span>: Validation :</span>
            </pre>

            <pre style={outputStyle}>
                <span>{hasMissing ? "has missing" : "no missing"}</span>
                <span style={{ marginLeft: 20 }}>{hasErrors ? "has errors" : "no errors"}</span>
            </pre>

            <pre style={storyHeaderStyle}>
                <span>: Value :</span>
            </pre>

            <pre style={{ margin: 20, padding: 10, background: "#F3F3F3", borderRadius: 5 }}>
                {JSON.stringify(value, null, 3)}
            </pre>
        </div>
    );
};

const initialContact = {
    type: 0,
    first_name: "Bob",
    last_name: "Smith"
};

const contactSchema = (
    <Schema>
        <Field name="type" label="Type" placeholder="Enter contact type" required={true} />
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
            required={true}
            validation={{ format: "email" }}
        />
        <Field name="birthdate" label="Birthdate" required={true} />
        <Field name="tags" label="Categories" required={true} />
    </Schema>
);

const availableTypes = Immutable.fromJS([
    { id: 0, label: "Friend" },
    { id: 1, label: "Acquaintance" }
]);

export const validateAsRequired = () => {
    const [value, setValue] = React.useState<Immutable.Map<string, any>>(fromJS(initialContact));
    const [hasMissing, setHasMissing] = React.useState<boolean>(false);
    const [hasErrors, setHasErrors] = React.useState<boolean>(false);
    const [editMode] = React.useState<string>(FormEditStates.ALWAYS);

    const style = { background: "#FAFAFA", padding: 10, borderRadius: 5 };

    return (
        <div style={{ padding: 50 }}>
            <pre style={{ fontSize: 18 }}>
                <span>Validate as required</span>
            </pre>

            <div style={{ width: "80%", fontFamily: "Courier New" }}>
                Text edit form with required fields
            </div>

            <pre style={storyHeaderStyle}>
                <span>: Form :</span>
            </pre>

            <pre style={{ fontSize: 18 }}>
                <span>Text edit form with required fields</span>
            </pre>
            <Form
                name="basic"
                formStyle={style}
                schema={contactSchema}
                value={value}
                initialValue={value}
                edit={editMode}
                labelWidth={200}
                // onSubmit={() => console.log("Submit")}
                onChange={(_, value) => setValue(value)}
                onMissingCountChange={(_, missing) => setHasMissing(missing > 0)}
                onErrorCountChange={(_, errors) => setHasErrors(errors > 0)}
            >
                <Chooser
                    field="type"
                    width={150}
                    choiceList={availableTypes}
                    isSearchable={false}
                />
                <TextEdit field="first_name" width={300} />
                <TextEdit field="last_name" width={300} />
                <TextEdit
                    field="email"
                    width={400}
                    view={value => {
                        return <a>{value}</a>;
                    }}
                />
            </Form>
            <pre style={storyHeaderStyle}>
                <span>: Validation :</span>
            </pre>
            <pre style={outputStyle}>
                <span>{hasMissing ? "has missing" : "no missing"}</span>
                <span style={{ marginLeft: 20 }}>{hasErrors ? "has errors" : "no errors"}</span>
            </pre>

            <pre style={storyHeaderStyle}>
                <span>: Value :</span>
            </pre>
            <pre style={{ margin: 20, padding: 10, background: "#F3F3F3", borderRadius: 5 }}>
                {JSON.stringify(value, null, 3)}
            </pre>
        </div>
    );
};

// const initialTagList = Immutable.fromJS([
//     "ucberkeley",
//     "esnet",
//     "stanford",
//     "doe",
//     "industry",
//     "government"
// ]);

export const transitionEditStates = () => {
    // State
    const [value, setValue] = React.useState<Immutable.Map<string, any>>(fromJS(initialContact));
    // const [tagList, setTagList] = React.useState<string[]>(initialTagList);
    const [hasMissing, setHasMissing] = React.useState<boolean>(false);
    const [hasErrors, setHasErrors] = React.useState<boolean>(false);
    const [editMode, setEditMode] = React.useState<string>(FormEditStates.ALWAYS);

    // Styles
    const formStyle = {
        background: "#FAFAFA",
        borderRadius: 5,
        padding: 10
    };
    const outputStyle = {
        background: "#F3F3F3",
        borderRadius: 5,
        margin: 20,
        padding: 10
    };
    const buttonStyleSelected = { color: "black", padding: 10, cursor: "pointer" };
    const buttonStyleUnselected = { color: "#DDD", padding: 10, cursor: "pointer" };

    return (
        <div>
            <div style={{ padding: 50 }}>
                <pre style={{ fontSize: 18 }}>
                    <span>Form with different edit states</span>
                </pre>

                <pre style={storyHeaderStyle}>
                    <span>: Select the editMode :</span>
                </pre>

                <span
                    style={
                        editMode == FormEditStates.ALWAYS
                            ? buttonStyleSelected
                            : buttonStyleUnselected
                    }
                    onClick={() => setEditMode(FormEditStates.ALWAYS)}
                >
                    Always
                </span>
                <span
                    style={
                        editMode == FormEditStates.SELECTED
                            ? buttonStyleSelected
                            : buttonStyleUnselected
                    }
                    onClick={() => setEditMode(FormEditStates.SELECTED)}
                >
                    Selected
                </span>
                <span
                    style={
                        editMode == FormEditStates.NEVER
                            ? buttonStyleSelected
                            : buttonStyleUnselected
                    }
                    onClick={() => setEditMode(FormEditStates.NEVER)}
                >
                    Never
                </span>

                <pre style={storyHeaderStyle}>
                    <span>: Form :</span>
                </pre>

                <Form
                    name="basic"
                    formStyle={formStyle}
                    schema={contactSchema}
                    value={value}
                    initialValue={value}
                    edit={editMode}
                    labelWidth={200}
                    // onSubmit={() => console.log("Submit")}
                    onChange={(_, value) => setValue(value)}
                    onMissingCountChange={(_, missing) => setHasMissing(missing > 0)}
                    onErrorCountChange={(_, errors) => setHasErrors(errors > 0)}
                >
                    <Chooser
                        field="type"
                        width={150}
                        choiceList={availableTypes}
                        isSearchable={false}
                    />
                    <TextEdit field="first_name" width={300} />
                    <TextEdit field="last_name" width={300} />
                    <TextEdit
                        field="email"
                        width={400}
                        view={value => {
                            return <a>{value}</a>;
                        }}
                    />
                    {/* <TagsEdit
                        field="tags"
                        tagList={tagList}
                        onTagListChange={(_, tags: string[]) => setTagList(tags)}
                        width={400}
                    /> */}
                </Form>

                <pre style={storyHeaderStyle}>
                    <span>: Validation :</span>
                </pre>
                <pre style={outputStyle}>
                    <span>{hasMissing ? "has missing" : "no missing"}</span>
                    <span style={{ marginLeft: 20 }}>{hasErrors ? "has errors" : "no errors"}</span>
                </pre>

                <pre style={storyHeaderStyle}>
                    <span>: Value :</span>
                </pre>
                <pre style={{ margin: 20, padding: 10, background: "#F3F3F3", borderRadius: 5 }}>
                    {JSON.stringify(value, null, 3)}
                </pre>
            </div>
        </div>
    );
};

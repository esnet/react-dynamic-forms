import Immutable, { fromJS } from "immutable";
import React from "react";
import { Field, Form, FormEditStates, FormGroupLayout, Schema } from "../..";
import { Chooser, ChooserGroup } from "./ChooserControl";
// Test data
// import colors from "./colors";

export default { title: "Chooser" };

const initialValue = 0;

const availableTypes = Immutable.fromJS([
    { id: 0, label: "Friend" },
    { id: 1, label: "Acquaintance" }
]);

// const availableColors = Immutable.fromJS(colors.colors.map(c => ({ id: c.hex, label: c.name })));

export const basicChooser = () => {
    // State
    const [value, setValue] = React.useState<number>(initialValue);
    const [hasMissing] = React.useState<boolean>(false);
    const [hasErrors] = React.useState<boolean>(false);

    const callbacks = {
        onSelectItem: () => {},
        onChange: (_: any, value: number) => setValue(value),
        onBlur: () => {},
        onErrorCountChange: () => {},
        onMissingCountChange: () => {},
        onEditItem: () => {}
    };

    return (
        <div>
            <pre style={{ fontSize: 18 }}>
                <span>Basic chooser</span>
            </pre>

            <hr />
            <ChooserGroup
                // Chooser props
                width={250}
                name="type-chooser"
                choiceList={availableTypes}
                disableSearch={true}
                // Group props
                hidden={false}
                field="type"
                label="Contact Type"
                labelWidth={140}
                disabled={false}
                edit={true}
                required={false}
                // FieldEditor props
                value={value}
                initialValue={initialValue}
                placeholder="Choose a type"
                help="Select the type of contact from the list given"
                selected={true}
                showRequired={true}
                allowEdit={true}
                layout={FormGroupLayout.ROW}
                validation={null}
                {...callbacks}
            />

            <hr />
            <pre style={{ margin: 20, padding: 10, background: "#F3F3F3", borderRadius: 5 }}>
                <span>{hasMissing ? "has missing" : "no missing"}</span>
                <span style={{ marginLeft: 20 }}>{hasErrors ? "has errors" : "no errors"}</span>
            </pre>

            <pre style={{ margin: 20, padding: 10, background: "#F3F3F3", borderRadius: 5 }}>
                {JSON.stringify(value, null, 3)}
            </pre>
        </div>
    );
};

export const searchableChooser = () => {
    // State
    const [value, setValue] = React.useState<number>(initialValue);
    const [hasMissing] = React.useState<boolean>(false);
    const [hasErrors] = React.useState<boolean>(false);

    const callbacks = {
        onSelectItem: () => {},
        onChange: (_: any, value: number) => setValue(value),
        onBlur: () => {},
        onErrorCountChange: () => {},
        onMissingCountChange: () => {},
        onEditItem: () => {}
    };

    return (
        <div>
            <pre style={{ fontSize: 18, marginLeft: 15 }}>
                <span>Basic chooser</span>
            </pre>

            <p style={{ fontSize: 16, marginLeft: 15 }}>
                Should display a Chooser within a group. The chooser is in it's most basic form but
                allows the user to search for an item.
            </p>

            <hr />
            <ChooserGroup
                // Chooser props
                width={250}
                name="type-chooser"
                choiceList={availableTypes}
                disableSearch={false}
                // Group props
                hidden={false}
                field="type"
                label="Contact Type"
                labelWidth={140}
                disabled={false}
                edit={true}
                required={false}
                // FieldEditor props
                value={value}
                initialValue={initialValue}
                placeholder="Choose a type"
                help="Select the type of contact from the list given"
                selected={true}
                showRequired={true}
                allowEdit={true}
                layout={FormGroupLayout.ROW}
                validation={null}
                {...callbacks}
            />

            <hr />
            <pre style={{ margin: 20, padding: 10, background: "#F3F3F3", borderRadius: 5 }}>
                <span style={{ borderRadius: 3, background: "#ffc107", padding: 8 }}>
                    {hasMissing ? "has missing" : "no missing"}
                </span>
                <span
                    style={{ borderRadius: 3, background: "#dc3545", padding: 8, marginLeft: 10 }}
                >
                    {hasErrors ? "has errors" : "no errors"}
                </span>
            </pre>

            <pre style={{ margin: 20, padding: 10, background: "#F3F3F3", borderRadius: 5 }}>
                value: {JSON.stringify(value, null, 3)}
            </pre>
        </div>
    );
};

const loadOptions = (_: any, callback: any) => {
    console.log("Loading...");
    setTimeout(() => {
        console.log("Loaded!");
        callback(availableTypes);
    }, 5000);
};

export const asyncChooser = () => {
    // State
    const [value, setValue] = React.useState<number>(initialValue);
    const [hasMissing] = React.useState<boolean>(false);
    const [hasErrors] = React.useState<boolean>(false);

    const callbacks = {
        onSelectItem: () => {},
        onChange: (_: any, value: number) => setValue(value),
        onBlur: () => {},
        onErrorCountChange: () => {},
        onMissingCountChange: () => {},
        onEditItem: () => {}
    };

    return (
        <div>
            <pre style={{ fontSize: 18, marginLeft: 15 }}>
                <span>Async chooser...</span>
            </pre>

            <p style={{ fontSize: 16, marginLeft: 15 }}>
                Should display a Chooser within a group. The chooser is in it's most basic form but
                allows the user to search for an item.
            </p>

            <hr />
            <ChooserGroup
                // Chooser props
                width={250}
                name="type-chooser"
                choiceList={availableTypes}
                choiceLoader={loadOptions}
                disableSearch={false}
                // Group props
                hidden={false}
                field="type"
                label="Contact Type"
                labelWidth={140}
                disabled={false}
                edit={true}
                required={false}
                // FieldEditor props
                value={value}
                initialValue={initialValue}
                placeholder="Choose a type"
                help="Select the type of contact from the list given"
                selected={true}
                showRequired={true}
                allowEdit={true}
                layout={FormGroupLayout.ROW}
                validation={null}
                {...callbacks}
            />

            <hr />
            <pre style={{ margin: 20, padding: 10, background: "#F3F3F3", borderRadius: 5 }}>
                <span style={{ borderRadius: 3, background: "#ffc107", padding: 8 }}>
                    {hasMissing ? "has missing" : "no missing"}
                </span>
                <span
                    style={{ borderRadius: 3, background: "#dc3545", padding: 8, marginLeft: 10 }}
                >
                    {hasErrors ? "has errors" : "no errors"}
                </span>
            </pre>

            <pre style={{ margin: 20, padding: 10, background: "#F3F3F3", borderRadius: 5 }}>
                value: {JSON.stringify(value, null, 3)}
            </pre>
        </div>
    );
};

const initialContact = {
    type: 0
};

const contactSchema = (
    <Schema>
        <Field name="type" label="Contact Type" placeholder="Enter contact type" required={true} />
    </Schema>
);

export const asyncChooserInAForm = () => {
    const [value, setValue] = React.useState<Immutable.Map<string, any>>(fromJS(initialContact));
    const [hasMissing, setHasMissing] = React.useState<boolean>(false);
    const [hasErrors, setHasErrors] = React.useState<boolean>(false);
    const [editMode, setEditMode] = React.useState<string>(FormEditStates.SELECTED);

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
            <pre style={{ fontSize: 18 }}>
                <span>Text edit form with required fields</span>
            </pre>

            <div>
                <pre style={{ fontSize: 12 }}>
                    <span>Select the edit mode</span>
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
            </div>

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
                    choiceLoader={loadOptions}
                />
            </Form>

            <pre style={outputStyle}>
                <span>{hasMissing ? "has missing" : "no missing"}</span>
                <span style={{ marginLeft: 20 }}>{hasErrors ? "has errors" : "no errors"}</span>
            </pre>

            <pre style={{ margin: 20, padding: 10, background: "#F3F3F3", borderRadius: 5 }}>
                {JSON.stringify(value.toJS(), null, 3)}
            </pre>
        </div>
    );
};

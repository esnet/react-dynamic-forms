import Immutable, { fromJS } from "immutable";
import React from "react";
import { Field, Form, FormEditStates, FormGroupLayout, Schema } from "../..";
import { Chooser, ChooserGroup } from "./ChooserControl";
import colors from "./colors.json";

export default { title: "Chooser" };

const storyHeaderStyle = { fontSize: 12, paddingTop: 30 };
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

const initialValue = 0;

type ChooserOptions = Immutable.List<Immutable.Map<"label" | "id" | "disabled", any>>;

const availableTypes: ChooserOptions = Immutable.fromJS([
    { id: 0, label: "Friend" },
    { id: 1, label: "Acquaintance" }
]);

const availableColors: ChooserOptions = Immutable.fromJS(
    colors.colors.map((c: any, index: number) => ({ id: index, label: c.name }))
);

const fixedProps = {
    // Chooser props
    width: 250,
    name: "type-chooser",
    field: "type",
    label: "Contact Type",
    labelWidth: 140,
    placeholder: "Choose a type",
    help:
        "Select the type of contact from the list given. They are a friend if you'd lick them in a pandemic. Acquaintance if you'd elbow bump."
};

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
        <div style={{ padding: 50 }}>
            <pre style={{ fontSize: 18 }}>
                <span>Basic Chooser (no search)</span>
            </pre>

            <div style={{ width: "80%", fontFamily: "Courier New" }}>
                Shows an Chooser outside a Form.
            </div>

            <pre style={storyHeaderStyle}>
                <span>: ChooserGroup :</span>
            </pre>
            <ChooserGroup
                choiceList={availableTypes}
                isSearchable={false}
                isHidden={false}
                isDisabled={false}
                isBeingEdited={true}
                isRequired={false}
                value={value}
                initialValue={initialValue}
                isSelected={true}
                showRequired={true}
                allowEdit={true}
                layout={FormGroupLayout.ROW}
                validation={null}
                {...fixedProps}
                {...callbacks}
            />

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
        <div style={{ padding: 50 }}>
            <pre style={{ fontSize: 18 }}>
                <span>Searchable Chooser (sync)</span>
            </pre>

            <div style={{ width: "80%", fontFamily: "Courier New" }}>
                Shows an Chooser outside a Form with a pre-set list of choice options.
            </div>

            <pre style={storyHeaderStyle}>
                <span>: ChooserGroup :</span>
            </pre>

            <ChooserGroup
                choiceList={availableTypes}
                isSearchable={true}
                isHidden={false}
                isDisabled={false}
                isBeingEdited={true}
                isRequired={false}
                value={value}
                initialValue={initialValue}
                isSelected={true}
                showRequired={true}
                allowEdit={true}
                layout={FormGroupLayout.ROW}
                validation={null}
                {...fixedProps}
                {...callbacks}
            />

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

export const clearableChooser = () => {
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
        <div style={{ padding: 50 }}>
            <pre style={{ fontSize: 18 }}>
                <span>Clearable chooser</span>
            </pre>

            <div style={{ width: "80%", fontFamily: "Courier New" }}>
                Shows an Chooser with a clear [x] button that lets you select nothing.
            </div>

            <pre style={storyHeaderStyle}>
                <span>: ChooserGroup :</span>
            </pre>

            <ChooserGroup
                choiceList={availableTypes}
                isSearchable={false}
                isClearable={true}
                isHidden={false}
                isDisabled={false}
                isBeingEdited={true}
                isRequired={true}
                value={value}
                initialValue={initialValue}
                isSelected={true}
                showRequired={true}
                allowEdit={true}
                layout={FormGroupLayout.ROW}
                validation={null}
                {...fixedProps}
                {...callbacks}
            />

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

const filteredColors = (colors: ChooserOptions, inputValue: string): ChooserOptions => {
    return colors.filter(item =>
        item
            .get("label")
            .toLowerCase()
            .includes(inputValue.toLowerCase())
    );
};

// Loading function, delays 5 sec and then returns the list
let cachedAvailableColors: ChooserOptions | null = null;
const loadOptions = (filter: string, callback: any) => {
    if (cachedAvailableColors) {
        callback(filteredColors(cachedAvailableColors, filter));
    } else {
        setTimeout(() => {
            callback(filteredColors(availableColors, filter));
            cachedAvailableColors = availableColors;
        }, 5000);
    }
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
        <div style={{ padding: 50 }}>
            <pre style={{ fontSize: 18 }}>
                <span>Async chooser (outside a form)</span>
            </pre>

            <div style={{ width: "80%", fontFamily: "Courier New" }}>
                Shows an async chooser outside a form but wrapped in a group.
            </div>

            <pre style={storyHeaderStyle}>
                <span>: ChooserGroup :</span>
            </pre>

            <ChooserGroup
                // Chooser props
                width={250}
                name="type-chooser"
                choiceList={availableTypes}
                choiceLoader={loadOptions}
                isSearchable={true}
                // Group props
                isHidden={false}
                field="type"
                label="Contact Type"
                labelWidth={140}
                isDisabled={false}
                isBeingEdited={true}
                isRequired={false}
                // FieldEditor props
                value={value}
                initialValue={initialValue}
                placeholder="Choose a type"
                help="Select the type of contact from the list given"
                isSelected={true}
                showRequired={true}
                allowEdit={true}
                layout={FormGroupLayout.ROW}
                validation={null}
                {...callbacks}
            />

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

const initialColor = {
    color: 4543
};

const contactSchema = (
    <Schema>
        <Field
            name="color"
            label="Favorite Color"
            placeholder="Locate your favorite color"
            required={true}
        />
    </Schema>
);

export const asyncChooserInAForm = () => {
    const [value, setValue] = React.useState<Immutable.Map<string, any>>(fromJS(initialColor));
    const [hasMissing, setHasMissing] = React.useState<boolean>(false);
    const [hasErrors, setHasErrors] = React.useState<boolean>(false);
    const [editMode, setEditMode] = React.useState<string>(FormEditStates.SELECTED);

    const buttonStyleSelected = { color: "black", padding: 10, cursor: "pointer" };
    const buttonStyleUnselected = { color: "#DDD", padding: 10, cursor: "pointer" };

    return (
        <div style={{ padding: 50 }}>
            <pre style={{ fontSize: 18 }}>
                <span>Form with chooser that will load async when editted</span>
            </pre>

            <div style={{ width: "80%", fontFamily: "Courier New" }}>
                Shows a chooser in a form. You can select the edit mode, either always show an
                chooser for the field, show the chooser only when the user clicks the edit icon or
                double clicks the field, or never show the chooser only the value.
            </div>

            <pre style={storyHeaderStyle}>
                <span>: Edit mode :</span>
            </pre>
            <div>
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
                    field="color"
                    width={280}
                    choiceList={availableColors}
                    choiceLoader={loadOptions}
                    displayView={value => (
                        <span style={{ color: "steelblue" }}>
                            <b>
                                {availableColors
                                    .find(item => item.get("id") === value)
                                    ?.get("label")}
                            </b>
                        </span>
                    )}
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
                <span>: Form value :</span>
            </pre>
            <pre style={{ margin: 20, padding: 10, background: "#F3F3F3", borderRadius: 5 }}>
                {JSON.stringify(value.toJS(), null, 3)}
            </pre>
        </div>
    );
};

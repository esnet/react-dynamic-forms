import React from "react";
import { FormGroupLayout } from "../../index";
import { TextEditGroup } from "./TextEditControl";

export default { title: "TextEdit" };

const storyHeaderStyle = { fontSize: 12, paddingTop: 30 };
// const formStyle = {
//     background: "#FAFAFA",
//     borderRadius: 5,
//     padding: 10
// };

const outputStyle = {
    background: "#F3F3F3",
    borderRadius: 5,
    margin: 20,
    padding: 10
};

const initialValue = "Bob";

const fixedProps = {
    // textedit props
    width: 250,
    name: "first-name",
    field: "first_name",
    label: "First name",
    labelWidth: 140,
    placeholder: "Enter your first name",
    help: "This is some **text** with markdown in it!"
};

export const basicTextEdit = () => {
    // State
    const [value, setValue] = React.useState<string>(initialValue);
    const [hasMissing, setHasMissing] = React.useState<boolean>(false);
    const [hasErrors, setHasErrors] = React.useState<boolean>(false);

    const callbacks = {
        onSelectItem: () => {},
        onChange: (_: any, value: string) => setValue(value),
        onBlur: () => {},
        onErrorCountChange: (_: any, errors: number) => {
            setHasErrors(errors > 0);
        },
        onMissingCountChange: (_: any, missing: number) => {
            setHasMissing(missing > 0);
        },
        onEditItem: () => {}
    };

    return (
        <div style={{ padding: 50 }}>
            <pre style={{ fontSize: 18 }}>
                <span>Basic TextEdit control</span>
            </pre>

            <div style={{ width: "80%", fontFamily: "Courier New" }}>
                Shows a TextEdit control with an initial value
            </div>

            <pre style={storyHeaderStyle}>
                <span>: TextEditGroup :</span>
            </pre>
            <TextEditGroup
                isHidden={false}
                isDisabled={false}
                isBeingEdited={true}
                isRequired={false}
                value={value}
                initialValue={initialValue}
                isSelected={false}
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

export const hiddenTextEdit = () => {
    // State
    const [value, setValue] = React.useState<string>(initialValue);
    const [hasMissing, setHasMissing] = React.useState<boolean>(false);
    const [hasErrors, setHasErrors] = React.useState<boolean>(false);

    const callbacks = {
        onSelectItem: () => {},
        onChange: (_: any, value: string) => setValue(value),
        onBlur: () => {},
        onErrorCountChange: (_: any, errors: number) => {
            setHasErrors(errors > 0);
        },
        onMissingCountChange: (_: any, missing: number) => {
            setHasMissing(missing > 0);
        },
        onEditItem: () => {}
    };

    return (
        <div style={{ padding: 50 }}>
            <pre style={{ fontSize: 18 }}>
                <span>Hidden TextEdit control</span>
            </pre>

            <div style={{ width: "80%", fontFamily: "Courier New" }}>
                Shows a TextEdit control that is totally hidden! (you shouldn't see anything)
            </div>

            <pre style={storyHeaderStyle}>
                <span>: TextEditGroup :</span>
            </pre>
            <TextEditGroup
                isHidden={true}
                isDisabled={false}
                isBeingEdited={true}
                isRequired={false}
                value={value}
                initialValue={initialValue}
                isSelected={false}
                showRequired={true}
                allowEdit={true}
                layout={FormGroupLayout.ROW}
                validation={null}
                {...fixedProps}
                {...callbacks}
            />
            <pre style={{ paddingLeft: 15, ...storyHeaderStyle }}>
                <span>(this space intentionally left blank)</span>
            </pre>
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

export const disabledTextEdit = () => {
    // State
    const [value, setValue] = React.useState<string>(initialValue);
    const [hasMissing, setHasMissing] = React.useState<boolean>(false);
    const [hasErrors, setHasErrors] = React.useState<boolean>(false);

    const callbacks = {
        onSelectItem: () => {},
        onChange: (_: any, value: string) => setValue(value),
        onBlur: () => {},
        onErrorCountChange: (_: any, errors: number) => {
            setHasErrors(errors > 0);
        },
        onMissingCountChange: (_: any, missing: number) => {
            setHasMissing(missing > 0);
        },
        onEditItem: () => {}
    };

    return (
        <div style={{ padding: 50 }}>
            <pre style={{ fontSize: 18 }}>
                <span>TextEdit control that is disabled</span>
            </pre>

            <div style={{ width: "80%", fontFamily: "Courier New" }}>
                Shows a TextEdit control disabled from further editing
            </div>

            <pre style={storyHeaderStyle}>
                <span>: TextEditGroup :</span>
            </pre>
            <TextEditGroup
                isHidden={false}
                isDisabled={true}
                isBeingEdited={true}
                isRequired={false}
                value={value}
                initialValue={initialValue}
                isSelected={false}
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

export const selectedTextEdit = () => {
    // State
    const [value, setValue] = React.useState<string>(initialValue);
    const [hasMissing, setHasMissing] = React.useState<boolean>(false);
    const [hasErrors, setHasErrors] = React.useState<boolean>(false);
    const [isBeginEdited, setIsBeingEdited] = React.useState<boolean>(true);

    const callbacks = {
        onSelectItem: () => {},
        onChange: (_: any, value: string) => setValue(value),
        onErrorCountChange: (_: any, errors: number) => {
            setHasErrors(errors > 0);
        },
        onMissingCountChange: (_: any, missing: number) => {
            setHasMissing(missing > 0);
        },
        onEditItem: () => {},
        onBlur: () => {
            setIsBeingEdited(false);
        }
    };

    return (
        <div style={{ padding: 50 }}>
            <pre style={{ fontSize: 18 }}>
                <span>TextEdit control that is selected</span>
            </pre>

            <div style={{ width: "80%", fontFamily: "Courier New" }}>
                Shows a TextEdit control with the selected flag initially set. When you edit a value
                the control will turn off the `isBeingEdited` flag. Such behavior happens
                automatically when doing inline editing, but this example is lower level than that.
                To control the submission of a new value you can hit Enter or client the Done
                button. To revert any typing you can hit ESC or the Cancel button.
            </div>

            <pre style={storyHeaderStyle}>
                <span>Status</span>
            </pre>

            <div style={{ width: "80%", fontFamily: "Courier New" }}>
                Known issue: Hitting revert doesn't update the value shown in the view right away.
            </div>

            <pre style={storyHeaderStyle}>
                <span>: TextEditGroup :</span>
            </pre>

            <TextEditGroup
                isHidden={false}
                isDisabled={false}
                isBeingEdited={isBeginEdited}
                isRequired={false}
                value={value}
                initialValue={initialValue}
                isSelected={true}
                showRequired={true}
                allowEdit={isBeginEdited}
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

export const requiredTextEdit = () => {
    // State
    const [value, setValue] = React.useState<string>(initialValue);
    const [hasMissing, setHasMissing] = React.useState<boolean>(false);
    const [hasErrors, setHasErrors] = React.useState<boolean>(false);

    const callbacks = {
        onSelectItem: () => {},
        onChange: (_: any, value: string) => setValue(value),
        onBlur: () => {},
        onErrorCountChange: (_: any, errors: number) => {
            setHasErrors(errors > 0);
        },
        onMissingCountChange: (_: any, missing: number) => {
            setHasMissing(missing > 0);
        },
        onEditItem: () => {}
    };

    return (
        <div style={{ padding: 50 }}>
            <pre style={{ fontSize: 18 }}>
                <span>Required TextEdit control</span>
            </pre>

            <div style={{ width: "80%", fontFamily: "Courier New" }}>
                Shows a TextEdit control with no initial value yet field is required. Should show
                background of control in yellow warning color. Should also display placeholder
                because there's no initial value.
            </div>

            <pre style={storyHeaderStyle}>
                <span>: TextEditGroup :</span>
            </pre>
            <TextEditGroup
                isHidden={false}
                isDisabled={false}
                isBeingEdited={true}
                isRequired={true}
                value={null}
                initialValue={null}
                isSelected={false}
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

export const viewOnly = () => {
    // State
    const [value, setValue] = React.useState<string>(initialValue);
    const [hasMissing, setHasMissing] = React.useState<boolean>(false);
    const [hasErrors, setHasErrors] = React.useState<boolean>(false);

    const callbacks = {
        onSelectItem: () => {},
        onChange: (_: any, value: string) => setValue(value),
        onBlur: () => {},
        onErrorCountChange: (_: any, errors: number) => {
            setHasErrors(errors > 0);
        },
        onMissingCountChange: (_: any, missing: number) => {
            setHasMissing(missing > 0);
        },
        onEditItem: () => {}
    };

    return (
        <div style={{ padding: 50 }}>
            <pre style={{ fontSize: 18 }}>
                <span>TextEdit control view only</span>
            </pre>

            <div style={{ width: "80%", fontFamily: "Courier New" }}>
                Shows a TextEdit control with an initial value, but with editing disabled.
            </div>

            <pre style={storyHeaderStyle}>
                <span>: TextEditGroup :</span>
            </pre>
            <TextEditGroup
                isHidden={false}
                isDisabled={false}
                isBeingEdited={false}
                isRequired={false}
                value={value}
                initialValue={initialValue}
                isSelected={false}
                showRequired={true}
                allowEdit={false}
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

export const customDisplayView = () => {
    // State
    const [value, setValue] = React.useState<string>(initialValue);
    const [hasMissing, setHasMissing] = React.useState<boolean>(false);
    const [hasErrors, setHasErrors] = React.useState<boolean>(false);

    const callbacks = {
        onSelectItem: () => {},
        onChange: (_: any, value: string) => setValue(value),
        onBlur: () => {},
        onErrorCountChange: (_: any, errors: number) => {
            setHasErrors(errors > 0);
        },
        onMissingCountChange: (_: any, missing: number) => {
            setHasMissing(missing > 0);
        },
        onEditItem: () => {}
    };

    return (
        <div style={{ padding: 50 }}>
            <pre style={{ fontSize: 18 }}>
                <span>TextEdit control with custom view</span>
            </pre>

            <div style={{ width: "80%", fontFamily: "Courier New" }}>
                Shows a TextEdit control with a custom display view (not editable)
            </div>

            <pre style={storyHeaderStyle}>
                <span>: TextEditGroup :</span>
            </pre>

            <TextEditGroup
                isHidden={false}
                isDisabled={false}
                isBeingEdited={false}
                isRequired={false}
                value={value}
                initialValue={initialValue}
                isSelected={false}
                showRequired={true}
                allowEdit={false}
                layout={FormGroupLayout.ROW}
                displayView={() => (
                    <span
                        style={{
                            background: "#DDD",
                            padding: 5,
                            borderRadius: 3,
                            color: "steelblue"
                        }}
                    >
                        {value}
                    </span>
                )}
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

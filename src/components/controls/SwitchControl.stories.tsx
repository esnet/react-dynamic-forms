import React from "react";
import { FormGroupLayout } from "../../index";
import { SwitchGroup } from "./SwitchControl";

export default { title: "Switch" };

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

const fixedProps = {
    // switch reused props
    width: 250,
    name: "external",
    field: "external",
    label: "External contact",
    labelWidth: 140
};

export const basicSwitch = () => {
    // State
    const [value, setValue] = React.useState<number>(1);
    const [hasMissing, setHasMissing] = React.useState<boolean>(false);
    const [hasErrors, setHasErrors] = React.useState<boolean>(false);

    const callbacks = {
        onSelectItem: () => {},
        onChange: (_: any, value: number) => setValue(value),
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
                <span>Basic Switch control</span>
            </pre>

            <div style={{ width: "80%", fontFamily: "Courier New" }}>
                Shows a basic switch control, with supplied options
            </div>

            <pre style={storyHeaderStyle}>
                <span>: SwitchGroup :</span>
            </pre>
            <SwitchGroup
                options={["Internal", "External"]}
                isHidden={false}
                isDisabled={false}
                isBeingEdited={true}
                isRequired={false}
                value={value}
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

export const disabledSwitch = () => {
    // State
    const [value, setValue] = React.useState<number>(1);
    const [hasMissing, setHasMissing] = React.useState<boolean>(false);
    const [hasErrors, setHasErrors] = React.useState<boolean>(false);

    const callbacks = {
        onSelectItem: () => {},
        onChange: (_: any, value: number) => setValue(value),
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
                <span>Diabled switch</span>
            </pre>

            <div style={{ width: "80%", fontFamily: "Courier New" }}>
                Shows a basic switch control that has been disabled
            </div>

            <pre style={storyHeaderStyle}>
                <span>: SwitchGroup :</span>
            </pre>
            <SwitchGroup
                options={["Internal", "External"]}
                isHidden={false}
                isDisabled={true}
                isBeingEdited={true}
                isRequired={false}
                value={value}
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

export const noOptionsSwitch = () => {
    // State
    const [value, setValue] = React.useState<number>(1);
    const [hasMissing, setHasMissing] = React.useState<boolean>(false);
    const [hasErrors, setHasErrors] = React.useState<boolean>(false);

    const callbacks = {
        onSelectItem: () => {},
        onChange: (_: any, value: number) => setValue(value),
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
                <span>Switch default options</span>
            </pre>

            <div style={{ width: "80%", fontFamily: "Courier New" }}>
                If you don't supply options the switch will toggle from On to Off
            </div>

            <pre style={storyHeaderStyle}>
                <span>: SwitchGroup :</span>
            </pre>
            <SwitchGroup
                isHidden={false}
                isDisabled={false}
                isBeingEdited={true}
                isRequired={false}
                value={value}
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

export const viewOnlySwitch = () => {
    // State
    const [value, setValue] = React.useState<number>(1);
    const [hasMissing, setHasMissing] = React.useState<boolean>(false);
    const [hasErrors, setHasErrors] = React.useState<boolean>(false);

    const callbacks = {
        onSelectItem: () => {},
        onChange: (_: any, value: number) => setValue(value),
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
                <span>Switch view only</span>
            </pre>

            <div style={{ width: "80%", fontFamily: "Courier New" }}>
                Shows a switch in view only mode
            </div>

            <pre style={storyHeaderStyle}>
                <span>: SwitchGroup :</span>
            </pre>
            <SwitchGroup
                options={["Internal", "External"]}
                isHidden={false}
                isDisabled={false}
                isBeingEdited={false}
                isRequired={false}
                value={value}
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

export const customViewSwitch = () => {
    // State
    const [value, setValue] = React.useState<number>(1);
    const [hasMissing, setHasMissing] = React.useState<boolean>(false);
    const [hasErrors, setHasErrors] = React.useState<boolean>(false);

    const callbacks = {
        onSelectItem: () => {},
        onChange: (_: any, value: number) => setValue(value),
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
                <span>Switch with custom view</span>
            </pre>

            <div style={{ width: "80%", fontFamily: "Courier New" }}>
                Shows a switch with a custom displayView that renders a check mark if on, and a x if
                off.
            </div>

            <pre style={storyHeaderStyle}>
                <span>: SwitchGroup :</span>
            </pre>
            <SwitchGroup
                options={["Internal", "External"]}
                displayView={v =>
                    v === 1 ? (
                        <span>☒</span>
                    ) : (
                        <span style={{ fontSize: 16, color: "#0DA75D" }}>☑</span>
                    )
                }
                isHidden={false}
                isDisabled={false}
                isBeingEdited={false}
                isRequired={false}
                value={value}
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

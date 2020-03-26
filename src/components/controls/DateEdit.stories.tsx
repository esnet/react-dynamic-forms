import { add } from "date-fns";
import React from "react";
import { FormGroupLayout } from "../..";
import { DateEditGroup } from "./DateEditControl";
export default { title: "DateEdit" };

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

const initialValue = new Date();

const fixedProps = {
    // textedit props
    width: 250,
    name: "birthdate",
    field: "birthdate",
    label: "Birth date",
    labelWidth: 140,
    placeholder: "Enter your date of birth",
    help: "This is some **text** with markdown in it!"
};

export const basicDateEdit = () => {
    // State
    const [value, setValue] = React.useState<Date>(initialValue);
    const [hasMissing, setHasMissing] = React.useState<boolean>(false);
    const [hasErrors, setHasErrors] = React.useState<boolean>(false);

    const callbacks = {
        onSelectItem: () => {},
        onChange: (_: any, value: Date) => setValue(value),
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
                <span>Basic DateEdit control</span>
            </pre>

            <div style={{ width: "80%", fontFamily: "Courier New" }}>
                Shows a DateEdit control with an initial value
            </div>

            <pre style={storyHeaderStyle}>
                <span>: DateEditGroup :</span>
            </pre>

            <DateEditGroup
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

export const requiredDateEdit = () => {
    // State
    const [value, setValue] = React.useState<Date | null>(null);
    const [hasMissing, setHasMissing] = React.useState<boolean>(false);
    const [hasErrors, setHasErrors] = React.useState<boolean>(false);

    const callbacks = {
        onSelectItem: () => {},
        onChange: (_: any, value: Date) => setValue(value),
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
                <span>Basic DateEdit control</span>
            </pre>

            <div style={{ width: "80%", fontFamily: "Courier New" }}>
                Shows a DateEdit control with an initial value
            </div>

            <pre style={storyHeaderStyle}>
                <span>: DateEditGroup :</span>
            </pre>

            <DateEditGroup
                isHidden={false}
                isDisabled={false}
                isBeingEdited={true}
                isRequired={true}
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

export const disabledDateEdit = () => {
    // State
    const [value, setValue] = React.useState<Date>(initialValue);
    const [hasMissing, setHasMissing] = React.useState<boolean>(false);
    const [hasErrors, setHasErrors] = React.useState<boolean>(false);

    const callbacks = {
        onSelectItem: () => {},
        onChange: (_: any, value: Date) => setValue(value),
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
                <span>Basic DateEdit control</span>
            </pre>

            <div style={{ width: "80%", fontFamily: "Courier New" }}>
                Shows a DateEdit control with an initial value
            </div>

            <pre style={storyHeaderStyle}>
                <span>: DateEditGroup :</span>
            </pre>

            <DateEditGroup
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

export const viewOnlyDateEdit = () => {
    // State
    const [value, setValue] = React.useState<Date>(initialValue);
    const [hasMissing, setHasMissing] = React.useState<boolean>(false);
    const [hasErrors, setHasErrors] = React.useState<boolean>(false);

    const callbacks = {
        onSelectItem: () => {},
        onChange: (_: any, value: Date) => setValue(value),
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
                <span>Basic DateEdit control</span>
            </pre>

            <div style={{ width: "80%", fontFamily: "Courier New" }}>
                Shows a DateEdit control with an initial value
            </div>

            <pre style={storyHeaderStyle}>
                <span>: DateEditGroup :</span>
            </pre>

            <DateEditGroup
                isHidden={false}
                isDisabled={false}
                isBeingEdited={false}
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

export const monthPicker = () => {
    // State
    const [value, setValue] = React.useState<Date>(initialValue);
    const [hasMissing, setHasMissing] = React.useState<boolean>(false);
    const [hasErrors, setHasErrors] = React.useState<boolean>(false);

    const callbacks = {
        onSelectItem: () => {},
        onChange: (_: any, value: Date) => setValue(value),
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
                <span>Month DateEdit control</span>
            </pre>

            <div style={{ width: "80%", fontFamily: "Courier New" }}>
                Shows a DateEdit control that lets you select the month and year only
            </div>

            <pre style={storyHeaderStyle}>
                <span>: DateEditGroup :</span>
            </pre>

            <DateEditGroup
                monthPicker
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

export const viewOnlyMonthPicker = () => {
    // State
    const [value, setValue] = React.useState<Date>(initialValue);
    const [hasMissing, setHasMissing] = React.useState<boolean>(false);
    const [hasErrors, setHasErrors] = React.useState<boolean>(false);

    const callbacks = {
        onSelectItem: () => {},
        onChange: (_: any, value: Date) => setValue(value),
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
                <span>Month DateEdit control</span>
            </pre>

            <div style={{ width: "80%", fontFamily: "Courier New" }}>
                Shows a DateEdit control that lets you select the month and year only
            </div>

            <pre style={storyHeaderStyle}>
                <span>: DateEditGroup :</span>
            </pre>

            <DateEditGroup
                monthPicker
                isHidden={false}
                isDisabled={false}
                isBeingEdited={false}
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

export const timePicker = () => {
    // State
    const [value, setValue] = React.useState<Date>(initialValue);
    const [hasMissing, setHasMissing] = React.useState<boolean>(false);
    const [hasErrors, setHasErrors] = React.useState<boolean>(false);

    const callbacks = {
        onSelectItem: () => {},
        onChange: (_: any, value: Date) => setValue(value),
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
                <span>Time DateEdit control</span>
            </pre>

            <div style={{ width: "80%", fontFamily: "Courier New" }}>
                Shows a DateEdit control that lets you select the Date and Time
            </div>

            <pre style={storyHeaderStyle}>
                <span>: DateEditGroup :</span>
            </pre>

            <DateEditGroup
                timePicker
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

export const viewOnlyTimePicker = () => {
    // State
    const [value, setValue] = React.useState<Date>(initialValue);
    const [hasMissing, setHasMissing] = React.useState<boolean>(false);
    const [hasErrors, setHasErrors] = React.useState<boolean>(false);

    const callbacks = {
        onSelectItem: () => {},
        onChange: (_: any, value: Date) => setValue(value),
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
                <span>Time DateEdit control in view only mode</span>
            </pre>

            <div style={{ width: "80%", fontFamily: "Courier New" }}>
                Shows a DateEdit control in non-edit mode formatted as 12-31-2019 8:59 PM
            </div>

            <pre style={storyHeaderStyle}>
                <span>: DateEditGroup :</span>
            </pre>

            <DateEditGroup
                timePicker
                isHidden={false}
                isDisabled={false}
                isBeingEdited={false}
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

export const constrainedDateEdit = () => {
    // State
    const [value, setValue] = React.useState<Date>(initialValue);
    const [hasMissing, setHasMissing] = React.useState<boolean>(false);
    const [hasErrors, setHasErrors] = React.useState<boolean>(false);

    const callbacks = {
        onSelectItem: () => {},
        onChange: (_: any, value: Date) => setValue(value),
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
                <span>Constrained DateEdit control</span>
            </pre>

            <div style={{ width: "80%", fontFamily: "Courier New" }}>
                Shows a DateEdit control with date selection needing to be in the next 7 days. This
                uses the `maxDate` and `minDate` props.
            </div>

            <pre style={storyHeaderStyle}>
                <span>: DateEditGroup :</span>
            </pre>

            <DateEditGroup
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
                minDate={new Date()}
                maxDate={add(new Date(), { days: 7 })}
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

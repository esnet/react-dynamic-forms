import React from "react";
import { FormGroupLayout } from "../..";
import { TagsGroup } from "./TagsControl";

export default { title: "Tags" };

const storyHeaderStyle = { fontSize: 12, paddingTop: 30 };

const outputStyle = {
    background: "#F3F3F3",
    borderRadius: 5,
    margin: 20,
    padding: 10
};

const initialValue = ["orange", "yellow", "green"];

const tagList = [
    "ocean",
    "blue",
    "purple",
    "red",
    "orange",
    "yellow",
    "green",
    "forest",
    "slate",
    "silver"
];

const fixedProps = {
    // tag editor props
    width: 380,
    name: "colors",
    field: "colors",
    label: "Color labels",
    labelWidth: 140,
    placeholder: "Choose a set of colors"
};

export const basicTagEditor = () => {
    // State
    const [value, setValue] = React.useState<string[]>(initialValue);
    const [hasMissing] = React.useState<boolean>(false);
    const [hasErrors] = React.useState<boolean>(false);

    const callbacks = {
        onSelectItem: () => {},
        onChange: (_: any, v: string[]) => {
            setValue(v);
        },
        onBlur: () => {},
        onErrorCountChange: () => {},
        onMissingCountChange: () => {},
        onEditItem: () => {}
    };

    return (
        <div style={{ padding: 50 }}>
            <pre style={{ fontSize: 18 }}>
                <span>Basic Tag Editor</span>
            </pre>

            <div style={{ width: "80%", fontFamily: "Courier New" }}>
                Shows an tag editor outside a Form.
            </div>

            <pre style={storyHeaderStyle}>
                <span>: TagGroup :</span>
            </pre>

            <TagsGroup
                tagList={tagList}
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

export const requiredTagEditor = () => {
    // State
    const [value, setValue] = React.useState<string[]>(initialValue);
    const [hasMissing, setHasMissing] = React.useState<boolean>(false);
    const [hasErrors, setHasErrors] = React.useState<boolean>(false);

    const callbacks = {
        onSelectItem: () => {},
        onChange: (_: any, v: string[]) => {
            setValue(v);
        },
        onBlur: () => {},
        onErrorCountChange: (_: any, errors: number) => {
            setHasErrors(errors > 0 ? true : false);
        },
        onMissingCountChange: (_: any, missing: number) => {
            setHasMissing(missing > 0 ? true : false);
        },
        onEditItem: () => {}
    };

    return (
        <div style={{ padding: 50 }}>
            <pre style={{ fontSize: 18 }}>
                <span>Required Tag Editor</span>
            </pre>

            <div style={{ width: "80%", fontFamily: "Courier New" }}>
                Shows an tag editor outside a Form that requires at least one tag
            </div>

            <pre style={storyHeaderStyle}>
                <span>: TagGroup :</span>
            </pre>

            <TagsGroup
                tagList={tagList}
                isSearchable={false}
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

export const viewOnlyTagEditor = () => {
    // State
    const [value, setValue] = React.useState<string[]>(initialValue);
    const [hasMissing] = React.useState<boolean>(false);
    const [hasErrors] = React.useState<boolean>(false);

    const callbacks = {
        onSelectItem: () => {},
        onChange: (_: any, v: string[]) => {
            setValue(v);
        },
        onBlur: () => {},
        onErrorCountChange: () => {},
        onMissingCountChange: () => {},
        onEditItem: () => {}
    };

    return (
        <div style={{ padding: 50 }}>
            <pre style={{ fontSize: 18 }}>
                <span>View mode tags</span>
            </pre>

            <div style={{ width: "80%", fontFamily: "Courier New" }}>
                Shows an tag editor in view only mode outside a Form.
            </div>

            <pre style={storyHeaderStyle}>
                <span>: TagGroup :</span>
            </pre>

            <TagsGroup
                tagList={tagList}
                isSearchable={false}
                isHidden={false}
                isDisabled={false}
                isBeingEdited={false}
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

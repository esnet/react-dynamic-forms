import Immutable from "immutable";
import React from "react";
import { FormGroupLayout } from "../..";
import { ChooserGroup } from "./ChooserControl";

export default { title: "Chooser" };

const initialValue = 0;

const availableTypes = Immutable.fromJS([
    { id: 0, label: "Friend" },
    { id: 1, label: "Acquaintance" }
]);

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

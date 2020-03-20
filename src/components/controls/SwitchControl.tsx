/**
 *  Copyright (c) 2015 - present, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import Flexbox from "@g07cha/flexbox-react";
import _ from "lodash";
import React, { FunctionComponent } from "react";
import Form from "react-bootstrap/Form";
import { validate } from "revalidator";
import { formGroup, FormGroupProps } from "../../hoc/group";
// Styling
import "../../style/textedit.css";
import { editAction } from "../../util/actions";
import { inlineStyle } from "../../util/style";
import { FieldValue } from "../Form";

interface ValidationError {
    validationError: boolean;
    validationErrorMessage: string | null;
}

export interface SwitchProps {
    options?: [string, string];

    /**
     * Required on all Controls
     */
    field: string;

    /**
     * Customize the horizontal size of the Chooser
     */
    width?: number;

    /**
     * The TextEdit type, such as "password"
     */
    type?: string;

    /**
     * Rules to apply
     */
    rules?: any;

    /**
     * Optional view component to render when the field
     * isn't being editted.
     */
    view?: (value: FieldValue) => React.ReactElement<any>;
}

interface SwitchControlState {
    checked: boolean;
    hover: boolean;
}

// Props passed into the Switch are the above Props combined with what is
// passed into the Group that wraps this.

export type SwitchControlProps = SwitchProps & FormGroupProps;

/**
 * This is the control code implemented here which wraps the react-bootstrap Switch widget
 */
class SwitchControl extends React.Component<SwitchControlProps, SwitchControlState> {
    switch: any;

    state = {
        checked: false,
        hover: false
    };

    constructor(props: SwitchControlProps) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleMouseEnter() {
        this.setState({ hover: true });
    }

    handleMouseLeave() {
        this.setState({ hover: false });
    }

    handleEditItem() {
        if (this.props.onEditItem) {
            this.props.onEditItem(this.props.name);
        }
    }

    isEmpty(value: FieldValue) {
        return _.isNull(value) || _.isUndefined(value) || value === "";
    }

    isMissing(value: FieldValue) {
        const { isRequired, isDisabled } = this.props;
        return isRequired && !isDisabled && this.isEmpty(value);
    }

    getError(value: FieldValue) {
        const { name = "value", validation, isDisabled } = this.props;

        const result: ValidationError = {
            validationError: false,
            validationErrorMessage: null
        };

        // If the user has a field blank then that is never an error. Likewise if the field
        // is disabled then that is never an error.
        if (this.isEmpty(value) || isDisabled) {
            return result;
        }

        // Validate the value with Revalidator, given the rules in this.props.rules
        let obj = {};
        obj[name] = value;

        let properties = {};
        properties[name] = validation;

        const rules = validation ? { properties } : null;
        if (obj && rules) {
            const validation = validate(obj, rules, { cast: true });
            const str = name || "Value";

            let msg;
            if (!validation.valid) {
                msg = `${str} ${validation.errors[0].message}`;
                result.validationError = true;
                result.validationErrorMessage = msg;
            }
        }
        return result;
    }

    UNSAFE_componentWillReceiveProps(nextProps: SwitchControlProps) {
        const { checked } = this.state;
        const newChecked = nextProps.value === 0 ? false : true;
        if (checked !== newChecked) {
            this.setState({ checked: newChecked });
        }
    }

    UNSAFE_componentWillMount() {
        const { value } = this.props;
        const checked = value === 0 ? false : true;
        this.setState({ checked });
    }

    handleChange(checked: boolean): void {
        console.log("handleChange", checked);
        const { name, onChange } = this.props;
        this.setState({ checked }, () => {
            let v: FieldValue = checked ? 1 : 0;
            onChange?.(name, v);
        });
    }

    render() {
        const { isDisabled, isBeingEdited, options = ["On", "Off"] } = this.props;
        const { checked } = this.state;

        if (isBeingEdited) {
            return (
                <Flexbox flexDirection="row" style={{ width: "100%" }}>
                    <div style={{ width: "100%" }}>
                        <Form.Group>
                            <Form.Check
                                name="switch"
                                checked={checked}
                                id="switch"
                                // ref={(ref: any) => {
                                //     this.switch = ref;
                                // }}
                                type="switch"
                                disabled={isDisabled}
                                label={checked ? options[1] : options[0]}
                                onChange={() => this.handleChange(!checked)}
                            />
                        </Form.Group>
                    </div>
                </Flexbox>
            );
        } else {
            let view: React.ReactElement;

            const { displayView } = this.props;
            console.log({ displayView });
            if (_.isFunction(displayView)) {
                const callableDisplayView = displayView as (
                    value: FieldValue
                ) => React.ReactElement;
                view = (
                    <span style={{ minHeight: 28 }}>
                        {callableDisplayView(checked ? options[1] : options[0])}
                    </span>
                );
            } else if (_.isString(displayView)) {
                const text = displayView as string;
                view = <span>{text}</span>;
            } else {
                view = (
                    <span style={{ minHeight: 28 }}>{`${checked ? options[1] : options[0]}`}</span>
                );
            }

            const edit = editAction(this.state.hover && this.props.allowEdit, () =>
                this.handleEditItem()
            );

            const style = inlineStyle(false, false);

            return (
                <div
                    style={style}
                    onMouseEnter={() => this.handleMouseEnter()}
                    onMouseLeave={() => this.handleMouseLeave()}
                >
                    {view}
                    {edit}
                </div>
            );
        }
    }
}

/**
 * A `SwitchControlGroup` is a `SwitchControl` wrapped by the `formGroup()` HOC. This is the
 * component which can be rendered by the Form when the user adds a `Switch` to their `Form`.
 */
export const SwitchGroup = formGroup<SwitchProps>(SwitchControl);

/**
 * A control which allows the user to interact with a single toggle control
 */
export const Switch: FunctionComponent<SwitchProps> = () => <></>;

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
import {
    colors,
    inlineCancelButtonStyle,
    inlineDoneButtonStyle,
    inlineStyle
} from "../../util/style";
import { FieldValue } from "../Form";

interface ValidationError {
    validationError: boolean;
    validationErrorMessage: string | null;
}

export interface TextEditProps {
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

interface TextEditControlState {
    value: FieldValue;
    oldValue: FieldValue;
    isFocused: boolean;
    touched: boolean;
    selectText: boolean;
    hover: boolean;
}

// Props passed into the Chooser are the above Props combined with what is
// passed into the Group that wraps this.

export type TextEditControlProps = TextEditProps & FormGroupProps;

/**
 * This is the control code implemented here which wraps the bootstrap Input widget
 */
class TextEditControl extends React.Component<TextEditControlProps, TextEditControlState> {
    textInput: any;

    state = {
        value: null,
        oldValue: null,
        isFocused: false,
        touched: false,
        selectText: false,
        hover: false
    };

    constructor(props: TextEditControlProps) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
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

    UNSAFE_componentWillReceiveProps(nextProps: TextEditControlProps) {
        const { name, isBeingEdited, onErrorCountChange, onMissingCountChange } = this.props;
        const { isFocused, value } = this.state;

        if (
            nextProps.isSelected &&
            isBeingEdited !== nextProps.isBeingEdited &&
            nextProps.isBeingEdited === true
        ) {
            this.setState({ selectText: true });
        }
        if (value !== nextProps.value && !isFocused) {
            this.setState({ value: nextProps.value });

            // Broadcast error and missing states up to the parent
            const missing = this.isMissing(nextProps.value);
            const { validationError: error } = this.getError(nextProps.value);
            onErrorCountChange?.(name, error ? 1 : 0);
            onMissingCountChange?.(name, missing ? 1 : 0);
        }
    }

    UNSAFE_componentWillMount() {
        const { name, value, onErrorCountChange, onMissingCountChange } = this.props;

        // Component mounted, so grab the initial value and put it in state
        this.setState({ value });

        // Initial error and missing states are fed up to the parent
        const missing = this.isMissing(value);
        const { validationError } = this.getError(value);

        onErrorCountChange?.(name, validationError ? 1 : 0);
        onMissingCountChange?.(name, missing ? 1 : 0);
    }

    componentDidUpdate() {
        if (this.state.selectText) {
            this.textInput.focus();
            this.textInput.select();
            this.setState({ selectText: false });
        }
    }

    handleChange(e: React.FormEvent<any>): void {
        const {
            name,
            isRequired,
            rules,
            onChange,
            onErrorCountChange,
            onMissingCountChange
        } = this.props;

        const value: string = (e.target as HTMLInputElement).value;
        this.setState({ value }, () => {
            const missing = isRequired && this.isEmpty(value);
            const { validationError } = this.getError(value);
            let cast: FieldValue = value;

            // Callbacks
            onErrorCountChange?.(name, validationError ? 1 : 0);
            onMissingCountChange?.(name, missing ? 1 : 0);

            if (onChange) {
                if (_.has(rules, "type")) {
                    switch (rules.type) {
                        case "integer":
                            cast = value === "" ? null : parseInt(value, 10);
                            break;
                        case "number":
                            cast = value === "" ? null : parseFloat(value);
                            break;
                        //pass
                        default:
                    }
                }
                onChange(name, cast);
            }
        });
    }

    handleFocus(): void {
        const { value } = this.props;
        const { isFocused } = this.state;

        if (!isFocused) {
            this.setState({ isFocused: true, oldValue: value });
        }
    }

    handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>): void {
        if (e.key === "Enter") {
            if (!e.shiftKey) {
                this.handleDone();
            }
        }
        if (e.keyCode === 27 /* ESC */) {
            this.handleCancel();
        }
    }

    handleDone() {
        const { name, onBlur } = this.props;
        onBlur?.(name);
        this.setState({ isFocused: false, hover: false, oldValue: null });
    }

    handleCancel() {
        const { name, rules, onChange, onBlur } = this.props;

        if (onChange) {
            const v = this.state.oldValue;
            let cast: FieldValue = v;
            if (_.has(rules, "type")) {
                // If we have a rule for the value to be either an interger or a number
                // then we parse the string to either an Int or Float and set the onChange
                // value to that
                if (_.isString(v)) {
                    switch (rules.type) {
                        case "integer":
                            cast = v === "" ? null : parseInt(v, 10);
                            break;
                        case "number":
                            cast = v === "" ? null : parseFloat(v);
                            break;
                        //pass
                        default:
                    }
                }
            }
            onChange(name, cast);
        }
        onBlur?.(name);
        this.setState({ isFocused: false, hover: false, oldValue: null });
    }

    render() {
        const { isDisabled, isBeingEdited, placeholder } = this.props;
        const { value, touched } = this.state;

        // Control state
        const isMissing = this.isMissing(value);
        const { validationError, validationErrorMessage } = this.getError(value);
        const v = this.state.value ? `${this.state.value}` : "";

        if (isBeingEdited) {
            // Error style/message
            let className = "";
            const msg = validationError && touched ? validationErrorMessage : "";
            let helpClassName = "help-block";
            if (validationError && touched) {
                helpClassName += " has-error";
                className = "has-error";
            }

            // Warning style
            const style = isMissing ? { background: colors.MISSING_COLOR_BG } : {};
            const type = this.props.type || "text";

            const canCommit = !isMissing && !validationError;

            return (
                <Flexbox flexDirection="row" style={{ width: "100%" }}>
                    <div className={className} style={{ width: "100%" }}>
                        <Form.Control
                            value={v}
                            size="sm"
                            ref={(input: any) => {
                                this.textInput = input;
                            }}
                            style={style}
                            type={type}
                            disabled={isDisabled}
                            placeholder={placeholder}
                            onChange={this.handleChange}
                            onFocus={this.handleFocus}
                            onKeyUp={this.handleKeyPress}
                        />
                        <div className={helpClassName}>{msg}</div>
                    </div>
                    {this.props.isSelected ? (
                        <span style={{ marginTop: 3 }}>
                            {canCommit ? (
                                <span
                                    style={inlineDoneButtonStyle(5, true)}
                                    onClick={() => this.handleDone()}
                                >
                                    DONE
                                </span>
                            ) : (
                                <span style={inlineDoneButtonStyle(5, false)}>DONE</span>
                            )}

                            <span
                                style={inlineCancelButtonStyle()}
                                onClick={() => this.handleCancel()}
                            >
                                CANCEL
                            </span>
                        </span>
                    ) : (
                        <div />
                    )}
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
                view = <span style={{ minHeight: 28 }}>{callableDisplayView(v)}</span>;
            } else if (_.isString(displayView)) {
                const text = displayView as string;
                view = <span>{text}</span>;
            } else {
                view = <span style={{ minHeight: 28 }}>{`${v}`}</span>;
            }

            const edit = editAction(this.state.hover && this.props.allowEdit, () =>
                this.handleEditItem()
            );

            const style = inlineStyle(false, isMissing ? isMissing : false);

            return (
                <div
                    style={style}
                    key={`key-${isMissing}`}
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
 * A `TextEditGroup` is a `TextEditControl` wrapped by the `formGroup()` HOC. This is the
 * component which can be rendered by the Form when the user adds a `TextEdit` to their `Form`.
 */
export const TextEditGroup = formGroup<TextEditProps>(TextEditControl);

/**
 * A control which allows the user to type into a single line input control
 */
export const TextEdit: FunctionComponent<TextEditProps> = () => <></>;

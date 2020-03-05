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
import deepCopy from "deepcopy";
import Immutable from "immutable";
import _ from "lodash";
import React from "react";
import { FormGroupProps } from "../hoc/group";
import { FormEditStates, FormGroupLayout } from "../util/constants";
import { TextEdit } from "./controls";
import { Chooser, ChooserGroup, ChooserProps } from "./controls/ChooserControl";
import { TextEditGroup, TextEditProps } from "./controls/TextEditControl";
import Field, { FieldProps } from "./Field";
import Schema, { SchemaProps } from "./Schema";

// A value passed down the controls, or relayed back up if changed by the user is of this type,
// basically a number or string, or alternatively missing as null or never defined as undefined.
export type FieldValue =
    | number
    | string
    | Immutable.List<Immutable.Map<string, FieldValue>>
    | null
    | undefined;

// Utility function to return if the React element tree traversal has found an element which is a Schema
const isChildSchema = (child: React.ReactElement<any>) => child.type === Schema;

// Utility function to return if the React element tree traversal has found an element which is a Field
const isChildField = (child: React.ReactElement<any>) => child.type === Field;

// Map relating form field name and various properties of the field
export interface FormFields {
    [fieldName: string]: {
        label: string;
        placeholder: string;
        help: string;
        disabled: boolean;
        tags: string[];
    };
}

// Traverses the Schema and it's contained Fields and lifts those field props
// into a map from fieldName to a structure containing those props. Those props
// include the label, placeholder, help text and if the field is disabled.
function getFieldsFromSchema(schema: React.ReactElement): FormFields {
    let fields: FormFields = {} as any;

    if (React.isValidElement(schema) && isChildSchema(schema)) {
        const props = schema.props as SchemaProps;
        React.Children.forEach(props.children, field => {
            const props = field.props as FieldProps;
            if (isChildField(field)) {
                fields[props.name] = deepCopy(field.props);
            }
        });
    }

    return fields;
}

// A mapping from fieldName to validation information
export interface FormRules {
    [fieldName: string]: { required: boolean; validation: any };
}

// Traverses the Schema and it's contained Fields looking for rules. These are collected as
// a map from the field name to a structure containing if the field is required and a
// validation object
function getRulesFromSchema(schema: React.ReactNode): FormRules {
    let rules = {};

    if (React.isValidElement(schema) && isChildSchema(schema)) {
        React.Children.forEach(schema.props.children, child => {
            if (isChildField(child)) {
                const required = child.props.required || false;
                const validation = deepCopy(child.props.validation);
                // the conform is a function that can not be copied properly
                if (child.props.validation && "conform" in child.props.validation) {
                    validation["conform"] = child.props.validation["conform"];
                }
                rules[child.props.name] = { required, validation };
            }
        });
    }

    return rules;
}

// Structure for passing around this triplet of form information
export interface FormStruct {
    formFields: FormFields;
    formRules: FormRules;
    formHiddenList: string[];
}

// Props for the Form component
export interface FormProps {
    name: string;
    value: Immutable.Map<string, FieldValue>;
    initialValue: Immutable.Map<string, FieldValue>;
    schema: React.ReactElement;
    formStyle?: any;
    formClassName?: string;
    formKey?: string;
    groupLayout?: string;
    visible?: string | string[];
    edit?: string; // enum?
    inline?: boolean;
    visibility?: boolean;
    inner?: boolean;
    labelWidth?: number;
    onMissingCountChange?: (
        fieldName: string,
        missingCount: number,
        missingFields: string[]
    ) => void;
    onErrorCountChange?: (fieldName: string, errorCount: number, errorFields: string[]) => void;
    onPendingChange?: (fieldName: string, value: FieldValue) => FieldValue;
    onChange?: (fieldName: string, value: Immutable.Map<string, FieldValue>) => void;
}

// State for the Form component
export interface FormState {
    missingCounts: { [fieldName: string]: number };
    errorCounts: { [fieldName: string]: number };
    selection: any;
}

// Props which maybe injected into to a rendered element containing a field reference
// export interface FieldEditorProps {
//     // Values
//     value: FieldValue;
//     initialValue: FieldValue;

//     // Group
//     name: string; // The internal name for the field
//     label: string; // The public visible name for the field, displayed along side its value or control in the form
//     labelWidth: number; // The width the label should be
//     edit: boolean; // Is the control currently being editted (e.g. inline editing)
//     required: boolean; // Is the control required
//     showRequired: boolean; // Should we currenly inforce it being required (the user might not have had a chance to enter something)
//     disabled: boolean; // Should the control be displayed as disabled, preventing the user from interacting with it

//     // Schema
//     placeholder: string; // Placeholder text displayed in some controls before the user types into them
//     help: string; // Help text for using the field control

//     // Driven by the form
//     hidden: boolean; // Should this control be currently hidden
//     selected: boolean; // Is the control currently selected
//     allowEdit: boolean; // Can this item actually be editted right now
//     layout: string; // enum?
//     validation: any; // From the field rules

//     // Callbacks that hook the editor up to the form
//     onSelectItem: (fieldName: string) => void;
//     onErrorCountChange: (fieldName: string, count: number) => void;
//     onMissingCountChange: (fieldName: string, count: number) => void;
//     onChange: (fieldName: string, d: any) => void;
//     onBlur: (fieldName: string) => void;
//     onEditItem: (fieldName: string) => void;
// }

export default class Form extends React.Component<FormProps, FormState> {
    _deferSet: boolean;
    _pendingMissing: { [fieldName: string]: number } | null;
    _pendingErrors: { [fieldName: string]: number } | null;
    _pendingValues: Immutable.Map<string, FieldValue> | null;

    static defaultProps = {
        groupLayout: "ROW",
        labelWidth: 300
    };

    constructor(props: FormProps) {
        super(props);
        this.state = {
            missingCounts: {},
            errorCounts: {},
            selection: null
        };
    }

    /**
     * Collect together props for the given fieldName which can
     * be applied to any of the formGroup wrapped form widgets. These
     * props contain info extracted from our schema and current
     * values, namely from:
     *   - formFields
     *   - formRules
     *   - formValues
     *
     * In addition, the props contain callbacks for:
     *   - value changed
     *   - missing count changed
     *   - error counts changed
     *   - edit selection
     */
    getFieldProps(
        { formFields, formRules, formHiddenList }: FormStruct,
        fieldName: string
    ): FormGroupProps {
        const { labelWidth, edit, value, initialValue, groupLayout } = this.props;
        const { selection } = this.state;

        let props: FormGroupProps = {} as any;
        props.labelWidth = labelWidth || 300;

        if (_.has(formFields, fieldName)) {
            // props.key = fieldName;
            props.name = fieldName;
            props.label = formFields[fieldName].label;
            props.placeholder = formFields[fieldName].placeholder;
            props.help = formFields[fieldName].help;
            props.hidden = false;
            props.disabled = false;

            props.selected = false;
            props.edit = false;
            props.showRequired = true;

            if (edit === FormEditStates.SELECTED) {
                if (selection === fieldName) {
                    props.edit = true;
                    props.selected = true;
                }
                props.showRequired = props.edit;
                props.allowEdit = true;
            } else if (edit === FormEditStates.ALWAYS) {
                props.edit = true;
            } else if (edit === FormEditStates.NEVER) {
                props.showRequired = false;
            }

            if (edit === FormEditStates.TABLE) {
                props.allowEdit = false;
                props.layout = FormGroupLayout.INLINE;
            } else {
                props.layout = groupLayout ? groupLayout : FormEditStates.ALWAYS;
            }

            if (formFields[fieldName].disabled) {
                props.disabled = true;
            }

            // Is the field in the hidden list?
            if (_.includes(formHiddenList, fieldName)) {
                props.disabled = true;
                props.hidden = true;
            }
        } else {
            throw new Error(`Attr '${fieldName}' is not a part of the form schema`);
        }

        // If the field is required and validation rules
        if (_.has(formRules, fieldName)) {
            props.required = formRules[fieldName].required;
            props.validation = formRules[fieldName].validation;
        }

        // Field value (current and initial)
        if (this.props.value.has(fieldName)) {
            props.value = value.get(fieldName);
            props.initialValue = initialValue ? this.props.initialValue.get(fieldName) : null;
        }

        // Callbacks
        props.onSelectItem = fieldName => this.handleSelectItem(fieldName);
        props.onErrorCountChange = (fieldName, count) =>
            this.handleErrorCountChange(fieldName, count);
        props.onMissingCountChange = (fieldName, count) =>
            this.handleMissingCountChange(fieldName, count);
        props.onChange = (fieldName, d) => this.handleChange(fieldName, d);
        props.onBlur = () => this.handleBlur();

        return props;
    }

    /**
     * Queue state pushes pending value of state to our parent's callback. The important
     * thing here is that the action is deferred, meaning it will be called only
     * after the callstack is unwound. The deferred action also blocks other deferred
     * actions until it is run.
     *
     * When the deferred action takes place, the following happens:
     *
     *     1 A user action occurs
     *     2 queueChange is called one or many times
     *     3 stack unwinds...
     *     --
     *     4 A state structure is constructed out of the _pending* structures
     *     5 setState is actually called, which will cause React to re-render
     *         5a rendering may mount new form elements, which may themselves
     *            result in calls to queueChange() (for example: mounted components
     *            will report their missing/error states via supplied callbacks)
     *         5b those changes will also be added to the pending structures, but will
     *            not be flushed until the outer queueChange deferred action is complete
     *     6 callbacks registered with us are called with updated values, missing counts
     *       and error counts
     *     7 stack unwinds...
     *     --
     *     8 stack unwinds again and the deferred action will be called again if another was created
     *       as a side effect of step (5) above
     */
    queueChange() {
        const { name } = this.props;
        if (!this._deferSet) {
            _.defer(() => {
                this._deferSet = false;

                // Write in missingCounts and errorCounts into our state
                let state: FormState = {} as any;
                if (this._pendingMissing) {
                    state.missingCounts = this._pendingMissing;
                }
                if (this._pendingErrors) {
                    state.errorCounts = this._pendingErrors;
                }
                this.setState(state);

                let missingCount = 0;
                let errorCount = 0;

                const schema = this.props.schema;
                const formFields = getFieldsFromSchema(schema);
                const ignoreList = this.getHiddenFields(formFields);

                // Missing count callback
                if (this._pendingMissing) {
                    const missingFields: string[] = [];
                    _.each(this._pendingMissing, (c, fieldName) => {
                        if (!_.includes(ignoreList, fieldName)) {
                            missingCount += c;
                            missingFields.push(fieldName);
                        }
                    });
                    if (this.props.onMissingCountChange) {
                        this.props.onMissingCountChange(name, missingCount, missingFields);
                    }
                    this._pendingMissing = null;
                }

                // Error callback
                if (this._pendingErrors) {
                    const errorFields: string[] = [];
                    _.each(this._pendingErrors, (c, fieldName) => {
                        if (!_.includes(ignoreList, fieldName)) {
                            missingCount += c;
                            errorFields.push(fieldName);
                        }
                        errorCount += c;
                    });
                    if (this.props.onErrorCountChange) {
                        this.props.onErrorCountChange(this.props.name, errorCount, errorFields);
                    }
                    this._pendingErrors = null;
                }

                // On change callback
                if (this._pendingValues) {
                    if (this.props.onChange) {
                        this.props.onChange(this.props.name, this._pendingValues);
                    }
                    this._pendingValues = null;
                }
            });
            this._deferSet = true;
        }
    }

    /**
     * If the form has a submit input and that fires then this will catch that
     * and pass it up to the forms onSubmit callback.
     */
    handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
    }

    /**
     * This is the handler for changes to the error state of this form's fields.
     *
     * If a field is complex, such as another form or a list view, then errorCount
     * will be the telly all the errors within that form or list. If it is a simple
     * field control, such as a TextEdit then the errorCount will be either 0 or 1.
     *
     * The mapping of field names (passed in as the fieldName) and the count is updated
     * in _pendingErrors until built up state is flushed to the related callback.
     */
    handleErrorCountChange(fieldName: string | undefined, errorCount: number) {
        this._pendingErrors = this._pendingErrors || deepCopy(this.state.errorCounts) || {};
        if (fieldName && this._pendingErrors) {
            this._pendingErrors[fieldName] = errorCount;
        }
        this.queueChange();
    }

    /**
     * This is the handler for changes to the missing state of this form controls.
     *
     * If a field is complex, such as another form or a list view, then missingCount
     * will be the telly all the missing values (for required fields) within that
     * form or list. If it is a simple control such as a textedit then the
     * missingCount will be either 0 or 1.
     *
     * The mapping of field names (passed in as the fieldName) and the missing count is
     * updated in _pendingMissing until built up state is flushed to the related callback.
     */
    handleMissingCountChange(fieldName: string | undefined, missingCount: number) {
        this._pendingMissing = this._pendingMissing || deepCopy(this.state.missingCounts) || {};
        if (fieldName && this._pendingMissing) {
            this._pendingMissing[fieldName] = missingCount;
        }
        this.queueChange();
    }

    /**
     * This is the main handler for value change notifications from
     * this form's controls.
     *
     * As part of this handler we call this.props.onPendingChange()
     * if it is supplied. This hook enables either the value to be modified
     * before it is included in the updated state.
     *
     * Changes to the formValues are queued in _pendingValues
     * until built up change is flushed to the onChange callback.
     */
    handleChange(fieldName: string | undefined, newValue: FieldValue) {
        const { onPendingChange } = this.props;

        // Hook to allow the component to alter the value before it is set.
        // However, you should be careful with side effects to state here.
        let v = newValue;
        if (fieldName && onPendingChange) {
            v = onPendingChange(fieldName, newValue) || v;
        }

        // If we don't have pending values then we build initialize them
        // out of the current values, then build on top of that with any
        // change notifications we get. We deliver those batched together
        // in queueChange after we've accumulated missing and error counts.

        this._pendingValues = this._pendingValues || this.props.value;
        if (fieldName) {
            this._pendingValues = this._pendingValues.set(fieldName, v);
        }
        this.queueChange();
    }

    handleBlur() {
        if (this.state.selection) {
            this.setState({ selection: null });
        }
    }

    /**
     * Handle the selection change. This is when you have an inline form
     * and the user clicks on the pencil icon to activate editing of
     * that item. That item is the selection. Only one item can be selected
     * at once. If the same item is selected again it is deselected.
     */
    handleSelectItem(fieldName: string | undefined) {
        if (this.state.selection !== fieldName) {
            this.setState({ selection: fieldName });
        } else {
            this.setState({ selection: null });
        }
    }

    /**
     * Returns the current list of hidden form fields using the `visible` prop
     * That prop is either a tag or list of tags. Those are compared to tags
     * for each field within the schema to determine a visibility set of fields.
     * This is called every render.
     */
    private getHiddenFields(formFields: FormFields): string[] {
        const { visible } = this.props;

        let result: string[] = [];
        if (visible) {
            _.each(formFields, (field, fieldName) => {
                let makeHidden;
                const tags = field.tags || [];
                if (_.isArray(visible)) {
                    makeHidden = !(
                        _.intersection(tags, visible).length > 0 || _.includes(tags, "all")
                    );
                } else {
                    makeHidden = !(_.includes(tags, visible) || _.includes(tags, "all"));
                }
                if (makeHidden) {
                    result.push(fieldName);
                }
            });
        }

        return result;
    }

    /**
     * Traverses all the children and builds the set of props for each element.
     * This is what takes the prop `field="field_id"`, looks up "field_id" on the schema
     * then applies all the needed props from the schema, along with callbacks, to
     * track state.
     */
    private traverseChildren(formStruct: FormStruct, childList: any) {
        const childCount = React.Children.count(childList);
        let children: any = [];
        React.Children.forEach(childList, (child, i) => {
            if (child) {
                let newChild;
                const key = child.key || `key-${i}`;

                // Setup props for the child
                let props: any = { key };
                if (typeof child.props.children !== "string") {
                    // If the child has a prop "field" on it, then we look up the props
                    // we want to use in our control for that field
                    if (_.has(child.props, "field")) {
                        const fieldName = child.props.field;
                        props = { ...props, ...this.getFieldProps(formStruct, fieldName) };
                        if (child.type === Chooser) {
                            const chooserProps = props as FormGroupProps & ChooserProps;
                            newChild = <ChooserGroup {...chooserProps} />;
                        } else if (child.type === TextEdit) {
                            const textEditProps = props as FormGroupProps & TextEditProps;
                            newChild = <TextEditGroup {...textEditProps} />;
                        } else {
                            newChild = React.cloneElement(child, props);
                        }
                    }

                    // Traverse into children
                    if (React.Children.count(child.props.children) > 0) {
                        props = {
                            ...props,
                            children: this.traverseChildren(formStruct, child.props.children)
                        };
                    }
                }

                if (newChild && childCount > 1) {
                    children.push(newChild);
                } else {
                    children = newChild;
                }
            } else {
                children = null;
            }
        });
        return children;
    }

    /**
     * Restrict how often we render the form. It's likely that the container
     * for the form is keeping track of other state such as missing counts, so
     * here we make sure something we care about actually changed before doing
     * the whole form render.
     */
    shouldComponentUpdate(nextProps: FormProps, nextState: FormState) {
        const { value, edit, schema, visibility } = this.props;
        const { selection } = this.state;

        const update =
            nextProps.value !== value ||
            nextProps.edit !== edit ||
            nextProps.schema !== schema ||
            nextProps.visibility !== visibility ||
            nextState.selection !== selection;

        return update;
    }

    /**
     * Render the form and all its children.
     */
    render() {
        const { edit, formStyle, formClassName, formKey, inline, inner, schema } = this.props;

        const formFields = getFieldsFromSchema(schema);
        const formRules = getRulesFromSchema(schema);
        const formHiddenList = this.getHiddenFields(formFields);

        const s: FormStruct = {
            formFields,
            formRules,
            formHiddenList
        };

        let formClass = formClassName;
        if (inline) {
            formClass += "form-inline";
        }

        if (edit === FormEditStates.TABLE) {
            return (
                <Flexbox flexDirection="row" className={formClassName} key={formKey}>
                    {this.traverseChildren(s, this.props.children)}
                </Flexbox>
            );
        } else {
            if (inner) {
                return (
                    <form
                        className={formClass}
                        style={formStyle}
                        key={formKey}
                        onSubmit={e => {
                            this.handleSubmit(e);
                        }}
                        noValidate
                    >
                        {this.traverseChildren(s, this.props.children)}
                    </form>
                );
            } else {
                return (
                    <div className={formClassName} style={formStyle} key={formKey}>
                        {this.traverseChildren(s, this.props.children)}
                    </div>
                );
            }
        }
    }
}

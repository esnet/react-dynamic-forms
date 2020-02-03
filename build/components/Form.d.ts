/**
 *  Copyright (c) 2015 - present, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */
import Immutable from "immutable";
import React from "react";
export declare type FieldValue = number | string | null | undefined;
export interface FormFields {
    [fieldName: string]: {
        label: string;
        placeholder: string;
        help: string;
        disabled: boolean;
        tags: string[];
    };
}
export interface FormRules {
    [fieldName: string]: {
        required: boolean;
        validation: any;
    };
}
export interface FormStruct {
    formFields: FormFields;
    formRules: FormRules;
    formHiddenList: string[];
}
export interface FormProps {
    name: string;
    value: Immutable.Map<string, FieldValue>;
    initialValue: Immutable.Map<string, FieldValue>;
    formStyle: any;
    formClassName: string;
    formKey: string;
    schema: React.ReactElement;
    groupLayout: string;
    visible: string | string[];
    edit: string;
    inline: boolean;
    visibility: boolean;
    inner: boolean;
    labelWidth: number;
    onMissingCountChange?: (fieldName: string, missingCount: number, missingFields: string[]) => void;
    onErrorCountChange?: (fieldName: string, errorCount: number, errorFields: string[]) => void;
    onPendingChange?: (fieldName: string, value: FieldValue) => FieldValue;
    onChange?: (fieldName: string, value: Immutable.Map<string, FieldValue>) => void;
}
export interface FormState {
    missingCounts: {
        [fieldName: string]: number;
    };
    errorCounts: {
        [fieldName: string]: number;
    };
    selection: any;
}
export interface FieldEditorProps {
    value: FieldValue;
    initialValue: FieldValue;
    labelWidth: number;
    key: string;
    name: string;
    label: string;
    placeholder: string;
    help: string;
    hidden: boolean;
    disabled: boolean;
    selected: boolean;
    edit: boolean;
    required: boolean;
    showRequired: boolean;
    allowEdit: boolean;
    layout: string;
    validation: any;
    onSelectItem: (fieldName: string) => void;
    onErrorCountChange: (fieldName: string, count: number) => void;
    onMissingCountChange: (fieldName: string, count: number) => void;
    onChange: (fieldName: string, d: any) => void;
    onBlur: (fieldName: string) => void;
    onEditItem?: (fieldName: string) => void;
}
export default class Form extends React.Component<FormProps, FormState> {
    _deferSet: boolean;
    _pendingMissing: {
        [fieldName: string]: number;
    } | null;
    _pendingErrors: {
        [fieldName: string]: number;
    } | null;
    _pendingValues: Immutable.Map<string, FieldValue> | null;
    constructor(props: FormProps);
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
    getFieldProps({ formFields, formRules, formHiddenList }: FormStruct, fieldName: string): FieldEditorProps;
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
    queueChange(): void;
    /**
     * If the form has a submit input and that fires then this will catch that
     * and pass it up to the forms onSubmit callback.
     */
    handleSubmit(e: React.FormEvent<HTMLFormElement>): void;
    /**
     * This is the handler for changes to the error state of this form's fields.
     *
     * If a field is complex, such as another form or a list view, then errorCount
     * will be the telly all the errors within that form or list. If it is a simple
     * field control, such as a textedit then the errorCount will be either 0 or 1.
     *
     * The mapping of field names (passed in as the fieldName) and the count is updated
     * in _pendingErrors until built up state is flushed to the related callback.
     */
    handleErrorCountChange(fieldName: string, errorCount: number): void;
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
    handleMissingCountChange(fieldName: string, missingCount: number): void;
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
    handleChange(fieldName: string, newValue: FieldValue): void;
    handleBlur(): void;
    /**
     * Handle the selection change. This is when you have an inline form
     * and the user clicks on the pencil icon to activate editing of
     * that item. That item is the selection. Only one item can be selected
     * at once. If the same item is selected again it is deselected.
     */
    handleSelectItem(fieldName: string): void;
    /**
     * Returns the current list of hidden form fields using the `visible` prop
     * That prop is either a tag or list of tags. Those are compared to tags
     * for each field within the schema to determine a visibility set of fields.
     * This is called every render.
     */
    private getHiddenFields;
    /**
     * Traverses all the children and builds the set of props for each element.
     * This is what takes the prop `field="field_id"`, looks up "field_id" on the schema
     * then applies all the needed props from the schema, along with callbacks, to
     * track state.
     */
    private traverseChildren;
    /**
     * Restrict how often we render the form. It's likely that the container
     * for the form is keeping track of other state such as missing counts, so
     * here we make sure something we care about actually changed before doing
     * the whole form render.
     */
    shouldComponentUpdate(nextProps: FormProps, nextState: FormState): boolean;
    /**
     * Render the form and all its children.
     */
    render(): JSX.Element;
}

/**
 *  Copyright (c) 2015 - present, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import React from "react";
import _ from "underscore";
import deepCopy from "deepcopy";
import Flexbox from "flexbox-react";
import PropTypes from "prop-types";

import Field from "./Field";
import Schema from "./Schema";
import { FormEditStates, FormGroupLayout } from "../js/constants";

// Pass in the <Schema> element and will return all the <Fields> under it.
function getFieldsFromSchema(schema) {
    if (!React.isValidElement(schema)) {
        return {};
    }

    let fields = {};
    if (schema.type === Schema) {
        React.Children.forEach(schema.props.children, child => {
            if (child.type === Field) {
                fields[child.props.name] = deepCopy(child.props);
            }
        });
    }
    return fields;
}

function getRulesFromSchema(schema) {
    if (!React.isValidElement(schema)) {
        return {};
    }

    let rules = {};
    if (schema.type === Schema) {
        React.Children.forEach(schema.props.children, child => {
            if (child.type === Field) {
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

export default class Form extends React.Component {
    constructor(props) {
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
    getFieldProps({ formFields, formRules, formHiddenList }, fieldName) {
        let props = {};
        props.labelWidth = this.props.labelWidth || 300;

        if (_.has(formFields, fieldName)) {
            props.key = fieldName;
            props.name = fieldName;
            props.label = formFields[fieldName].label;
            props.placeholder = formFields[fieldName].placeholder;
            props.help = formFields[fieldName].help;
            props.hidden = false;
            props.disabled = false;

            props.edit = false;
            props.showRequired = true;

            if (this.props.edit === FormEditStates.SELECTED) {
                props.edit = this.state.selection === fieldName;
                props.showRequired = props.edit;
                props.allowEdit = true;
            } else if (this.props.edit === FormEditStates.ALWAYS) {
                props.edit = true;
            } else if (this.props.edit === FormEditStates.NEVER) {
                props.showRequired = false;
            }

            if (this.props.edit === FormEditStates.TABLE) {
                props.layout = FormGroupLayout.INLINE;
            } else {
                props.layout = this.props.groupLayout;
            }

            if (formFields[fieldName].disabled) {
                props.disabled = true;
            }

            if (_.contains(formHiddenList, fieldName)) {
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

        // Field value
        if (this.props.value.has(fieldName)) {
            props.value = this.props.value.get(fieldName);
        }

        // Callbacks
        props.onSelectItem = (fieldName) => this.handleSelectItem(fieldName);
        props.onErrorCountChange = (fieldName, count) =>
            this.handleErrorCountChange(fieldName, count);
        props.onMissingCountChange = (fieldName, count) =>
            this.handleMissingCountChange(fieldName, count);
        props.onChange = (fieldName, d) => this.handleChange(fieldName, d);
        props.onBlur = (fieldName) => this.handleBlur(fieldName);

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
     *     4 A state structure is constructed out of the pending structures
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
        if (!this._deferSet) {
            _.defer(() => {
                this._deferSet = false;

                // Write in missingCounts and errorCounts into our state
                let state = {};
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
                    const missingFields = [];
                    _.each(this._pendingMissing, (c, fieldName) => {
                        if (!_.contains(ignoreList, fieldName)) {
                            missingCount += c;
                            missingFields.push(fieldName);
                        }
                    });
                    if (this.props.onMissingCountChange) {
                        this.props.onMissingCountChange(
                            this.props.name,
                            missingCount,
                            missingFields
                        );
                    }
                    this._pendingMissing = null;
                }

                // Error callback
                if (this._pendingErrors) {
                    const errorFields = [];
                    _.each(this._pendingErrors, (c, fieldName) => {
                        if (!_.contains(ignoreList, fieldName)) {
                            missingCount += c;
                            errorFields.push(fieldName);
                        }
                        errorCount += c;
                    });
                    if (this.props.onErrorCountChange) {
                        this.props.onErrorCountChange(this.props.name, errorCount, errorFields);
                    }
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
    handleSubmit(e) {
        e.preventDefault();
    }

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
    handleErrorCountChange(fieldName, errorCount) {
        this._pendingErrors = this._pendingErrors || deepCopy(this.state.errorCounts) || {};
        this._pendingErrors[fieldName] = errorCount;
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
    handleMissingCountChange(fieldName, missingCount) {
        this._pendingMissing = this._pendingMissing || deepCopy(this.state.missingCounts) || {};
        this._pendingMissing[fieldName] = missingCount;
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
    handleChange(fieldName, newValue) {
        // Hook to allow the component to alter the value before it is set.
        // However, you should be careful with side effects to state here.
        let v = newValue;
        if (this.props.onPendingChange) {
            v = this.props.onPendingChange(fieldName, newValue) || v;
        }

        // If we don't have pending values then we build initialize them
        // out of the current values, then build on top of that with any
        // change notifications we get. We deliver those batched together
        // in queueChange after we've accumulated missing and error counts.

        this._pendingValues = this._pendingValues || this.props.value;
        this._pendingValues = this._pendingValues.set(fieldName, v);
        this.queueChange();
    }

    handleBlur(fieldName) {
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
    handleSelectItem(fieldName) {
        if (this.state.selection !== fieldName) {
            this.setState({ selection: fieldName });
        } else {
            this.setState({ selection: null });
        }
    }

    /**
     * @private
     *
     * Returns the current list of hidden form fields using the `visible` prop
     * That prop is either a tag or list of tags. Those are compared to tags
     * for each field within the schema to determine a visibility set of fields.
     * This is called every render.
     */
    getHiddenFields(formFields) {
        let result = [];
        if (this.props.visible) {
            _.each(formFields, (field, fieldName) => {
                let makeHidden;
                const tags = field.tags || [];
                if (_.isArray(this.props.visible)) {
                    makeHidden = !(_.intersection(tags, this.props.visible).length > 0 ||
                        _.contains(tags, "all"));
                } else {
                    makeHidden = !(_.contains(tags, this.props.visible) || _.contains(tags, "all"));
                }
                if (makeHidden) {
                    result.push(fieldName);
                }
            });
        }
        return result;
    }

    /**
     * @private
     *
     * Traverses all the children and builds the set of props for each element.
     * This is what takes the prop `field="field_id"`, looks up "field_id" on the schema
     * then applies all the needed props from the schema, along with callbacks to
     * track state.
     */
    renderChildren(formState, childList) {
        const childCount = React.Children.count(childList);
        let children = [];
        React.Children.forEach(childList, (child, i) => {
            if (child) {
                let newChild;
                const key = child.key || `key-${i}`;
                let props = { key };
                if (typeof child.props.children !== "string") {
                    if (_.has(child.props, "field")) {
                        const fieldName = child.props.field;
                        props = { ...props, ...this.getFieldProps(formState, fieldName) };
                    }
                    if (React.Children.count(child.props.children) > 0) {
                        props = {
                            ...props,
                            children: this.renderChildren(formState, child.props.children)
                        };
                    }
                }
                newChild = React.cloneElement(child, props);
                if (childCount > 1) {
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
    shouldComponentUpdate(nextProps, nextState) {
        const update = nextProps.value !== this.props.value ||
            nextProps.edit !== this.props.edit ||
            nextProps.schema !== this.props.schema ||
            nextProps.visibility !== this.props.visibility ||
            nextState.selection !== this.state.selection;
        return update;
    }

    /**
     * Render the form and all its children.
     */
    render() {
        const inner = this.props.inner;
        const schema = this.props.schema;
        const formFields = getFieldsFromSchema(schema);
        const formRules = getRulesFromSchema(schema);
        const formHiddenList = this.getHiddenFields(formFields);
        const formState = { formFields, formRules, formHiddenList };

        /*
            <form class="form-inline">
            <div class="form-group">
                <label class="sr-only" for="exampleInputEmail3">Email address</label>
                <input type="email" class="form-control" id="exampleInputEmail3" placeholder="Email">
            </div>
            <div class="form-group">
                <label class="sr-only" for="exampleInputPassword3">Password</label>
                <input type="password" class="form-control" id="exampleInputPassword3" placeholder="Password">
            </div>
            <div class="checkbox">
                <label>
                <input type="checkbox"> Remember me
                </label>
            </div>
            <button type="submit" class="btn btn-default">Sign in</button>
            </form>
        */

        let formClass = this.props.formClassName;
        if (this.props.inline) {
            formClass += "form-inline";
        }

        if (this.props.edit === FormEditStates.TABLE) {
            return (
                <Flexbox
                    flexDirection="row"
                    className={this.props.formClassName}
                    key={this.props.formKey}
                >
                    {this.renderChildren(formState, this.props.children)}
                </Flexbox>
            );
        } else {
            if (inner) {
                return (
                    <form
                        className={formClass}
                        style={this.props.formStyle}
                        key={this.props.formKey}
                        onSubmit={e => {
                            this.handleSubmit(e);
                        }}
                        noValidate
                    >
                        {this.renderChildren(formState, this.props.children)}
                    </form>
                );
            } else {
                return (
                    <div
                        className={this.props.formClassName}
                        style={this.props.formStyle}
                        key={this.props.formKey}
                    >
                        {this.renderChildren(formState, this.props.children)}
                    </div>
                );
            }
        }
    }
}

Form.propTypes = {
    value: PropTypes.object
};

Form.defaultProps = {
    formStyle: {},
    formClass: "form-horizontal",
    formKey: "form",
    groupLayout: FormGroupLayout.ROW
};
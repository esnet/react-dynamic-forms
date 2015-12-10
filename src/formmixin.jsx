/**
 *  Copyright (c) 2015, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import _ from "underscore";
import React from "react";
import Copy from "deepcopy";
import Schema from "./schema";
import Attr from "./attr";
import Form from "./form";

// Pass in the <Schema> element and will return all the <Attrs> under it.
function getAttrsFromSchema(schema) {
    if (!React.isValidElement(schema)) {
        return {};
    }

    let attrs = {};
    if (schema.type === Schema) {
        React.Children.forEach(schema.props.children, (child) => {
            if (child.type === Attr) {
                attrs[child.props.name] = Copy(child.props);
            }
        });
    }
    return attrs;
}

function getRulesFromSchema(schema) {
    if (!React.isValidElement(schema)) {
        return {};
    }

    let rules = {};
    if (schema.type === Schema) {
        React.Children.forEach(schema.props.children, child => {
            if (child.type === Attr) {
                const required = child.props.required || false;
                const validation = Copy(child.props.validation);
                rules[child.props.name] = {required, validation};
            }
        });
    }
    return rules;
}

/**
 * Designed to be mixed into your top level forms.
 *
 *   The user of this form should pass as a prop the schema and values (if editing):
 *
 *   schema     - The attributes to be tracked by this form, specifying
 *                meta data associated with each of those attributes
 *
 * To set initial values for the form, use the setValues() method.
 * Internally the state formValues will contain the Initial and current value
 * as the form is edited by the user.
 *
 * Note: You can not currently pass values in as a prop.
 *
 * When building the initial state, the schema will be
 * converted to an internal state representation containing:
 *
 *   formAttrs  - General meta data about each attribute
 *   formRules  - Required state and validation rules
 *
 * The getAttr() call:
 *
 *   The getAttr() call is supplied with an attrName and collects
 *   together meta data, rules and values associated with that attr
 *   from formAttrs, formRules and formValues. It also attaches callbacks
 *   for missing count, error count, and attr value changes. The
 *   resulting structure can be passed to any of the Group wrapper components
 *   directly so that the display of the control has all the correct
 *   meta data and so that changes to the value and resulting errors
 *   etc, are bubbled up to the formMixin for counting.
 *
 * Missing and Error counts:
 *
 *   The state variables errorCounts and missingCounts hold the current counts
 *   of missing values or errors within the form, keyed by their attrName.
 *   These are maintained via the callbacks added to the form widgets with
 *   the use of the getAttr() helper function. Total errorCounts on the form
 *   can be found with the errorCount() function. Similarly, total missing
 *   counts can be found with the missingCount() function.
 *
 * Showing required values:
 *
 *   The current version of ESDB forms will only show an error outline around
 *   unfilled required fields when the user tries and fails to submit the form.
 *   Until then it shows the number of unfilled form items as a more gentle
 *   approach. We may revisit this in the future. To support this, the form
 *   uses the showRequired state value to specify if each widget in the form
 *   should actually show the error state if the field is required but not
 *   filled. You can use the two fuctions on the mixin: showRequiredOn() and
 *   showRequiredOff() to control this state, while showRequired() will return
 *   that state.
 *
 * Dynamic forms:
 *
 *   Sometimes a form will show and hide controls based on the value of another
 *   control. The way to control many fields coming and going from the form is to
 *   tag them (in the schema) and then use setVisible(tag) to update the mixin
 *   internal state to just take those into consideration.
 */
export default { /* FormMixin */

    propTypes: {
        schema: React.PropTypes.object.isRequired
    },

    getInitialState() {
        // Schema must be passed in as a prop
        const schema = this.props.schema;
        const attrs = getAttrsFromSchema(schema);
        const rules = getRulesFromSchema(schema);

        // Values might be passed in as a prop
        const initialValues = Copy(this.props.values);

        // Setup formValues
        let values = {};
        _.each(attrs, (attr, attrName) => {
            const defaultValue = _.has(attr, "defaultValue") ? attr["defaultValue"] : undefined;
            if (initialValues) {
                const v = _.has(initialValues, attrName) ?
                    initialValues[attrName] : defaultValue;
                values[attrName] = {value: v, initialValue: Copy(v)};
            } else {
                values[attrName] = {value: defaultValue, initialValue: Copy(defaultValue)};
            }
        });

        // Hidden initially
        let hidden = [];
        if (this.getInitialVisibility) {
            const tag = this.getInitialVisibility();
            if (tag) {
                _.each(attrs, (attr, attrName) => {
                    let makeHidden;
                    const tags = attr.tags || [];
                    if (_.isArray(tag)) {
                        makeHidden = !(_.intersection(tags, tag).length > 0 || _.contains(tags, "all"));
                    } else {
                        makeHidden = !(_.contains(tags, tag) || _.contains(tags, "all"));
                    }
                    if (makeHidden) {
                        hidden.push(attrName);
                    }
                });
            }
        }

        return {
            errorCounts: {},
            missingCounts: {},
            formAttrs: attrs,
            formRules: rules,
            formValues: values,
            formHiddenList: hidden
        };
    },

    /**
     * Collect together a data structure for the given attrName which can
     * be passed to any of the Group wrapped form widgets. This data contains
     * info from:
     *   - formAttrs
     *   - formRules
     *   - formValues
     *
     * In addition, the data structure contains callbacks for:
     *   - valueChanged
     *   - missingCountChanged
     *   - errorCountChanged
     */
    getAttr(attrName) {
        let data = {};

        const formAttrs = Copy(this.state.formAttrs);
        const formRules = Copy(this.state.formRules);
        const formValues = Copy(this.state.formValues);
        const formHiddenList = Copy(this.state.formHiddenList);
        const initialValue = formValues[attrName].initialValue ?
                             formValues[attrName].initialValue :
                             formValues[attrName].value;
        data.attr = attrName;

        if (_.has(formAttrs, attrName)) {

            data.key = attrName;
            data.name = formAttrs[attrName].label;
            data.placeholder = formAttrs[attrName].placeholder;
            data.help = formAttrs[attrName].help;
            data.hidden = false;
            data.disabled = false;

            if (formAttrs[attrName].disabled) {
                data.disabled = true;
            }

            if (_.contains(formHiddenList, attrName)) {
                data.disabled = true;
                data.hidden = true;
            }

        } else {
            throw new Error(`Attr '${attrName}' is not a part of the form schema`);
        }

        if (_.has(formRules, attrName)) {
            data.required = formRules[attrName].required;
            data.validation = formRules[attrName].validation;
        }

        if (_.has(formValues, attrName)) {
            data.initialValue = initialValue;
            data.value = formValues[attrName].value;
        }

        // Top level forms have showRequired as state and then pass it
        // down as props to sub-froms, hence this logic...
        if (_.has(this.props, "showRequired")) {
            data.showRequired = this.props.showRequired;
        } else if (_.has(this.state, "showRequired")) {
            data.showRequired = this.state.showRequired;
        } else {
            data.showRequired = false;
        }

        // Callbacks
        data.errorCountCallback = this.handleErrorCountChange;
        data.missingCountCallback = this.handleMissingCountChange;
        data.changeCallback = this.handleChange;

        return data;
    },

    initialValue(attrName) {
        const formValues = this.state.formValues;
        if (!_.has(formValues, attrName)) {
            throw new Error(`Requested initialValue for attr '${attrName}' could not be found`);
        }
        return Copy(formValues[attrName].initialValue);
    },

    value(attrName) {
        const formValues = this.state.formValues;
        if (!_.has(formValues, attrName)) {
            throw new Error(`Requested value for attr '${attrName}' could not be found`);
        }
        return Copy(formValues[attrName].value);
    },

    /**
     * Update state pushes pending values of state to our this.state. The important
     * thing here is that the action is deferred, meaning it will be called only
     * after the callstack is unwound. The deferred action also blocks other deferred
     * actions until it is run.
     *
     * When the deferred action takes place, the following happens:
     *
     *     1 A user action occurs
     *     2 updateState is called one or many times
     *     3 stack unwinds...
     *     --
     *     4 A state structure is constructed out of the pending structures
     *     5 setState is actually called, which will likely cause React to render()
     *         5a rendering may mount new form elements, which may themselves result in calls to updateState()
     *           (mounted components will report their missing/error states via supplied callbacks)
     *         5b those changes will also be added to the pending structures, but will
     *            not be flushed until the outer updateState deferred action is complete
     *     6 callbacks registered with us are called with updated values, missing counts and error counts
     *       (note these callbacks might include pending changes from 2b)
     *     7 stack unwinds...
     *     --
     *     8 stack unwinds again and the deferred action will be called again if another was created
     *       as a side effect of step (5) above
     *
     * updateState() takes a why parameter, which is helpful for debugging.
     */
    updateState(/* why */) {

        // const reason = why || "no reason"
        // console.log("updateState:", this.props.attr, reason)

        if (!this._deferSet) {
            _.defer(() => {
                this._deferSet = false;

                let state = {};
                if (this._pendingFormValues) {
                    state.formValues = this._pendingFormValues;
                }
                if (this._pendingMissing) {
                    state.missingCounts = this._pendingMissing;
                }
                if (this._pendingErrors) {
                    state.errorCounts = this._pendingErrors;
                }
                if (this._pendingHiddenList) {
                    state.formHiddenList = this._pendingHiddenList;
                }
                this.setState(state);

                if (this._pendingMissing) {
                    let missingCount = 0;
                    _.each(this._pendingMissing, c => {
                        missingCount += c;
                    });
                    if (this.props.onMissingCountChange) {
                        if (_.isUndefined(this.props.index)) {
                            this.props.onMissingCountChange(this.props.attr, missingCount);
                        } else {
                            this.props.onMissingCountChange(this.props.index, missingCount);
                        }
                    }
                    this._pendingMissing = null;
                }

                if (this._pendingErrors) {
                    let errorCount = 0;
                    _.each(this._pendingErrors, c => {
                        errorCount += c;
                    });
                    if (this.props.onErrorCountChange) {
                        if (_.isUndefined(this.props.index)) {
                            this.props.onErrorCountChange(this.props.attr, errorCount);
                        } else {
                            this.props.onErrorCountChange(this.props.index, errorCount);
                        }
                    }
                }

                // Handle registered callback.
                if (this._pendingFormValues) {
                    if (this.props.onChange) {
                        let current = {};
                        _.each(this._pendingFormValues, (value, key) => {
                            current[key] = value.value;
                        });

                        if (_.isUndefined(this.props.index)) {
                            this.props.onChange(this.props.attr, current);
                        } else {
                            this.props.onChange(this.props.index, current);
                        }
                    }
                    this._pendingFormValues = null;
                }

                if (this._pendingHiddenList) {
                    this._pendingHiddenList = null;
                }

            });
            this._deferSet = true;
        }
    },

    /**
     * Set a new value on the form. The resulting change is added to
     * _pendingFormValues. When the form state is flushed that value will be set
     * on this.state.formValues and registered callback called.
     */
    setValue(key, value) {
        let v = value;

        // Hook to allow the component to alter the value before it is set
        // or perform other actions in response to a particular attr changing.
        if (this.willHandleChange) {
            v = this.willHandleChange(key, value) || v;
        }

        this._pendingFormValues = this._pendingFormValues ||
                                  Copy(this.state.formValues);
        if (!_.has(this._pendingFormValues, key)) {
            throw new Error(`Tried to set value on form, but key '${key}' doesn't exist`);
        }

        this._pendingFormValues[key].initialValue = v;
        this._pendingFormValues[key].value = v;

        this.updateState("setValue");
    },

    /**
     * Batch set multiple values on the form. The resulting changes to the form
     * values are accumulated in _pendingFormValues. When the form state is flushed
     * those will be set in bulk onto this.state.formValues  and registered
     * callback called.
     */
    setValues(newValues) {
        _.each(newValues, (value, key) => {
            let v = value;

            // Hook to allow the component to alter the value before it is set
            // or perform other actions in response to a particular attr changing.
            if (this.willHandleChange) {
                v = this.willHandleChange(key, value) || v;
            }

            this._pendingFormValues = this._pendingFormValues ||
                                      Copy(this.state.formValues);

            if (!_.has(this._pendingFormValues, key)) {
                throw new Error(`Tried to set value on form, but key '${key}' doesn't exist`);
            }

            this._pendingFormValues[key].initialValue = v;
            this._pendingFormValues[key].value = v;

            this.updateState(`formValue ${key}`);
        });
    },

    /**
     * Returns the current value of the form's fields. The result is an
     * object relating the field name to the current value for that field
     */
    getValues() {
        let vals = {};
        _.each(this.state.formValues, (val, attrName) => {
            vals[attrName] = val.value;
        });
        return vals;
    },

    /**
     * Turn show required mode on for the form. In this mode, required
     * fields which are not filled out will display as an error (i.e. they
     * will be highlighted in red). This mode would be activated if the
     * user submitted a form with fields not filled out.
     */
    showRequiredOn() {
        this.setState({showRequired: true});
    },

    /**
     * Turns off the show required mode for the form. See showRequiredOn().
     */
    showRequiredOff() {
        this.setState({showRequired: false});
    },

    /**
     * Returns true of the form is in show required mode.
     */
    showRequired() {
        return this.state.showRequired;
    },

    /**
     * Returns the total number of errors in the form. This assumes this
     * will be called after the form state is flushed. It does not look at
     * pending state.
     */
    errorCount() {
        const errorCounts = this.state.errorCounts;
        let errorCount = 0;
        _.each(errorCounts, c => {
            errorCount += c;
        });
        return errorCount;
    },

    /**
     * Returns if the form has any errors, which is helpful
     * to quickly determine if a form can be submitted or not.
     */
    hasErrors() {
        return (this.errorCount() > 0);
    },

    /**
     * Returns the total count of form fields which are missing and
     * which are required by the form schema. This assumes this will be called
     * after the form state is flushed. It does not look at pending state.
     */
    missingCount() {
        const missingCounts = this.state.missingCounts;
        let missingCount = 0;
        _.each(missingCounts, c => {
            missingCount += c;
        });
        return missingCount;
    },

    /**
     * Returns if the form has any missing values, which is helpful
     * to quickly determine if a form can be submitted or not.
     */
    hasMissing() {
        return (this.missingCount() > 0);
    },

    /**
     * Set which form fields are visible or hidden using a tag or array of tags.
     *
     * Note that fields marked with 'all' will be always visible.
     *
     * This is a handy function when a selector like a type controls
     * which other attributes apply for that type.
     *
     * Errors and missing counts associated with attributes
     * being disabled will be cleared.
     *
     * _pendingHiddenList will hold the updated list of which fields are hidden
     * and which will not. Similarly _pendingMissing and _pendingErrors will hold
     * updates to the error and missing counts as a result of this setVisibility.
     *
     * When the state is flushed these pending structures will be set on the form
     * state and notification callbacks called.
     */
    setVisibility(tag) {
        const formAttrs = this.state.formAttrs;
        const formRules = this.state.formRules;

        this._pendingHiddenList = this._pendingHiddenList ||
                                  Copy(this.state.formHiddenList);

        _.each(formAttrs, (data, attrName) => {
            let shouldBeHidden;
            const tags = data.tags || [];
            const isCurrentlyHidden = _.contains(this._pendingHiddenList, attrName);

            //
            // It's possible the error and missing count setting within this loop will cause
            // a re-render (depending on the react version!) so we start new pending counts here
            //

            this._pendingMissing = this._pendingMissing ||
                                   Copy(this.state.missingCounts);
            this._pendingErrors = this._pendingErrors ||
                                  Copy(this.state.errorCounts);

            // Determine and set new hidden state on formAttr entry
            if (_.isArray(tag)) {
                shouldBeHidden = !(_.intersection(tags, tag).length > 0 ||
                                   _.contains(tags, "all"));
            } else {
                shouldBeHidden = !(_.contains(tags, tag) ||
                                   _.contains(tags, "all"));
            }

            // Clear the missing and error counts for attrs that we are hiding.
            if (!isCurrentlyHidden && shouldBeHidden) {

                // Add to hidden list
                this._pendingHiddenList.push(attrName);

                // Remove missing and error counts for hidden attrs
                delete this._pendingMissing[attrName];
                delete this._pendingErrors[attrName];

                // Evoke callbacks after we're done altering the error and required counts
                this.handleMissingCountChange(attrName, 0);
            }

            // Add missing counts for attrs that we are enabling
            if (isCurrentlyHidden && !shouldBeHidden) {
                this._pendingHiddenList = _.without(this._pendingHiddenList, attrName);

                // Set missing count for this attr if it's required and we just cleared it
                if (formRules[attrName].required) {
                    this._pendingMissing[attrName] = 1;
                    this.handleMissingCountChange(attrName, 1);
                } else {
                    this._pendingMissing[attrName] = 0;
                    this.handleMissingCountChange(attrName, 0);
                }
            }

        });

        this.updateState(`formValue ${tag}`);
    },

    /**
     * This is the handler for changes to the error state of this form's fields.
     *
     * If a field is complex, such as another form or a list view, then errorCount
     * will be the telly all the errors within that form or list. If it is a simple
     * field such as a textedit then the errorCount will be either 0 or 1.
     *
     * The mapping of field names (passed in as the key) and the count is updated
     * in _pendingErrors until built up state is flushed.
     */
    handleErrorCountChange(key, errorCount) {
        this._pendingErrors = this._pendingErrors ||
            Copy(this.state.errorCounts) || {};
        this._pendingErrors[key] = errorCount;
        this.updateState(`error change ${key} ${errorCount}`);
    },

    /**
     * This is the handler for changes to the missing state of this form's fields.
     *
     * If a field is complex, such as another form or a list view, then missingCount
     * will be the telly all the missing values (for required fields) within that
     * form or list.
     * If it is a simple field such as a textedit then the missingCount will be
     * either 0 or 1.
     *
     * The mapping of field names (passed in as the key) and the missing count is
     * updated in _pendingMissing until built up state is flushed.
     */
    handleMissingCountChange(key, missingCount) {
        this._pendingMissing = this._pendingMissing ||
            Copy(this.state.missingCounts) || {};
        this._pendingMissing[key] = missingCount;
        this.updateState(`missing change ${key} ${missingCount}`);
    },

    /**
     * This is the handler for value change notifications from this form's
     * widgets. As part of this handler we call willHandleChange if it is
     * implemented. This hook enables either the value to be modified or
     * for other actions to happen as a result of the change (such as hiding
     * some form elements).
     *
     * Changes to the formValues are stored in _pendingFormValues until built
     * up state is flushed.
     */
    handleChange(key, value) {
        // Hook to allow the component to alter the value before it is set
        // or perform other actions in response to a particular attr changing.
        // Note: Calling this opens potentially a lot of changes to the form
        // itself
        let v = value;
        if (this.willHandleChange) {
            v = this.willHandleChange(key, value) || v;
        }

        // We get the current pending form values or a copy of the actual formValues
        // if we don't have a pendingFormValues transaction in progress

        this._pendingFormValues = this._pendingFormValues ||
                                  Copy(this.state.formValues);

        // Check to see if the key is actually in the formValues
        if (!_.has(this._pendingFormValues, key)) {
            throw new Error(`Tried to set value on form, but key '${key}' doesn't exist`);
        }

        // Now handle the actual update of the attr value into the pendingFormValues
        this._pendingFormValues[key].value = v;

        // Update the state with the current pendingFormValues
        this.updateState(`value change ${key}`);

    },

    getAttrsForChildren(childList) {
        const childCount = React.Children.count(childList);

        let children = [];
        React.Children.forEach(childList, (child, i) => {
            if (child) {
                const key = child.key || `key-${i}`;
                let newChild;
                let props = {key};
                if (typeof child.props.children !== "string") {
                    // Child has a prop attr={attrName} on it
                    if (_.has(child.props, "attr")) {
                        const attrName = child.props.attr;

                        // Take all the schema data for this child's
                        // attr and apply it as a prop on this child
                        props["attr"] = this.getAttr(attrName);
                    }
                    // Recurse down to children
                    if (React.Children.count(child.props.children) > 0) {
                        props["children"] = this.getAttrsForChildren(child.props.children);
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
    },

    render() {
        let top = this.renderForm();
        let children = [];
        let formStyle = {};
        let formClassName = "form-horizontal";

        if (_.has(top.props, "style")) {
            formStyle = top.props.style;
        }

        if (_.has(top.props, "className")) {
            formClassName = top.props.className + " form-horizontal";
        }

        const formKey = top.key || "form";

        if (top.type === Form) {
            children = this.getAttrsForChildren(top.props.children);
            return (
                <form className={formClassName}
                      style={formStyle}
                      key={formKey}
                      onSubmit={this.handleSubmit}
                      noValidate >
                    {children}
                </form>
            );
        } else {
            const props = {
                key: formKey,
                children: this.getAttrsForChildren(top.props.children)
            };
            return React.cloneElement(top, props);
        }
    }
};

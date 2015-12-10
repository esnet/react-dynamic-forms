/**
 *  Copyright (c) 2015, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _deepcopy = require("deepcopy");

var _deepcopy2 = _interopRequireDefault(_deepcopy);

var _schema = require("./schema");

var _schema2 = _interopRequireDefault(_schema);

var _attr = require("./attr");

var _attr2 = _interopRequireDefault(_attr);

var _form = require("./form");

var _form2 = _interopRequireDefault(_form);

// Pass in the <Schema> element and will return all the <Attrs> under it.
function getAttrsFromSchema(schema) {
    if (!_react2["default"].isValidElement(schema)) {
        return {};
    }

    var attrs = {};
    if (schema.type === _schema2["default"]) {
        _react2["default"].Children.forEach(schema.props.children, function (child) {
            if (child.type === _attr2["default"]) {
                attrs[child.props.name] = (0, _deepcopy2["default"])(child.props);
            }
        });
    }
    return attrs;
}

function getRulesFromSchema(schema) {
    if (!_react2["default"].isValidElement(schema)) {
        return {};
    }

    var rules = {};
    if (schema.type === _schema2["default"]) {
        _react2["default"].Children.forEach(schema.props.children, function (child) {
            if (child.type === _attr2["default"]) {
                var required = child.props.required || false;
                var validation = (0, _deepcopy2["default"])(child.props.validation);
                rules[child.props.name] = { required: required, validation: validation };
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
exports["default"] = { /* FormMixin */

    propTypes: {
        schema: _react2["default"].PropTypes.object.isRequired
    },

    getInitialState: function getInitialState() {
        var _this = this;

        // Schema must be passed in as a prop
        var schema = this.props.schema;
        var attrs = getAttrsFromSchema(schema);
        var rules = getRulesFromSchema(schema);

        // Values might be passed in as a prop
        var initialValues = (0, _deepcopy2["default"])(this.props.values);

        // Setup formValues
        var values = {};
        _underscore2["default"].each(attrs, function (attr, attrName) {
            var defaultValue = _underscore2["default"].has(attr, "defaultValue") ? attr["defaultValue"] : undefined;
            if (initialValues) {
                var v = _underscore2["default"].has(initialValues, attrName) ? initialValues[attrName] : defaultValue;
                values[attrName] = { value: v, initialValue: (0, _deepcopy2["default"])(v) };
            } else {
                values[attrName] = { value: defaultValue, initialValue: (0, _deepcopy2["default"])(defaultValue) };
            }
        });

        // Hidden initially
        var hidden = [];
        if (this.getInitialVisibility) {
            (function () {
                var tag = _this.getInitialVisibility();
                if (tag) {
                    _underscore2["default"].each(attrs, function (attr, attrName) {
                        var makeHidden = undefined;
                        var tags = attr.tags || [];
                        if (_underscore2["default"].isArray(tag)) {
                            makeHidden = !(_underscore2["default"].intersection(tags, tag).length > 0 || _underscore2["default"].contains(tags, "all"));
                        } else {
                            makeHidden = !(_underscore2["default"].contains(tags, tag) || _underscore2["default"].contains(tags, "all"));
                        }
                        if (makeHidden) {
                            hidden.push(attrName);
                        }
                    });
                }
            })();
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
    getAttr: function getAttr(attrName) {
        var data = {};

        var formAttrs = (0, _deepcopy2["default"])(this.state.formAttrs);
        var formRules = (0, _deepcopy2["default"])(this.state.formRules);
        var formValues = (0, _deepcopy2["default"])(this.state.formValues);
        var formHiddenList = (0, _deepcopy2["default"])(this.state.formHiddenList);
        var initialValue = formValues[attrName].initialValue ? formValues[attrName].initialValue : formValues[attrName].value;
        data.attr = attrName;

        if (_underscore2["default"].has(formAttrs, attrName)) {

            data.key = attrName;
            data.name = formAttrs[attrName].label;
            data.placeholder = formAttrs[attrName].placeholder;
            data.help = formAttrs[attrName].help;
            data.hidden = false;
            data.disabled = false;

            if (formAttrs[attrName].disabled) {
                data.disabled = true;
            }

            if (_underscore2["default"].contains(formHiddenList, attrName)) {
                data.disabled = true;
                data.hidden = true;
            }
        } else {
            throw new Error("Attr '" + attrName + "' is not a part of the form schema");
        }

        if (_underscore2["default"].has(formRules, attrName)) {
            data.required = formRules[attrName].required;
            data.validation = formRules[attrName].validation;
        }

        if (_underscore2["default"].has(formValues, attrName)) {
            data.initialValue = initialValue;
            data.value = formValues[attrName].value;
        }

        // Top level forms have showRequired as state and then pass it
        // down as props to sub-froms, hence this logic...
        if (_underscore2["default"].has(this.props, "showRequired")) {
            data.showRequired = this.props.showRequired;
        } else if (_underscore2["default"].has(this.state, "showRequired")) {
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

    initialValue: function initialValue(attrName) {
        var formValues = this.state.formValues;
        if (!_underscore2["default"].has(formValues, attrName)) {
            throw new Error("Requested initialValue for attr '" + attrName + "' could not be found");
        }
        return (0, _deepcopy2["default"])(formValues[attrName].initialValue);
    },

    value: function value(attrName) {
        var formValues = this.state.formValues;
        if (!_underscore2["default"].has(formValues, attrName)) {
            throw new Error("Requested value for attr '" + attrName + "' could not be found");
        }
        return (0, _deepcopy2["default"])(formValues[attrName].value);
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
    updateState: function updateState() /* why */{
        var _this2 = this;

        // const reason = why || "no reason"
        // console.log("updateState:", this.props.attr, reason)

        if (!this._deferSet) {
            _underscore2["default"].defer(function () {
                _this2._deferSet = false;

                var state = {};
                if (_this2._pendingFormValues) {
                    state.formValues = _this2._pendingFormValues;
                }
                if (_this2._pendingMissing) {
                    state.missingCounts = _this2._pendingMissing;
                }
                if (_this2._pendingErrors) {
                    state.errorCounts = _this2._pendingErrors;
                }
                if (_this2._pendingHiddenList) {
                    state.formHiddenList = _this2._pendingHiddenList;
                }
                _this2.setState(state);

                if (_this2._pendingMissing) {
                    var missingCount = 0;
                    _underscore2["default"].each(_this2._pendingMissing, function (c) {
                        missingCount += c;
                    });
                    if (_this2.props.onMissingCountChange) {
                        if (_underscore2["default"].isUndefined(_this2.props.index)) {
                            _this2.props.onMissingCountChange(_this2.props.attr, missingCount);
                        } else {
                            _this2.props.onMissingCountChange(_this2.props.index, missingCount);
                        }
                    }
                    _this2._pendingMissing = null;
                }

                if (_this2._pendingErrors) {
                    var errorCount = 0;
                    _underscore2["default"].each(_this2._pendingErrors, function (c) {
                        errorCount += c;
                    });
                    if (_this2.props.onErrorCountChange) {
                        if (_underscore2["default"].isUndefined(_this2.props.index)) {
                            _this2.props.onErrorCountChange(_this2.props.attr, errorCount);
                        } else {
                            _this2.props.onErrorCountChange(_this2.props.index, errorCount);
                        }
                    }
                }

                // Handle registered callback.
                if (_this2._pendingFormValues) {
                    if (_this2.props.onChange) {
                        (function () {
                            var current = {};
                            _underscore2["default"].each(_this2._pendingFormValues, function (value, key) {
                                current[key] = value.value;
                            });

                            if (_underscore2["default"].isUndefined(_this2.props.index)) {
                                _this2.props.onChange(_this2.props.attr, current);
                            } else {
                                _this2.props.onChange(_this2.props.index, current);
                            }
                        })();
                    }
                    _this2._pendingFormValues = null;
                }

                if (_this2._pendingHiddenList) {
                    _this2._pendingHiddenList = null;
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
    setValue: function setValue(key, value) {
        var v = value;

        // Hook to allow the component to alter the value before it is set
        // or perform other actions in response to a particular attr changing.
        if (this.willHandleChange) {
            v = this.willHandleChange(key, value) || v;
        }

        this._pendingFormValues = this._pendingFormValues || (0, _deepcopy2["default"])(this.state.formValues);
        if (!_underscore2["default"].has(this._pendingFormValues, key)) {
            throw new Error("Tried to set value on form, but key '" + key + "' doesn't exist");
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
    setValues: function setValues(newValues) {
        var _this3 = this;

        _underscore2["default"].each(newValues, function (value, key) {
            var v = value;

            // Hook to allow the component to alter the value before it is set
            // or perform other actions in response to a particular attr changing.
            if (_this3.willHandleChange) {
                v = _this3.willHandleChange(key, value) || v;
            }

            _this3._pendingFormValues = _this3._pendingFormValues || (0, _deepcopy2["default"])(_this3.state.formValues);

            if (!_underscore2["default"].has(_this3._pendingFormValues, key)) {
                throw new Error("Tried to set value on form, but key '" + key + "' doesn't exist");
            }

            _this3._pendingFormValues[key].initialValue = v;
            _this3._pendingFormValues[key].value = v;

            _this3.updateState("formValue " + key);
        });
    },

    /**
     * Returns the current value of the form's fields. The result is an
     * object relating the field name to the current value for that field
     */
    getValues: function getValues() {
        var vals = {};
        _underscore2["default"].each(this.state.formValues, function (val, attrName) {
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
    showRequiredOn: function showRequiredOn() {
        this.setState({ showRequired: true });
    },

    /**
     * Turns off the show required mode for the form. See showRequiredOn().
     */
    showRequiredOff: function showRequiredOff() {
        this.setState({ showRequired: false });
    },

    /**
     * Returns true of the form is in show required mode.
     */
    showRequired: function showRequired() {
        return this.state.showRequired;
    },

    /**
     * Returns the total number of errors in the form. This assumes this
     * will be called after the form state is flushed. It does not look at
     * pending state.
     */
    errorCount: function errorCount() {
        var errorCounts = this.state.errorCounts;
        var errorCount = 0;
        _underscore2["default"].each(errorCounts, function (c) {
            errorCount += c;
        });
        return errorCount;
    },

    /**
     * Returns if the form has any errors, which is helpful
     * to quickly determine if a form can be submitted or not.
     */
    hasErrors: function hasErrors() {
        return this.errorCount() > 0;
    },

    /**
     * Returns the total count of form fields which are missing and
     * which are required by the form schema. This assumes this will be called
     * after the form state is flushed. It does not look at pending state.
     */
    missingCount: function missingCount() {
        var missingCounts = this.state.missingCounts;
        var missingCount = 0;
        _underscore2["default"].each(missingCounts, function (c) {
            missingCount += c;
        });
        return missingCount;
    },

    /**
     * Returns if the form has any missing values, which is helpful
     * to quickly determine if a form can be submitted or not.
     */
    hasMissing: function hasMissing() {
        return this.missingCount() > 0;
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
    setVisibility: function setVisibility(tag) {
        var _this4 = this;

        var formAttrs = this.state.formAttrs;
        var formRules = this.state.formRules;

        this._pendingHiddenList = this._pendingHiddenList || (0, _deepcopy2["default"])(this.state.formHiddenList);

        _underscore2["default"].each(formAttrs, function (data, attrName) {
            var shouldBeHidden = undefined;
            var tags = data.tags || [];
            var isCurrentlyHidden = _underscore2["default"].contains(_this4._pendingHiddenList, attrName);

            //
            // It's possible the error and missing count setting within this loop will cause
            // a re-render (depending on the react version!) so we start new pending counts here
            //

            _this4._pendingMissing = _this4._pendingMissing || (0, _deepcopy2["default"])(_this4.state.missingCounts);
            _this4._pendingErrors = _this4._pendingErrors || (0, _deepcopy2["default"])(_this4.state.errorCounts);

            // Determine and set new hidden state on formAttr entry
            if (_underscore2["default"].isArray(tag)) {
                shouldBeHidden = !(_underscore2["default"].intersection(tags, tag).length > 0 || _underscore2["default"].contains(tags, "all"));
            } else {
                shouldBeHidden = !(_underscore2["default"].contains(tags, tag) || _underscore2["default"].contains(tags, "all"));
            }

            // Clear the missing and error counts for attrs that we are hiding.
            if (!isCurrentlyHidden && shouldBeHidden) {

                // Add to hidden list
                _this4._pendingHiddenList.push(attrName);

                // Remove missing and error counts for hidden attrs
                delete _this4._pendingMissing[attrName];
                delete _this4._pendingErrors[attrName];

                // Evoke callbacks after we're done altering the error and required counts
                _this4.handleMissingCountChange(attrName, 0);
            }

            // Add missing counts for attrs that we are enabling
            if (isCurrentlyHidden && !shouldBeHidden) {
                _this4._pendingHiddenList = _underscore2["default"].without(_this4._pendingHiddenList, attrName);

                // Set missing count for this attr if it's required and we just cleared it
                if (formRules[attrName].required) {
                    _this4._pendingMissing[attrName] = 1;
                    _this4.handleMissingCountChange(attrName, 1);
                } else {
                    _this4._pendingMissing[attrName] = 0;
                    _this4.handleMissingCountChange(attrName, 0);
                }
            }
        });

        this.updateState("formValue " + tag);
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
    handleErrorCountChange: function handleErrorCountChange(key, errorCount) {
        this._pendingErrors = this._pendingErrors || (0, _deepcopy2["default"])(this.state.errorCounts) || {};
        this._pendingErrors[key] = errorCount;
        this.updateState("error change " + key + " " + errorCount);
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
    handleMissingCountChange: function handleMissingCountChange(key, missingCount) {
        this._pendingMissing = this._pendingMissing || (0, _deepcopy2["default"])(this.state.missingCounts) || {};
        this._pendingMissing[key] = missingCount;
        this.updateState("missing change " + key + " " + missingCount);
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
    handleChange: function handleChange(key, value) {
        // Hook to allow the component to alter the value before it is set
        // or perform other actions in response to a particular attr changing.
        // Note: Calling this opens potentially a lot of changes to the form
        // itself
        var v = value;
        if (this.willHandleChange) {
            v = this.willHandleChange(key, value) || v;
        }

        // We get the current pending form values or a copy of the actual formValues
        // if we don't have a pendingFormValues transaction in progress

        this._pendingFormValues = this._pendingFormValues || (0, _deepcopy2["default"])(this.state.formValues);

        // Check to see if the key is actually in the formValues
        if (!_underscore2["default"].has(this._pendingFormValues, key)) {
            throw new Error("Tried to set value on form, but key '" + key + "' doesn't exist");
        }

        // Now handle the actual update of the attr value into the pendingFormValues
        this._pendingFormValues[key].value = v;

        // Update the state with the current pendingFormValues
        this.updateState("value change " + key);
    },

    getAttrsForChildren: function getAttrsForChildren(childList) {
        var _this5 = this;

        var childCount = _react2["default"].Children.count(childList);

        var children = [];
        _react2["default"].Children.forEach(childList, function (child, i) {
            if (child) {
                var key = child.key || "key-" + i;
                var newChild = undefined;
                var props = { key: key };
                if (typeof child.props.children !== "string") {
                    // Child has a prop attr={attrName} on it
                    if (_underscore2["default"].has(child.props, "attr")) {
                        var attrName = child.props.attr;

                        // Take all the schema data for this child's
                        // attr and apply it as a prop on this child
                        props["attr"] = _this5.getAttr(attrName);
                    }
                    // Recurse down to children
                    if (_react2["default"].Children.count(child.props.children) > 0) {
                        props["children"] = _this5.getAttrsForChildren(child.props.children);
                    }
                }

                newChild = _react2["default"].cloneElement(child, props);

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

    render: function render() {
        var top = this.renderForm();
        var children = [];
        var formStyle = {};
        var formClassName = "form-horizontal";

        if (_underscore2["default"].has(top.props, "style")) {
            formStyle = top.props.style;
        }

        if (_underscore2["default"].has(top.props, "className")) {
            formClassName = top.props.className + " form-horizontal";
        }

        var formKey = top.key || "form";

        if (top.type === _form2["default"]) {
            children = this.getAttrsForChildren(top.props.children);
            return _react2["default"].createElement(
                "form",
                { className: formClassName,
                    style: formStyle,
                    key: formKey,
                    onSubmit: this.handleSubmit,
                    noValidate: true },
                children
            );
        } else {
            var props = {
                key: formKey,
                children: this.getAttrsForChildren(top.props.children)
            };
            return _react2["default"].cloneElement(top, props);
        }
    }
};
module.exports = exports["default"];
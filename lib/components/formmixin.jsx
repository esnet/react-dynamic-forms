/** @jsx React.DOM */

"use strict";

var _ = require("underscore");

/**
 * Designed to be mixed into your top level forms.
 *
 *   The user of this form should initialize a schema and values (if editing):
 *
 *   schema     - The attributes to be tracked by this form, specifying
 *                meta data associated with each of those attributes
 *   values     - Optionally specify an initial mapping from attribute name to
 *                value. You can update or later specify the values using
 *                the setValues() method.
 *
 * When the component is about to mount, the schema and value will be
 * converted to an internal representation containing:
 *
 *   formAttrs  - General meta data about each attribute
 *   formRules  - Required state and validation rules
 *   formValues - Initial and current value
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
 *   control. With react, hiding and showing things based on state is a simple
 *   matter of controlling the render() function. However, if you hide a control
 *   you do not want its state (error of missing value) to affect the form.
 *   In this case you can clear() an attribute. For a more robust way to control
 *   many fields coming and going from the form you can tag them (in formAttrs)
 *   and then use setEnabledAttributes(tag) to update the mixin internal state to
 *   just take those into consideration.
 */
var FormMixin = {

    getInitialState: function() {
        return {
            errorCounts: {},
            missingCounts: {},
        };
    },

    /**
     * Collect together a data structure for the given attrName which can
     * be passed to any of the Group wrapped form widgets. This data contains
     * info from:
     *
     *   - formAttrs
     *   - formRules
     *   - formValues
     *
     * In addition, the data structure contains callbacks for:
     *   - valueChanged
     *   - missingCountChanged
     *   - errorCountChanged
     */
    getAttr: function(attrName) {
        var data = {};
        var formAttrs = this.state.formAttrs;
        var formRules = this.state.formRules;
        var formValues = this.state.formValues;

        if (!formAttrs) {
            console.warn("Attrs have not been defined with a schema, so getAttr failed for attr: " + attrName);
            return;
        }

        data.key = attrName + "_" + formValues[attrName].initialValue;
        data.attr = attrName;

        if (_.has(formAttrs, attrName)) {
            data.name = formAttrs[attrName].label;
            data.placeholder = formAttrs[attrName].placeholder;
            data.help = formAttrs[attrName].help;
            data.disabled = formAttrs[attrName].disabled || false;
        } else {
            console.warn("Attr was not found in the schema: " + attrName);
            return;
        }

        if (_.has(formRules, attrName)) {
            data.required = formRules[attrName].required;
            data.validation = formRules[attrName].validation;
        }

        if (_.has(formValues, attrName)) {
            data.initialValue = formValues[attrName].initialValue;
            data.value = formValues[attrName].value;
        }

        //Top level forms have showRequired as state and then pass it
        //down as props to sub-froms, hence this logic...
        if (_.has(this.props, "showRequired")) {
            data.showRequired = this.props.showRequired;
        } else if (_.has(this.state, "showRequired")) {
            data.showRequired = this.state.showRequired;
        } else {
            data.showRequired = false;
        }

        //Callbacks
        data.errorCountCallback = this.handleErrorCountChange;
        data.missingCountCallback = this.handleMissingCountChange;
        data.changeCallback = this.handleChange;

        return data;
    },

    /**
     * Sets a new schema for this form. Example schema:
     *
     *  var schema = (
     *      <Schema>
     *          <Attr name="first_name" label="First name" placeholder="Enter first name" required={true} validation={{"type": "string"}}/>
     *          <Attr name="last_name" label="Last name" placeholder="Enter last name" required={true} validation={{"type": "string"}}/>
     *          <Attr name="email" label="Email" placeholder="Enter valid email address" validation={{"format": "email"}}/>
     *      </Schema>
     *  );
     */
    setSchema: function(schema) {
        if (schema) {
            var state = {
                formAttrs: schema.attrs(),
                formRules: schema.rules(),
                errorCounts: {},
                missingCounts: {},
            };

            this.setState(state);
        }
    },

    getValues: function() {
        var vals = {};
        _.each(this.state.formValues, function(val, attrName) {
            vals[attrName] = val.value;
        });
        return vals;
    },

    /**
     * Set new values on the form.
     *
     * NOTE: A schema for this form needs to have been defined before you can set values on
     *       those attributes. A schema may be set in initial state (before component is
     *       mounted) or using setSchema().
     */
    setValues: function(formValues) {
        var values = {};
        var formAttrs = this.state.formAttrs;

        if (!formAttrs) {
            console.error("Attrs not defined with a schema before call to setValues");
            return;
        }

        _.each(formAttrs, function(attr, attrName) {
            var defaultValue = _.has(attr, "defaultValue") ? attr["defaultValue"] : undefined;
            if (formValues) {
                var v = _.has(formValues, attrName) ? formValues[attrName] : defaultValue;
                values[attrName] = {"value": v, "initialValue": v};
            } else {
                values[attrName] = {"value": defaultValue, "initialValue": defaultValue};
            }
        });

        this.setState({"formValues": values});
    },

    showRequiredOn: function() {
        this.setState({"showRequired": true});
    },

    showRequiredOff: function() {
        this.setState({"showRequired": false});
    },

    showRequired: function() {
        return this.state.showRequired;
    },

    errorCount: function() {
        var errorCounts = this.state.errorCounts;
        var errorCount = 0;
        _.each(errorCounts, function(c) {
            errorCount += c;
        });
        return errorCount;
    },

    missingCount: function() {
        var missingCounts = this.state.missingCounts;
        var missingCount = 0;
        _.each(missingCounts, function(c) {
            missingCount += c;
        });
        return missingCount;
    },

    hasMissing: function() {
        return (this.missingCount() > 0);
    },

    /**
     * Clears a form field with specified key internally. Sets the value
     * to null (or value if supplied). Clears the errors and missing counts
     * for that field as well.
     */
    clear: function(key, value) {
        var val = value || null;
        var missing = this.state.missingCounts;
        var errors = this.state.errorCounts;
        var formValues = this.state.formValues;

        if (_.has(formValues, key)) {
            formValues[key].value = val;
        }
        if (missing[key]) {
            delete missing[key];
        }
        if (errors[key]) {
            delete errors[key];
        }
        
        this.setState({"missingCounts": missing,
                       "errorCounts": errors});
    },

    /**
     * Set which form fields are enabled/disabled using a tag.
     * Note that fields marked with 'all' will be always enabled.
     *
     * This is a handy function when a selector like a type controls
     * which other attributes apply for that type.
     *
     * Errors and missing counts associated with attributes
     * being disabled will be cleared.
     */
    setEnabledAttributes: function(tag) {
        var self = this;
        var formAttrs = this.state.formAttrs;

        _.each(formAttrs, function(data, attrName) {
            var disable;
            var tags = data.tags || [];
            var isCurrentlyDisabled = _.has(data, "disabled") ? data.disabled : false;

            //Determine and set new disabled state on formAttr entry
            disable = !(_.contains(tags, tag) || _.contains(tags, "all"));
            formAttrs[attrName].disabled = disable;

            //Clear the missing and error counts for attrs that we
            //are disabling.
            if (!isCurrentlyDisabled && disable) {
                self.clear(attrName);
            }
        });
        
        this.setState({"formAttrs": formAttrs});
    },

    handleErrorCountChange: function(key, errorCount) {

        var currentErrorCounts = this.state.errorCounts;
        currentErrorCounts[key] = errorCount;

        var count = 0;
        _.each(currentErrorCounts, function(c) {
            count += c;
        });

        this.setState({"errorCounts": currentErrorCounts});

        if (this.props.onErrorCountChange) {

            if (_.isUndefined(this.props.index)) {
                this.props.onErrorCountChange(this.props.attr, count);
            } else {
                this.props.onErrorCountChange(this.props.index, count);
            }
        }
    },

    handleMissingCountChange: function(key, missingCount) {
        var currentMissingCounts = this.state.missingCounts;
        currentMissingCounts[key] = missingCount;

        var count = 0;
        _.each(currentMissingCounts, function(c) {
            count += c;
        });

        //Turn off show required if the user fixed missing fields
        if (this.showRequired() && count === 0) {
            this.showRequiredOff();
        }

        this.setState({"missingCounts": currentMissingCounts});
        
        if (this.props.onMissingCountChange) {
            if (_.isUndefined(this.props.index)) {
                this.props.onMissingCountChange(this.props.attr, count);
            } else {
                this.props.onMissingCountChange(this.props.index, count);
            }
        }
    },

    handleChange: function(key, value) {
        var v = value;
        
        // Hook to allow the component to alter the value before it is set
        // or perform other actions in response to a particular attr changing.
        if (this.willHandleChange) {
            v = this.willHandleChange(key, value) || v;
        }

        // Set new form values on our state
        var formValues = this.state.formValues;

        if (!_.has(formValues, key)) {
            console.warn("Tried to set value on form, but key doesn't exist", key, formValues, value);
        }

        formValues[key].value = v;

        this.setState({"formValues": formValues});

        // Callback.
        //
        // If onChange is registered here then the value sent to that
        // callback is just the current value of each formValue field.
        //

        if (this.props.onChange) {
            var current = {};
            _.each(formValues, function(value, key) {
                current[key] = value.value;
            });
            if (_.isUndefined(this.props.index)) {
                this.props.onChange(this.props.attr, current);
            } else {
                this.props.onChange(this.props.index, current);
            }
        }
    },
};

module.exports = FormMixin;

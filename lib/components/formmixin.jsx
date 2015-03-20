/** @jsx React.DOM */

"use strict";

var _ = require("underscore");
var React = require("react");
var Schema = require("./schema");
var Attr = require("./attr");

var Form = require("./form");
var Copy = require("deepcopy");


//Pass in the <Schema> element and will return all the <Attrs> under it.
function getAttrsFromSchema(schema) {
    if (!React.isValidElement(schema)) {
        return {};
    }

    var attrs = {};
    if (schema.type === Schema.type) {
        React.Children.forEach(schema.props.children, function (child) {
            if (child.type === Attr.type) {
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

    var rules = {};
    if (schema.type === Schema.type) {
        React.Children.forEach(schema.props.children, function (child) {
            if (child.type === Attr.type) {
                var required = child.props.required || false;
                var validation = Copy(child.props.validation);
                rules[child.props.name] = {"required": required, "validation": validation};
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
var FormMixin = {

    propTypes: {
        schema: React.PropTypes.object.isRequired,
    },

    getInitialState: function() {
        //Schema must be passed in as a prop
        var schema = this.props.schema;
        var attrs = getAttrsFromSchema(schema);
        var rules = getRulesFromSchema(schema);

        var hidden = [];

        //Values might be passed in as a prop
        var initialValues = Copy(this.props.values);

        //Setup formValues
        var values = {};
        _.each(attrs, function(attr, attrName) {
            var defaultValue = _.has(attr, "defaultValue") ? attr["defaultValue"] : undefined;
            if (initialValues) {
                var v = _.has(initialValues, attrName) ? initialValues[attrName] : defaultValue;
                values[attrName] = {"value": v, "initialValue": v};
            } else {
                values[attrName] = {"value": defaultValue, "initialValue": defaultValue};
            }
        });

        var hidden = [];
        if (this.getInitialVisibility) {
            var tag = this.getInitialVisibility();
            if (tag) {
                _.each(attrs, function(attr, attrName) {
                    var makeHidden;
                    var tags = attr.tags || [];
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

    getAttr: function(attrName) {
        var data = {};
        var formAttrs = Copy(this.state.formAttrs);
        var formRules = Copy(this.state.formRules);
        var formValues = Copy(this.state.formValues);
        var formHiddenList = Copy(this.state.formHiddenList)
        data.attr = attrName;

        if (_.has(formAttrs, attrName)) {
            var initialValue = formValues[attrName].initialValue ?
                formValues[attrName].initialValue : formValues[attrName].value;
            
            data.key = attrName; //initialValue ? attrName + "_" + initialValue : attrName + "_init";

            data.name = formAttrs[attrName].label;
            data.placeholder = formAttrs[attrName].placeholder;
            data.help = formAttrs[attrName].help;

            //Consider the field to be disabled if it's either marked as disabled
            //or if it's on the hidden list

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
            console.warn("Attr '" + attrName + "' is not a part of the form schema");
            return;
        }

        if (_.has(formRules, attrName)) {
            data.required = formRules[attrName].required;
            data.validation = formRules[attrName].validation;
        }

        if (_.has(formValues, attrName)) {
            data.initialValue = initialValue;
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

    initialValue: function(attrName) {
        var formValues = this.state.formValues;
        if (!_.has(formValues, attrName)) {
            console.warn("Requested initialValue for attr that could not be found", attrName);
            return null;
        }
        return Copy(formValues[attrName].initialValue);
    },

    value: function(attrName) {
        var formValues = this.state.formValues;
        if (!_.has(formValues, attrName)) {
            console.warn("Requested initialValue for attr that could not be found", attrName);
            return null;
        }
        return Copy(formValues[attrName].value);
    },

    setValue: function(key, value) {
        var v = value;

        // Hook to allow the component to alter the value before it is set
        // or perform other actions in response to a particular attr changing.
        if (this.willHandleChange) {
            v = this.willHandleChange(key, value) || v;
        }

        this._pendingFormValues = this._pendingFormValues || Copy(this.state.formValues);
        if (!_.has(this._pendingFormValues, key)) {
            console.warn("Tried to set value on form, but key doesn't exist:", key);
        }
        this._pendingFormValues[key].initialValue = v;
        this._pendingFormValues[key].value = v;

        this.setState({"formValues": this._pendingFormValues});

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

    setValues: function(newValues) {
        var self = this;

        //
        // We get the current pending form values or a copy of the actual formValues
        // if we don't have a pendingFormValues transaction in progress
        //

        _.each(newValues, function(value, key) {
            var v = value;

            // Hook to allow the component to alter the value before it is set
            // or perform other actions in response to a particular attr changing.
            if (self.willHandleChange) {
                v = self.willHandleChange(key, value) || v;
            }

            self._pendingFormValues = self._pendingFormValues || Copy(self.state.formValues);

            if (!_.has(self._pendingFormValues, key)) {
                console.warn("Tried to set value on form, but key doesn't exist:", key, self._pendingFormValues);
            }

            self._pendingFormValues[key].initialValue = v;
            self._pendingFormValues[key].value = v;

            // Callback.
            //
            // If onChange is registered here then the value sent to that
            // callback is just the current value of each formValue field.
            //

            if (self.props.onChange) {
                var current = {};
                _.each(self._pendingFormValues, function(value, key) {
                    current[key] = value.value;
                });
                if (_.isUndefined(self.props.index)) {
                    self.props.onChange(self.props.attr, current);
                } else {
                    self.props.onChange(self.props.index, current);
                }
            }
            self.setState({"formValues": self._pendingFormValues});
        });
    },

    getValues: function() {
        var vals = {};
        _.each(this.state.formValues, function(val, attrName) {
            vals[attrName] = val.value;
        });
        return vals;
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

    hasErrors: function() {
        return (this.errorCount() > 0);
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
     * Set which form fields are visible or hidden using a tag or array of tags.
     *
     * Note that fields marked with 'all' will be always visible.
     *
     * This is a handy function when a selector like a type controls
     * which other attributes apply for that type.
     *
     * Errors and missing counts associated with attributes
     * being disabled will be cleared.
     */
    setVisibility: function(tag) {
        var self = this;

        var formAttrs = this.state.formAttrs;
        var formRules = this.state.formRules;

        var formHiddenList = Copy(this.state.formHiddenList); //Mutate this

        this._pendingMissing = this._pendingMissing || Copy(this.state.missingCounts);
        this._pendingErrors = this._pendingErrors || Copy(this.state.errorCounts);

        _.each(formAttrs, function(data, attrName) {
            var shouldBeHidden;
            var tags = data.tags || [];
            var isCurrentlyHidden = _.contains(formHiddenList, attrName);

            //Determine and set new hidden state on formAttr entry
            if (_.isArray(tag)) {
                shouldBeHidden = !(_.intersection(tags, tag).length > 0 || _.contains(tags, "all"));
            } else {
                shouldBeHidden = !(_.contains(tags, tag) || _.contains(tags, "all"));
            }
            
            //Clear the missing and error counts for attrs that we are hiding.
            if (!isCurrentlyHidden && shouldBeHidden) {

                //Add to hidden list
                formHiddenList.push(attrName);

                //Remove missing and error counts for hidden attrs
                delete self._pendingMissing[attrName];
                delete self._pendingErrors[attrName];

                //Evoke callbacks after we're done altering the error and required counts
                self.handleMissingCountChange(attrName, 0);
            }

            //Add missing counts for attrs that we are enabling
            if (isCurrentlyHidden && !shouldBeHidden) {
                formHiddenList = _.without(formHiddenList, attrName);

                //Set missing count for this attr if it's required and we just cleared it
                if (formRules[attrName].required) {
                    self._pendingMissing[attrName] = 1;
                    self.handleMissingCountChange(attrName, 1);
                } else {
                    self._pendingMissing[attrName] = 0;
                    self.handleMissingCountChange(attrName, 0);
                }
            }

        });
        
        this.setState({"formHiddenList": formHiddenList,
                       "missingCounts": this._pendingMissing,
                       "errorCounts": this._pendingErrors});
    },


    handleErrorCountChange: function(key, errorCount) {
        var currentErrorCounts = this.state.errorCounts; //Copy?
        currentErrorCounts[key] = errorCount;

        var count = 0;
        _.each(currentErrorCounts, function(c) {
            count += c;
        });

        this.setState({"errorCounts": currentErrorCounts});

        if (this.props.onErrorCountChange) {
            if (!_.isUndefined(this.props.index)) {
                this.props.onErrorCountChange(this.props.attr, count);
            } else {
                this.props.onErrorCountChange(this.props.index, count);
            }
        }
    },

    handleMissingCountChange: function(key, missingCount) {
        this._pendingMissing = this._pendingMissing || Copy(this.state.missingCounts);
        this._pendingMissing[key] = missingCount;

        var count = 0;
        _.each(this._pendingMissing, function(c) {
            count += c;
        });

        //Turn off show required if the user fixed missing fields
        if (this.showRequired() && count === 0) {
            this.showRequiredOff();
        }

        this.setState({"missingCounts": this._pendingMissing});

        if (this.props.onMissingCountChange) {
            if (_.isUndefined(this.props.index)) {
                this.props.onMissingCountChange(this.props.attr, count);
            } else {
                this.props.onMissingCountChange(this.props.index, count);
            }
        }
    },

    handleChange: function(key, value) {
        var self = this;
        var v = value;

        //
        // Hook to allow the component to alter the value before it is set
        // or perform other actions in response to a particular attr changing.
        //
        
        if (this.willHandleChange) {
            v = this.willHandleChange(key, value) || v;
        }

        //
        // We get the current pending form values or a copy of the actual formValues
        // if we don't have a pendingFormValues transaction in progress
        //
        this._pendingFormValues = this._pendingFormValues || Copy(this.state.formValues);

        //Check to see if the key is actually in the formValues
        if (!_.has(this._pendingFormValues, key)) {
            console.warn("handleChange: Tried to set value on form, but key doesn't exist:", key);
            return;
        }

        // Now handle the actual update of the attr value into the pendingFormValues
        this._pendingFormValues[key].value = v;

        // Update the state with the current pendingFormValues
        this.setState({"formValues": this._pendingFormValues});

        // Handle registered callback.
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

    getAttrsForChildren: function(childList) {
        var self = this;
        var childCount = React.Children.count(childList);
        var children = [];
        React.Children.forEach(childList, function(child, i) {
            var newChild
            var props;
            if (child) {
                var key = child.props.key || "key-" + i;
                if (typeof child.props === "string") {
                    children = child;
                } else {
                    if (_.has(child.props, "attr")) {
                        var attrName = child.props.attr;
                        props = {"attr": self.getAttr(attrName),
                                 "key": key,
                                 "children": self.getAttrsForChildren(child.props.children)};
                    } else {
                        props = {"key": key,
                                 "children": self.getAttrsForChildren(child.props.children)};
                    }
                    
                    newChild = React.addons.cloneWithProps(child, props);

                    if (childCount > 1) {
                        children.push(newChild);
                    } else {
                        children = newChild;
                    }
                }
            } else {
                children = null;
            }
        });
        return children;
    },

    render: function() {
        var top = this.renderForm();
        var children = [];
        var formStyle = {};
        var formClassName = "form-horizontal";

        // Now that we're rendering we can clear the pendingFormValues
        this._pendingFormValues = null;
        this._pendingMissing = null;
        this._pendingErrors = null;

        if (_.has(top.props, "style")) {
            formStyle = top.props.style;
        }
        
        if (_.has(top.props, "className")) {
            formClassName = top.props.className + " form-horizontal";
        }

        var formKey = top.key || "form";

        if (top.type === Form.type) {
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
            var props = {"key": formKey,
                         "children": this.getAttrsForChildren(top.props.children)};
            var newTop = React.addons.cloneWithProps(top, props);
            return newTop;
        }
    }
};

module.exports = FormMixin;

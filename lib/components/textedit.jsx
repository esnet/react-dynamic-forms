/** @jsx React.DOM */

"use strict";

var React = require("react");
var {validate} = require("revalidator");
var _ = require("underscore");

/**
 * Form control to edit a text field.
 * Set the initial value with 'initialValue' and set a callback for
 * value changed with 'onChange'.
 */
var TextEdit = React.createClass({

    displayName: "TextEdit",

    getDefaultProps: function() {
        return {width: "100%"};
    },

    getInitialState: function() {
        return {value: this.props.initialValue,
                error: null,
                errorMsg: "",
                missing: false};
    },

    _isEmpty: function(value) {
        return (_.isNull(value) ||
                _.isUndefined(value) ||
                value === "");
    },

    _isMissing: function() {
        return this.props.required && !this.props.disabled && this._isEmpty(this.state.value);
    },

    _getError: function(value) {
        var result = {"validationError": false, "validationErrorMessage": null};

        //If the user has a field blank then that is never an error. Likewise if the field
        //is disabled then that is never an error.
        if (this._isEmpty(value) || this.props.disabled) {
            return result;
        }

        //Validate the value with Revalidator, given the rules in this.props.rules
        var obj = {};
        obj[this.props.attr] = value;
        
        var attrValuePair = {};
        attrValuePair[this.props.attr] = this.props.rules;

        var schema = this.props.rules ? {"properties": attrValuePair} : null;

        if (obj && schema) {
            var validation = validate(obj, schema, {"cast": true});
            var name = this.props.name || "Value";
            var msg;
            if (!validation.valid) {
                msg = name + " " + validation.errors[0].message;

                result.validationError = true;
                result.validationErrorMessage = msg;
            }
        }
        return result;
    },

    componentDidMount: function() {
        var missing = this._isMissing();
        var error = this._getError(this.props.initialValue);

        this.setState({"value": this.props.initialValue,
                       "error": error.validationError,
                       "errorMsg": error.validationErrorMessage,
                       "missing": missing});
        
        if (this.props.onErrorCountChange) {
            this.props.onErrorCountChange(this.props.attr, error.validationError ? 1 : 0);
        }

        if (this.props.onMissingCountChange) {
            this.props.onMissingCountChange(this.props.attr, missing ? 1 : 0);
        }
    },

    onBlur: function(e) {
        var value = this.refs.input.getDOMNode().value;
        var cast = value;
        var missing = this.props.required && this._isEmpty(value);
        var error = this._getError(value);

        console.log("Blur", value);

        //State changes
        this.setState({"value": e.target.value,
                       "error": error.validationError,
                       "errorMsg": error.validationErrorMessage,
                       "missing": missing});

        //Callbacks
        if (this.props.onChange) {
            if (_.has(this.props.rules, "type")) {
                switch (this.props.rules.type) {
                    case "integer":
                        cast = value === "" ? null : parseInt(value, 10);
                        break;
                    case "number":
                        cast = value === "" ? null : parseFloat(value, 10);
                        break;
                };
            }
            this.props.onChange(this.props.attr, cast);
        }
        if (this.props.onErrorCountChange) {
            this.props.onErrorCountChange(this.props.attr, error.validationError ? 1 : 0);
        }
        if (this.props.onMissingCountChange) {
            this.props.onMissingCountChange(this.props.attr,  missing ? 1 : 0);
        }
    },
 
    onFocus: function(e) {
        //e.stopPropagation();
        this.setState({"error": false, "errorMsg": ""});
    },

    render: function() {
        var msg = "";
        var w = _.isUndefined(this.props.width) ? "100%" : this.props.width;
        var textEditStyle = {};//{"height": 27, "margin-top": 1, "width": w};
        var className = "";

        if (this.state.error || ( this.props.showRequired && this._isMissing())) {
            className = "has-error";
        }

        if (this.state.error) {
            msg = this.state.errorMsg;
        }

        var helpClassName = "help-block";
        if (this.state.error) {
            helpClassName += " has-error";
        }

        return (
            <div className={className} >
                <input  required
                    style={textEditStyle}
                    className="form-control input-sm"
                    type="text"
                    ref="input"
                    disabled={this.props.disabled}
                    placeholder={this.props.placeholder}
                    defaultValue={this.state.value}
                    onBlur={this.onBlur}
                    onFocus={this.onFocus}>
                </input>
                <div className={helpClassName}>{msg}</div>
            </div>
        );
    }
});

module.exports = TextEdit;
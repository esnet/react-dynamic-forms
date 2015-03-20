/** @jsx React.DOM */

"use strict";

var React = require("react");
var {validate} = require("revalidator");
var _ = require("underscore");

/**
 * Form control to edit a Text Area field
 */
var TextArea = React.createClass({

    displayName: "TextArea",

    getDefaultProps: function() {
        return {width: "100%",
                rows: 4};
    },

    getInitialState: function() {
        return {initialValue: this.props.initialValue,
                value: this.props.initialValue,
                error: null,
                errorMsg: "",
                missing: false};
    },

    _isEmpty: function(value) {
        return (_.isNull(value) ||
                _.isUndefined(value) ||
                value === "");
    },

    _isMissing: function(v) {
        return this.props.required && !this.props.disabled && this._isEmpty(v);
    },

    _getError: function(value) {
        var result = {"validationError": false, "validationErrorMessage": null};

        //If the user has a field blank then that is never an error
        //Likewise if this item is disabled it can't be called an error
        if (this._isEmpty(value) || this.props.disabled) {
            return result;
        }

        //Validate the value with Revalidator, given the rules in this.props.rules
        var obj = {}; obj[this.props.attr] = value;
        var attrValuePair = {}; attrValuePair[this.props.attr] = this.props.rules;
        var schema = this.props.rules ? {"properties": attrValuePair} : null;
        if (obj && schema) {
            var validation = validate(obj, schema, {"cast": true});
            if (!validation.valid) {
                var name = this.props.name || "Value";
                var msg = name + " " + validation.errors[0].message;
                result.validationError = true;
                result.validationErrorMessage = msg;
            }
        }
        return result;
    },

    componentWillReceiveProps: function(nextProps) {
        if (this.state.initialValue !== nextProps.initialValue) {
            this.setState({
                initialValue: nextProps.initialValue,
                value: nextProps.initialValue
            });

            var missing = this._isMissing(nextProps.initialValue);
            var error = this._getError(nextProps.initialValue);

            //Re-broadcast error and missing states up to the owner
            if (this.props.onErrorCountChange) {
                this.props.onErrorCountChange(this.props.attr, error.validationError ? 1 : 0);
            }

            if (this.props.onMissingCountChange) {
                this.props.onMissingCountChange(this.props.attr, missing ? 1 : 0);
            }
        }
    },

    componentDidMount: function() {
        var missing = this._isMissing(this.props.initialValue);
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
        var missing = this.props.required && this._isEmpty(value);
        var error = this._getError(value);

        //State changes
        this.setState({"value": e.target.value,
                       "error": error.validationError,
                       "errorMsg": error.validationErrorMessage,
                       "missing": missing});

        //Callbacks
        if (this.props.onChange) {
            this.props.onChange(this.props.attr, e.target.value);
        }
        if (this.props.onErrorCountChange) {
            this.props.onErrorCountChange(this.props.attr, error.validationError ? 1 : 0);
        }
        if (this.props.onMissingCountChange) {
            this.props.onMissingCountChange(this.props.attr,  missing ? 1 : 0);
        }
    },
 
    onFocus: function(e) {
        this.setState({"error": false, "errorMsg": ""});
    },

    render: function() {
        var msg = "";
        var w = _.isUndefined(this.props.width) ? "100%" : this.props.width;
        var textAreaStyle = {"width": w};
        var className = "";

        if (this.state.error || ( this.props.showRequired && this._isMissing(this.state.value))) {
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
                <textarea style={textAreaStyle}
                          className="form-control"
                          type="text"
                          ref="input"
                          key={this.state.initialValue}
                          disabled={this.props.disabled}
                          placeholder={this.props.placeholder}
                          defaultValue={this.state.value}
                          rows={this.props.rows}
                          onBlur={this.onBlur}
                          onFocus={this.onFocus}>
                </textarea>
                <div className={helpClassName}>{msg}</div>
            </div>
        );
    }
});

module.exports = TextArea;
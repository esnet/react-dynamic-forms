/**
 *  Copyright (c) 2015, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import React from "react";
import { validate } from "revalidator";
import _ from "underscore";

require("./textedit.css");

/**
 * Form control to edit a text field. This is a controlled component,
 * meaning the state should live above this component and be passed down
 * with the value prop.
 */
export default React.createClass({

    displayName: "TextEdit",

    getDefaultProps() {
        return {width: "100%"};
    },

    _isEmpty(value) {
        return (
            _.isNull(value) ||
            _.isUndefined(value) ||
            value === ""
        );
    },

    _isMissing(value) {
        return this.props.required &&
        !this.props.disabled &&
        this._isEmpty(value);
    },

    _getError(value) {
        const result = {
            validationError: false,
            validationErrorMessage: null
        };

        // If the user has a field blank then that is never an error. Likewise if the field
        // is disabled then that is never an error.
        if (this._isEmpty(value) || this.props.disabled) {
            return result;
        }

        // Validate the value with Revalidator, given the rules in this.props.rules
        let obj = {};
        obj[this.props.attr] = value;

        let attrValuePair = {};
        attrValuePair[this.props.attr] = this.props.rules;

        const rules = this.props.rules ? {properties: attrValuePair} : null;

        if (obj && rules) {
            const validation = validate(obj, rules, {cast: true});
            const name = this.props.name || "Value";

            let msg;
            if (!validation.valid) {
                msg = `${name} ${validation.errors[0].message}`;
                result.validationError = true;
                result.validationErrorMessage = msg;
            }
        }
        return result;
    },

    _castValue(value) {
        let result = value;
        if (_.has(this.props.rules, "type")) {
            switch (this.props.rules.type) {
                case "integer":
                    result = value === "" ? null : parseInt(value, 10);
                    break;
                case "number":
                    result = value === "" ? null : parseFloat(value, 10);
                    break;
            }
        }
        return result;
    },

    componentDidMount() {
        const missing = this._isMissing(this.props.value);
        const error = this._getError(this.props.value);

        // Initial error and missing states are fed up to the owner
        if (this.props.onErrorCountChange) {
            this.props.onErrorCountChange(this.props.attr, error.validationError ? 1 : 0);
        }

        if (this.props.onMissingCountChange) {
            this.props.onMissingCountChange(this.props.attr, missing ? 1 : 0);
        }
        
        if (this.props.autofocus) {
            React.findDOMNode(this.refs.input).focus();
            React.findDOMNode(this.refs.input).select();
        }
    },


    componentWillReceiveProps(nextProps) {
        if (this.props.value !== nextProps.value) {

            const missing = this._isMissing(nextProps.value);
            const error = this._getError(nextProps.value);

            console.log("nextProps", nextProps.attr, nextProps.value, missing);

            // Callbacks
            if (this.props.onErrorCountChange) {
                this.props.onErrorCountChange(this.props.attr, error.validationError ? 1 : 0);
            }

            if (this.props.onMissingCountChange) {
                this.props.onMissingCountChange(this.props.attr, missing ? 1 : 0);
            }
        }
    },

    onBlur() {
        const value = this.refs.input.value;
        const missing = this.props.required && this._isEmpty(value);
        const error = this._getError(value);

        // State changes
        const focus = false;
        this.setState({focus});

        // Callbacks
        if (this.props.onChange) {
            this.props.onChange(this.props.attr, this._castValue(value));
        }
        if (this.props.onErrorCountChange) {
            this.props.onErrorCountChange(this.props.attr, error.validationError ? 1 : 0);
        }
        if (this.props.onMissingCountChange) {
            this.props.onMissingCountChange(this.props.attr, missing ? 1 : 0);
        }
    },

    onFocus() {
        this.setState({focus: true});
    },

    handleKeyDown(e) {
        if (e.which === 13) { // return
            React.findDOMNode(this.refs.input).blur();
        }
        if (e.which === 27) { // esc
            if (this.props.onCancel) {
                this.props.onCancel();
            }
        }
    },

    render() {
        const error = this._getError(this.props.value);
        const value = this.props.value;

        const w = _.isUndefined(this.props.width) ? "100%" : this.props.width;
        const style = {width: w};

        let className = "";
        if (error.validationError ||
            ( this.props.showRequired && this._isMissing(value))) {
            className = "has-error";
        }

        let msg = "";
        if (error.validationError) {
            msg = error.validationErrorMessage;
        }

        let helpClassName = "help-block";
        if (error.validationError) {
            helpClassName += " has-error";
        }

        console.log("Rendering textedit", this.props.attr, this.props.value);

        return (
            <div className={className} >
                <input
                    required
                    style={style}
                    key={this.props.value}
                    className="form-control input-sm"
                    type="text"
                    ref="input"
                    disabled={this.props.disabled}
                    placeholder={this.props.placeholder}
                    defaultValue={this.props.value}
                    onBlur={this.onBlur}
                    onFocus={this.onFocus}
                    onKeyDown={this.handleKeyDown} />
                <div className={helpClassName}>{msg}</div>
            </div>
        );
    }
});

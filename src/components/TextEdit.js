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
import hash from "string-hash";

require("./textedit.css");

/**
 * Form control to edit a text field.
 * Set the initial value with 'initialValue' and set a callback for
 * value changed with 'onChange'.
 */
export default React.createClass({
  displayName: "TextEdit",
  getDefaultProps() {
    return { width: "100%" };
  },
  getInitialState() {
    return {
      initialValue: this.props.initialValue,
      value: this.props.initialValue,
      error: null,
      errorMsg: "",
      missing: false,
      type: "text"
    };
  },
  _isEmpty(value) {
    return _.isNull(value) || _.isUndefined(value) || value === "";
  },
  _isMissing(v) {
    return this.props.required && !this.props.disabled && this._isEmpty(v);
  },
  _getError(value) {
    const result = { validationError: false, validationErrorMessage: null };

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

    const rules = this.props.rules ? { properties: attrValuePair } : null;

    if (obj && rules) {
      const validation = validate(obj, rules, { cast: true });
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
  componentWillReceiveProps(nextProps) {
    if (this.state.initialValue !== nextProps.initialValue) {
      this.setState({
        initialValue: nextProps.initialValue,
        value: nextProps.initialValue
      });

      const missing = this._isMissing(nextProps.initialValue);
      const error = this._getError(nextProps.initialValue);

      // Re-broadcast error and missing states up to the owner
      if (this.props.onErrorCountChange) {
        this.props.onErrorCountChange(
          this.props.attr,
          error.validationError ? 1 : 0
        );
      }

      if (this.props.onMissingCountChange) {
        this.props.onMissingCountChange(this.props.attr, missing ? 1 : 0);
      }
    }
  },
  componentDidMount() {
    const missing = this._isMissing(this.props.initialValue);
    const error = this._getError(this.props.initialValue);
    const value = this.props.initialValue;

    this.setState({
      value,
      missing,
      error: error.validationError,
      errorMsg: error.validationErrorMessage
    });

    // Initial error and missing states are fed up to the owner
    if (this.props.onErrorCountChange) {
      this.props.onErrorCountChange(
        this.props.attr,
        error.validationError ? 1 : 0
      );
    }

    if (this.props.onMissingCountChange) {
      this.props.onMissingCountChange(this.props.attr, missing ? 1 : 0);
    }
  },
  onBlur() {
    const value = this.refs.input.value;
    const missing = this.props.required && this._isEmpty(value);
    const error = this._getError(value);

    let cast = value;

    // State changes
    this.setState({
      value,
      missing,
      error: error.validationError,
      errorMsg: error.validationErrorMessage
    });

    // Callbacks
    if (this.props.onChange) {
      if (_.has(this.props.rules, "type")) {
        switch (this.props.rules.type) {
          case "integer":
            cast = value === "" ? null : parseInt(value, 10);
            break;
          case "number":
            cast = value === "" ? null : parseFloat(value, 10);
            break;
          //pass
          default:
        }
      }
      this.props.onChange(this.props.attr, cast);
    }
    if (this.props.onErrorCountChange) {
      this.props.onErrorCountChange(
        this.props.attr,
        error.validationError ? 1 : 0
      );
    }
    if (this.props.onMissingCountChange) {
      this.props.onMissingCountChange(this.props.attr, missing ? 1 : 0);
    }
  },
  onFocus() {
    this.setState({ error: false, errorMsg: "" });
  },
  render() {
    let msg = "";
    const w = _.isUndefined(this.props.width) ? "100%" : this.props.width;
    const style = { width: w };

    let className = "";
    const requiredError = this.props.showRequired &&
      this._isMissing(this.state.value);
    if (this.state.error || requiredError) {
      className = "has-error";
    }

    if (this.state.error) {
      msg = this.state.errorMsg;
    }

    let helpClassName = "help-block";
    if (this.state.error) {
      helpClassName += " has-error";
    }

    const key = hash(this.state.initialValue || "");

    return (
      <div className={className}>
        <input
          required
          key={key}
          style={style}
          className="form-control input-sm"
          type={this.props.type}
          ref="input"
          disabled={this.props.disabled}
          placeholder={this.props.placeholder}
          defaultValue={this.state.value}
          onBlur={this.onBlur}
          onFocus={this.onFocus}
        />
        <div className={helpClassName}>{msg}</div>
      </div>
    );
  }
});


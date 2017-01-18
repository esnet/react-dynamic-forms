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

import "./textarea.css";

/**
 * Form control to edit a Text Area field
 */
export default React.createClass({
  displayName: "TextArea",
  getDefaultProps() {
    return { width: "100%", rows: 4 };
  },
  getInitialState() {
    return {
      initialValue: this.props.initialValue,
      value: this.props.initialValue,
      error: null,
      errorMsg: "",
      missing: false
    };
  },
  _isEmpty(value) {
    return _.isNull(value) || _.isUndefined(value) || value === "";
  },
  _isMissing(v) {
    return this.props.required && !this.props.disabled && this._isEmpty(v);
  },
  _getError(value) {
    let result = { validationError: false, validationErrorMessage: null };

    // If the user has a field blank then that is never an error
    // Likewise if this item is disabled it can't be called an error
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
      if (!validation.valid) {
        const name = this.props.name || "Value";
        const msg = `${name} ${validation.errors[0].message}`;
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

      // Callbacks
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

    this.setState({
      value: this.props.initialValue,
      error: error.validationError,
      errorMsg: error.validationErrorMessage,
      missing
    });

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
  onBlur(e) {
    const value = this.refs.input.value;
    const missing = this.props.required && this._isEmpty(value);
    const error = this._getError(value);

    // State changes
    this.setState({
      value: e.target.value,
      error: error.validationError,
      errorMsg: error.validationErrorMessage,
      missing
    });

    // Callbacks
    if (this.props.onChange) {
      this.props.onChange(this.props.attr, e.target.value);
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
    let className = "";

    const w = _.isUndefined(this.props.width) ? "100%" : this.props.width;
    const textAreaStyle = { width: w };

    if (
      this.state.error ||
        this.props.showRequired && this._isMissing(this.state.value)
    ) {
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
        <textarea
          style={textAreaStyle}
          className="form-control"
          type="text"
          ref="input"
          key={key}
          disabled={this.props.disabled}
          placeholder={this.props.placeholder}
          defaultValue={this.state.value}
          rows={this.props.rows}
          onBlur={this.onBlur}
          onFocus={this.onFocus}
        />
        <div className={helpClassName}>{msg}</div>
      </div>
    );
  }
})


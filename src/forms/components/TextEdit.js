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

import formGroup from "../formGroup";
import "./css/textedit.css";

/**
 * Form control to edit a text field.
 * Set the initial value with 'initialValue' and set a callback for
 * value changed with 'onChange'.
 */
class TextEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
      error: null,
      errorMsg: "",
      missing: false,
      type: "text"
    };
  }

  isEmpty(value) {
    return _.isNull(value) || _.isUndefined(value) || value === "";
  }

  isMissing(v) {
    return this.props.required && !this.props.disabled && this.isEmpty(v);
  }

  getError(value) {
    const result = { validationError: false, validationErrorMessage: null };

    // If the user has a field blank then that is never an error. Likewise if the field
    // is disabled then that is never an error.
    if (this.isEmpty(value) || this.props.disabled) {
      return result;
    }

    // Validate the value with Revalidator, given the rules in this.props.rules
    let obj = {};
    obj[this.props.name] = value;

    let properties = {};
    properties[this.props.name] = this.props.validation;

    const rules = this.props.validation ? { properties } : null;
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
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.value !== nextProps.value) {
      this.setState({ value: nextProps.value });
      const missing = this.isMissing(nextProps.value);
      const error = this.getError(nextProps.value);

      // Re-broadcast error and missing states up to the owner
      if (this.props.onErrorCountChange) {
        this.props.onErrorCountChange(
          this.props.name,
          error.validationError ? 1 : 0
        );
      }

      if (this.props.onMissingCountChange) {
        this.props.onMissingCountChange(this.props.name, missing ? 1 : 0);
      }
    }
  }

  componentDidMount() {
    const missing = this.isMissing(this.props.value);
    const error = this.getError(this.props.value);
    const value = this.props.value;

    this.setState({
      value,
      missing,
      error: error.validationError,
      errorMsg: error.validationErrorMessage
    });

    // Initial error and missing states are fed up to the owner
    if (this.props.onErrorCountChange) {
      this.props.onErrorCountChange(
        this.props.name,
        error.validationError ? 1 : 0
      );
    }

    if (this.props.onMissingCountChange) {
      this.props.onMissingCountChange(this.props.name, missing ? 1 : 0);
    }
  }

  onBlur() {
    const value = this.refs.input.value;
    const missing = this.props.required && this.isEmpty(value);
    const error = this.getError(value);

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
      this.props.onChange(this.props.name, cast);
    }
    if (this.props.onErrorCountChange) {
      this.props.onErrorCountChange(
        this.props.name,
        error.validationError ? 1 : 0
      );
    }
    if (this.props.onMissingCountChange) {
      this.props.onMissingCountChange(this.props.name, missing ? 1 : 0);
    }
  }

  onFocus() {
    this.setState({ error: false, errorMsg: "" });
  }

  inlineStyle(hasError, isMissing) {
    let color = "inherited";
    let background = "inherited";
    let borderLeftStyle = "inherited";
    let borderLeftColor = "inherited";
    let borderLeftWidth = 2;
    if (hasError) {
      color = "#b94a48";
      background = "#fff0f3";
      borderLeftStyle = "solid";
      borderLeftColor = "#b94a48";
    } else if (isMissing) {
      background = "floralwhite";
      borderLeftStyle = "solid";
      borderLeftColor = "orange";
    }
    return {
      color,
      background,
      borderLeftStyle,
      borderLeftColor,
      borderLeftWidth,
      height: 23,
      width: "100%",
      paddingLeft: 3
    };
  }

  render() {
    if (this.props.edit) {
      // Error text
      const msg = this.state.error ? this.state.errorMsg : "";
      let helpClassName = "help-block";
      if (this.state.error) {
        helpClassName += " has-error";
      }

      // Warning style
      const style = this.isMissing(this.state.value)
        ? { background: "floralwhite" }
        : {};

      const key = hash(this.props.value || "");

      return (
        <div>
          <input
            required
            key={key}
            ref="input"
            className="form-control input-sm"
            style={style}
            type={this.props.type}
            disabled={this.props.disabled}
            placeholder={this.props.placeholder}
            defaultValue={this.props.value}
            onBlur={() => this.onBlur()}
            onFocus={() => this.onFocus()}
          />
          <div className={helpClassName}>{msg}</div>
        </div>
      );
    } else {
      const isMissing = this.isMissing(this.state.value);
      const hasError = this.state.error;
      let text = this.props.value;
      if (isMissing) {
        text = " ";
      }
      const style = this.inlineStyle(hasError, isMissing);
      return <div style={style}>{text}</div>;
    }
  }
}

export default formGroup(TextEdit);

/**
 *  Copyright (c) 2015-2017, The Regents of the University of California,
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

import formGroup from "../formGroup";
import "./css/textedit.css";

/**
 * Form control to edit a text field.
 * Set the initial value with 'initialValue' and set a callback for
 * value changed with 'onChange'.
 */
class TextEdit extends React.Component {
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
    if (this.props.value !== nextProps.value) {
      const missing = this.isMissing(nextProps.value);
      const { validationError } = this.getError(nextProps.value);

      // Broadcast error and missing states up to the owner
      if (this.props.onErrorCountChange) {
        this.props.onErrorCountChange(this.props.name, validationError ? 1 : 0);
      }

      if (this.props.onMissingCountChange) {
        this.props.onMissingCountChange(this.props.name, missing ? 1 : 0);
      }
    }
  }

  componentDidMount() {
    const missing = this.isMissing(this.props.value);
    const { validationError } = this.getError(this.props.value);

    // Initial error and missing states are fed up to the owner
    if (this.props.onErrorCountChange) {
      this.props.onErrorCountChange(this.props.name, validationError ? 1 : 0);
    }

    if (this.props.onMissingCountChange) {
      this.props.onMissingCountChange(this.props.name, missing ? 1 : 0);
    }
  }

  onBlur() {
    const value = this.refs.input.value;
    const missing = this.props.required && this.isEmpty(value);
    const { validationError } = this.getError(value);
    let cast = value;

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
      this.props.onErrorCountChange(this.props.name, validationError ? 1 : 0);
    }
    if (this.props.onMissingCountChange) {
      this.props.onMissingCountChange(this.props.name, missing ? 1 : 0);
    }
  }

  inlineStyle(hasError, isMissing) {
    let color = "inherited";
    let background = "inherited";
    if (hasError) {
      color = "#b94a48";
      background = "#fff0f3";
    } else if (isMissing) {
      background = "floralwhite";
    }
    return {
      color,
      background,
      height: 23,
      width: "100%",
      paddingLeft: 3
    };
  }

  render() {
    // Control state
    const isMissing = this.isMissing(this.props.value);
    const { validationError, validationErrorMessage } = this.getError(
      this.props.value
    );

    if (this.props.edit) {
      // Error style/message
      let className = "";
      const msg = validationError ? validationErrorMessage : "";
      let helpClassName = "help-block";
      if (validationError) {
        helpClassName += " has-error";
        className = "has-error";
      }

      // Warning style
      const style = isMissing ? { background: "floralwhite" } : {};

      const type = this.props.type || "text";

      return (
        <div className={className}>
          <input
            key={this.props.value}
            ref="input"
            className="form-control input-sm"
            style={style}
            type={type}
            disabled={this.props.disabled}
            placeholder={this.props.placeholder}
            defaultValue={this.props.value}
            onBlur={() => this.onBlur()}
          />
          <div className={helpClassName}>{msg}</div>
        </div>
      );
    } else {
      const view = this.props.view;
      let text = this.props.value;
      if (isMissing) {
        text = " ";
      }
      const style = this.inlineStyle(validationError, isMissing);
      if (!view) {
        return <div style={style}>{text}</div>;
      } else {
        return view(text)
      }
    }
  }
}

export default formGroup(TextEdit);

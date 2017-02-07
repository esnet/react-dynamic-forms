/**
 *  Copyright (c) 2015, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import _ from "underscore";
import DatePicker from "react-datepicker";
import moment from "moment";
import React from "react";

import formGroup from "../formGroup";

import "react-datepicker/dist/react-datepicker.css";
import "./css/dateedit.css";

/**
 * Form control to edit a date text field.
 *
 * Set the initial value with 'initialValue' and set a callback for
 * value changed with 'onChange'.
 */
class DateEdit extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      initialValue: props.initialValue,
      value: props.initialValue,
      missing: false,
      showPicker: false
    };
  }

  isEmpty(value) {
    return _.isNull(value) || _.isUndefined(value);
  }

  isMissing(v) {
    return this.props.required && !this.props.disabled && this.isEmpty(v);
  }

  componentWillReceiveProps(nextProps) {
    const previousValue = this.state.initialValue
      ? this.state.initialValue.getTime()
      : null;
    const nextValue = nextProps.initialValue
      ? nextProps.initialValue.getTime()
      : null;
    if (previousValue !== nextValue) {
      this.setState({
        initialValue: nextProps.initialValue,
        value: nextProps.initialValue
      });

      const missing = this.isMissing(nextProps.initialValue);

      // Re-broadcast missing state up to the owner
      if (this.props.onMissingCountChange) {
        this.props.onMissingCountChange(this.props.name, missing ? 1 : 0);
      }
    }
  }

  componentDidMount() {
    const missing = this.isMissing(this.props.initialValue);
    const value = this.props.initialValue;

    this.setState({ value, missing });

    if (this.props.onMissingCountChange) {
      this.props.onMissingCountChange(this.props.name, missing ? 1 : 0);
    }
  }

  handleDateChange(v) {
    const value = v ? v.toDate() : null;
    const missing = this.props.required && this.isEmpty(value);

    console.log("handleDateChange", value);

    this.setState({ value, missing });

    // Callbacks
    if (this.props.onChange) {
      this.props.onChange(this.props.name, value);
    }
    if (this.props.onMissingCountChange) {
      this.props.onMissingCountChange(this.props.name, missing ? 1 : 0);
    }
  }

  inlineStyle(hasError, isMissing) {
    let color = "inherited";
    let background = "inherited";
    let borderLeftStyle = "inherited";
    let borderLeftColor = "inherited";
    let borderLeftWidth = 2;
    if (this.state.error) {
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
    const selected = this.state.value ? moment(this.state.value) : null;
    let className = "datepicker__input rdf";
    const isMissing = this.isMissing(this.state.value);
    if (this.state.error) {
      className = "datepicker__input rdf has-error";
    }
    if (isMissing) {
      className += " is-missing";
    }

    if (this.props.edit) {
      return (
        <div>
          <div>
            <DatePicker
              key={`date`}
              ref="input"
              className={className}
              disabled={this.props.disabled}
              placeholderText={this.props.placeholder}
              selected={selected}
              onChange={v => this.handleDateChange(v)}
            />
          </div>
        </div>
      );
    } else {
      const isMissing = this.isMissing(this.state.value);
      const hasError = this.state.error;
      let text = selected ? selected.format("MM/DD/YYYY") : "";
      if (isMissing) {
        text = " ";
      }
      const style = this.inlineStyle(hasError, isMissing);
      return <div style={style}>{text}</div>;
    }
  }
}

DateEdit.defaultProps = {
  width: "100%"
};

export default formGroup(DateEdit);

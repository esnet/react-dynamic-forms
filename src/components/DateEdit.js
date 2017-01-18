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

import "react-datepicker/dist/react-datepicker.css";
import "./dateedit.css";

/**
 * Form control to edit a date text field.
 *
 * Set the initial value with 'initialValue' and set a callback for
 * value changed with 'onChange'.
 */
export default React.createClass({
  displayName: "DateEdit",
  getDefaultProps() {
    return { width: "100%" };
  },
  getInitialState() {
    return {
      initialValue: this.props.initialValue,
      value: this.props.initialValue,
      missing: false,
      showPicker: false
    };
  },
  isEmpty(value) {
    return _.isNull(value);
  },
  isMissing(v) {
    return this.props.required && !this.props.disabled && this.isEmpty(v);
  },
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
        this.props.onMissingCountChange(this.props.attr, missing ? 1 : 0);
      }
    }
  },
  componentDidMount() {
    const missing = this.isMissing(this.props.initialValue);
    const value = this.props.initialValue;

    this.setState({ value, missing });

    if (this.props.onMissingCountChange) {
      this.props.onMissingCountChange(this.props.attr, missing ? 1 : 0);
    }
  },
  handleDateChange(v) {
    const value = v ? v.toDate() : null;
    const missing = this.props.required && this.isEmpty(value);
    this.setState({ value, missing });

    // Callbacks
    if (this.props.onChange) {
      this.props.onChange(this.props.attr, value);
    }
    if (this.props.onMissingCountChange) {
      this.props.onMissingCountChange(this.props.attr, missing ? 1 : 0);
    }
  },
  render() {
    const selected = this.state.value ? moment(this.state.value) : null;
    let className = "datepicker__input rdf";
    const requiredError = this.props.showRequired &&
      this.isMissing(this.state.value);
    if (this.state.error || requiredError) {
      className = "datepicker__input rdf has-error";
    }
    return (
      <div>
        <div>
          <DatePicker
            key={`bob`}
            ref="input"
            className={className}
            disabled={this.props.disabled}
            placeholderText={this.props.placeholder}
            selected={selected}
            onBlur={this.handleOnBlur}
            onChange={this.handleDateChange}
          />
        </div>
      </div>
    );
  }
})


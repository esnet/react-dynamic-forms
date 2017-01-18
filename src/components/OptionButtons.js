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
import _ from "underscore";

export default React.createClass({
  displayName: "OptionButtons",
  getInitialState() {
    return { value: this.props.initialChoice };
  },
  handleChange(e) {
    const value = e.target.value;
    const missing = this.props.required && this._isEmpty(value);

    // State changes
    this.setState({ value, missing });

    // Callbacks
    if (this.props.onChange) {
      this.props.onChange(this.props.attr, e.target.value);
    }
  },
  render() {
    const classes = "btn-group btn-group-sm esdb-";

    if (!this.props.initialChoiceList) {
      throw new Error(
        `No initial choice list supplied for attr '${this.props.attr}'`
      );
    }

    const buttonElements = _.map(this.props.initialChoiceList, (choice, i) => {
      if (Number(i) === Number(this.props.initialChoice)) {
        return (
          <button
            type="button"
            className="active btn btn-default"
            key={i}
            value={i}
            onClick={this.handleChange}
          >
            {choice}
          </button>
        );
      } else {
        return (
          <button
            type="button"
            className="btn btn-default"
            key={i}
            value={i}
            onClick={this.handleChange}
          >
            {choice}
          </button>
        );
      }
    });

    const width = this.props.width ? this.props.width + "px" : "400px";

    // Key based on the choice list
    const choiceList = _.map(this.props.initialChoiceList, choice => choice);
    const list = choiceList.join("-");

    return (
      <div
        className={classes}
        key={list}
        width={width}
        style={{ marginBottom: 5 }}
      >
        {buttonElements}
      </div>
    );
  }
})


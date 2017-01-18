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
import React from "react";

import Chooser from "./Chooser";
import ListEditorMixin from "./ListEditorMixin";
import TextEdit from "./TextEdit";

// State transitions when adding to the key-value list
const CreationState = { OFF: "OFF", PICK_KEYNAME: "PICK_KEYNAME" };

const KeyValueListEditor = React.createClass({
  displayName: "KeyValueListEditor",
  mixins: [ ListEditorMixin ],
  getInitialState() {
    return {
      createState: CreationState.OFF,
      keyName: null,
      value: "",
      valueError: false,
      validationRule: null
    };
  },
  /**  Set initial items */
  initialItems() {
    return this.props.keyValues || [];
  },
  /** Create a new item */
  createItem(data) {
    const keyName = data.keyName;
    const value = data.value;
    return { keyName, value, valueError: false, validationRule: null };
  },
  handleKeyNameSelect(attr, value) {
    let validation = null;
    _.each(this.props.constraints, constraint => {
      if (_.isMatch(constraint, { keyname: value })) {
        if (constraint["datatype"] === "integer") {
          validation = { format: constraint["datatype"], type: "integer" };
        } else {
          validation = { format: constraint["datatype"], type: "string" };
        }
      }
    });
    this.setState({ validationRule: validation });
    this.setState({ keyName: value });
  },
  handleDialogValueChanged(attr, value) {
    this.setState({ value });
  },
  handleDone() {
    const data = {
      keyName: this.state.keyName,
      value: this.state.value,
      valueError: this.state.valueError,
      validationRule: this.state.validationRule
    };

    this.transitionTo(CreationState.OFF)();
    this.handleAddItem(data);

    this.setState({
      keyName: null,
      value: "",
      valueError: false,
      validationRule: null
    });
  },
  handleDialogValueError(attr, errorCount) {
    this.setState({ valueError: errorCount === 1 ? true : false });
  },
  handleCancel() {
    this.transitionTo(CreationState.OFF)();
    this.setState({
      keyName: null,
      value: "",
      valueError: false,
      validationRule: null
    });
  },
  //
  // General state transition
  //
  transitionTo(newState) {
    return () => {
      this.setState({ createState: newState });
    };
  },
  plusUI() {
    let ui;
    const keyValueChoice = _.map(this.props.constraints, value => {
      return { id: value["keyname"], label: value["keyname"] };
    });

    // Get a list of keys not already used in the existing items
    const existingKeys = _.pluck(this.state.items, "keyName");
    const existingKeySet = _.object(existingKeys, existingKeys);
    const filteredChoiceList = _.filter(keyValueChoice, choice => {
      return !_.has(existingKeySet, choice.label);
    });

    switch (this.state.createState) {
      case CreationState.OFF:
        // Initial UI to show the [+] Contact
        if (filteredChoiceList.length !== 0) {
          ui = <div className="esdb-plus-action-box" key="append-new-or-existing" style={
            { marginBottom: 10 }
          } onClick={this.transitionTo(CreationState.PICK_KEYNAME)}>
            <div>
              <i className="glyphicon glyphicon-plus esnet-forms-small-action-icon">
                Key
              </i>
            </div>
          </div>;
        } else {
          ui = <div>
            <table>
              <tbody>
                <tr><td>
                  <i className="glyphicon glyphicon-plus esdb-small-action-icon text-muted">
                    All available choices selected
                  </i>
                </td></tr>
              </tbody>
            </table>
          </div>;
        }
        break;

      case CreationState.PICK_KEYNAME:
        let doneButtonElement;
        let cancelButtonElement;

        const buttonStyle = {
          marginLeft: 0,
          marginRight: 10,
          marginTop: 10,
          marginBottom: 10,
          height: 22,
          width: 55,
          float: "right"
        };

        cancelButtonElement = <button style={
          buttonStyle
        } type="button" className="btn btn-xs btn-default" key="cancel-button" onClick={
          this.handleCancel
        }>Cancel</button>;

        if (
          this.state.keyName === null || this.state.value === "" ||
            this.state.valueError === true
        ) {
          doneButtonElement = <button style={
            buttonStyle
          } type="button" key="pick-contact-button-disabled" className="btn btn-xs btn-default" disabled="disabled">Done</button>;
        } else {
          doneButtonElement = <button style={
            buttonStyle
          } type="button" className="btn btn-xs btn-default" key="pick-contact-button" onClick={
            this.handleDone
          }>Done</button>;
        }

        ui = <div className="esdb-plus-action-box-dialog-lg" key="select-existing" style={
          { marginBottom: 10 }
        }>
          <table>
            <tbody>
              <tr>
                <td width="150">Key Name</td>
                <td>
                  <Chooser attr="keyName" initialChoice={
                    null
                  } initialChoiceList={filteredChoiceList} onChange={
                    this.handleKeyNameSelect
                  } />
                </td>
              </tr>
              <tr>
                <td width="150">Value</td>
                <td>
                  <TextEdit attr="value" rules={
                    this.state.validationRule
                  } onErrorCountChange={this.handleDialogValueError} onChange={
                    this.handleDialogValueChanged
                  } width={300} />
                </td>
              </tr>
              <tr>
                <td></td>
                <td>
                  <span>{cancelButtonElement}</span>
                  <span>{doneButtonElement}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>;
        break;
    }
    return ui;
  },
  renderItem(item) {
    const style = { paddingLeft: 12, color: "#A6A6A6" };
    const keyName = item.keyName;
    const value = item.value;
    return (
      <div>
        <table>
          <tbody>
            <tr>
              <td width="140">{keyName}</td>
              <td>
                <span style={style}>
                  {value}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
});

export default React.createClass({
  displayName: "KeyValueEditor",
  handleChange(attr, keyValue) {
    let newKeyValues = {};

    _.each(keyValue, keyName => {
      newKeyValues[keyName["keyName"]] = keyName["value"];
    });

    if (this.props.onChange) {
      this.props.onChange(this.props.attr, newKeyValues);
    }
  },
  render() {
    const keyValuesDict = this.props.keyValues;
    let keyValueList = [];
    _.each(keyValuesDict, (value, keyName) => {
      keyValueList.push({ keyName, value });
    });

    return <KeyValueListEditor keyValues={keyValueList} constraints={
      this.props.constraints
    } onChange={this.handleChange} />;
  }
})


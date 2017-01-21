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
import VirtualizedSelect from "react-virtualized-select";
import _ from "underscore";
import hash from "string-hash";

import "react-select/dist/react-select.css";
import "react-virtualized/styles.css";
import "react-virtualized-select/styles.css";

import "./chooser.css";

/**
 * React Form control to select an item from a list.
 *
 * Wraps the react-select library
 *
 * ### Example
 *
 * ```
 *     const animalMap = {1: "dog", 2: "duck", 3: "cat", ...};
 *     const animalList = animalMap.map((value, key) => ({id: key, label: value}));
 *
 *     ...
 *
 *     <Chooser
 *         initialChoiceList={animalList}
 *         placeholder="Select an Animal..."
 *         width={300}
 *     />
 * ```
 *
 * Generally you would use the Chooser as part of a `ChooserGroup`:
 *
 * ```
 *    <ChooserGroup
 *        attr="contact_type"
          initialChoice={contactType}
          initialChoiceList={contactTypes}
          disableSearch={true}
          width={200}
      />
 * ```
 *
 * ### Props
 *
 *  * *initialChoice* - Pass in the initial value as an id
 *
 *  * *initialChoiceList* - Pass in the available list of options as a list of
 *    objects. For example:
 *
 *    ```
 *    [{id: 1: label: "cat"},
 *     {id: 2: label: "dog"},
 *     ... ]
 *    ```
 *  * *disableSearch* - If true the chooser becomes a simple pulldown menu
 *    rather than allowing the user to type into it.
 *
 *  * *width* - Customize the horizontal size of the Chooser.
 *
 *  * *attr* - The identifier of the property being editted
 *
 *  * *onChange* - Callback for when value changes. Will be passed the attr and
 *    new value as a string.
 *
 *  * *allowSingleDeselect* - Add a [x] icon to the chooser allowing the user to
 *    clear the selected value
 *
 *  * *searchContains* - Can be "any" or "start", indicating how the search is
 *    matched within the items (anywhere, or starting with).
 */
export default React.createClass({
  displayName: "Chooser",
  getDefaultProps() {
    return {
      disabled: false,
      disableSearch: false,
      searchContains: true,
      allowSingleDeselect: false,
      width: 300
    };
  },
  getInitialState() {
    return {
      initialChoice: this.props.initialChoice,
      value: this.props.initialChoice,
      missing: false
    };
  },
  _isEmpty(value) {
    return _.isNull(value) || _.isUndefined(value) || value === "";
  },
  _isMissing() {
    return this.props.required && !this.props.disabled &&
      this._isEmpty(this.state.value);
  },
  _generateKey(choice, choiceList) {
    let key = hash(_.map(choiceList, label => label).join("-"));
    key += "-" + choice;
    return key;
  },
  componentWillReceiveProps(nextProps) {
    if (this.state.initialChoice !== nextProps.initialChoice) {
      const key = this._generateKey(
        nextProps.initialChoice,
        this.props.initialChoiceList
      );
      this.setState({
        key,
        initialChoice: nextProps.initialChoice,
        value: nextProps.initialChoice
      });

      // The value might have been missing and is now set explicitly
      // with a prop
      const missing = this.props.required && !this.props.disabled &&
        (_.isNull(nextProps.initialChoice) ||
          _.isUndefined(nextProps.initialChoice) ||
          nextProps.initialChoice === "");
      const missingCount = missing ? 1 : 0;

      if (this.props.onMissingCountChange) {
        this.props.onMissingCountChange(this.props.attr, missingCount);
      }
    }
  },
  /**
     * If there's no initialValue for the chooser and this field is required
     * then report the missing count up to the parent.
     */
  componentDidMount() {
    const missing = this.props.required && !this.props.disabled &&
      (_.isNull(this.props.initialChoice) ||
        _.isUndefined(this.props.initialChoice) ||
        this.props.initialChoice === "");
    const missingCount = missing ? 1 : 0;

    if (this.props.onMissingCountChange) {
      this.props.onMissingCountChange(this.props.attr, missingCount);
    }

    // The key needs to change if the initialChoiceList changes, so we set
    // the key to be the hash of the choice list
    this.setState({
      missing,
      key: this._generateKey(
        this.props.initialChoice,
        this.props.initialChoiceList
      )
    });
  },
  handleChange(v) {
    let { value } = v || {};
    const missing = this.props.required && this._isEmpty(v);

    // If the chosen id is a number, cast it to a number
    if (!this._isEmpty(v) && !_.isNaN(Number(v))) {
      value = +v;
    }

    // State changes
    this.setState({ value, missing });

    // Callbacks
    if (this.props.onChange) {
      this.props.onChange(this.props.attr, value);
    }
    if (this.props.onMissingCountChange) {
      this.props.onMissingCountChange(this.props.attr, missing ? 1 : 0);
    }
  },
  getOptionList() {
    return _.map(this.props.initialChoiceList, c => {
      let disabled = false;
      const isDisabled = _.has(c, "disabled") && c.disabled === true;
      if (_.contains(this.props.disableList, c.id) || isDisabled) {
        disabled = true;
      }
      return { value: c.id, label: c.label, disabled };
    });
  },
  getFilteredOptionList(input) {
    const items = this.props.initialChoiceList;
    const filteredItems = input ? _.filter(items, item => {
        return item.label.toLowerCase().indexOf(`${input}`.toLowerCase()) !==
          -1;
      }) : items;
    return _.map(filteredItems, c => ({
      value: `${c.id}`,
      label: c.label,
      disabled: _.has(c, "disabled") ? c.disabled : false
    }));
  },
  getOptions(input, cb) {
    const options = this.getFilteredOptionList(input);
    if (options) {
      cb(null, { options, complete: true });
    }
  },
  getCurrentChoice() {
    const choiceItem = _.find(this.props.initialChoiceList, item => {
      return item.id === this.state.value;
    });

    return choiceItem ? choiceItem.id : undefined;
  },
  render() {
    let className = "";

    const width = this.props.width ? this.props.width + "px" : "100%";

    const chooserStyle = { width, marginBottom: 10 };

    if (!this.props.initialChoiceList) {
      throw new Error(
        `No initial choice list supplied for attr '${this.props.attr}'`
      );
    }

    if (this.props.showRequired && this._isMissing()) {
      className = "has-error";
    }

    const choice = this.getCurrentChoice();
    const clearable = this.props.allowSingleDeselect;
    const searchable = !this.props.disableSearch;
    const matchPos = this.props.searchContains ? "any" : "start";

    if (searchable) {
      const options = this.getFilteredOptionList(null);
      const labelList = _.map(options, item => item.label);
      const key = `${labelList}--${choice}`;
      return (
        <div className={className} style={chooserStyle}>
          <VirtualizedSelect
            className={"sectionTest"}
            key={key}
            name="form-field-name"
            value={choice}
            options={options}
            disabled={this.props.disabled}
            searchable={true}
            matchPos={matchPos}
            onChange={this.handleChange}
            placeholder={this.props.placeholder}
          />
        </div>
      );
    } else {
      const options = this.getOptionList();
      const labelList = _.map(options, item => item.label);
      const key = `${labelList}--${choice}`;
      return (
        <div className={className} style={chooserStyle}>
          <VirtualizedSelect
            className={"sectionTest"}
            key={key}
            name="form-field-name"
            value={choice}
            options={options}
            disabled={this.props.disabled}
            searchable={false}
            clearable={clearable}
            matchPos={matchPos}
            onChange={this.handleChange}
            placeholder={this.props.placeholder}
          />
        </div>
      );
    }
  }
})


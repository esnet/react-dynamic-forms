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
import formGroup from "../formGroup";
import "react-select/dist/react-select.css";
import "react-virtualized/styles.css";
import "react-virtualized-select/styles.css";

import "./css/chooser.css";

/**
 * React Form control to select an item from a list.
 *
 * Wraps the react-virtualized-select library, which itself
 * wraps react-select but with support for large lists.
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
 *        initialChoice={contactType}
 *        initialChoiceList={contactTypes}
 *        disableSearch={true}
 *        width={200}
 *    />
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
class Chooser extends React.Component {
  constructor(props) {
    super(props);
    console.log("Initializing chooser", props);
    this.state = {
      value: props.value,
      missing: false
    };
  }

  isEmpty(value) {
    return _.isNull(value) || _.isUndefined(value) || value === "";
  }

  isMissing() {
    console.log(
      "chooser isMissing",
      this.props.attr,
      this.props.required,
      this.props.disabled,
      this.isEmpty(this.state.value),
      this.state.value
    );
    return this.props.required &&
      !this.props.disabled &&
      this.isEmpty(this.state.value);
  }

  generateKey(choice, choiceList) {
    let key = hash(_.map(choiceList, label => label).join("-"));
    key += "-" + choice;
    return key;
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.value !== nextProps.value) {
      const key = this.generateKey(nextProps.value, this.props.choiceList);
      this.setState({
        key,
        value: nextProps.value
      });

      // The value might have been missing and is now set explicitly
      // with a prop
      const missing = this.props.required &&
        !this.props.disabled &&
        (_.isNull(nextProps.value) ||
          _.isUndefined(nextProps.value) ||
          nextProps.value === "");
      const missingCount = missing ? 1 : 0;

      if (this.props.onMissingCountChange) {
        this.props.onMissingCountChange(this.props.attr, missingCount);
      }
    }
  }

  /**
     * If there's no initial value for the chooser and this field is required
     * then report the missing count up to the parent.
     */
  componentDidMount() {
    const missing = this.props.required &&
      !this.props.disabled &&
      (_.isNull(this.props.value) ||
        _.isUndefined(this.props.value) ||
        this.props.value === "");
    const missingCount = missing ? 1 : 0;

    if (this.props.onMissingCountChange) {
      this.props.onMissingCountChange(this.props.attr, missingCount);
    }

    // The key needs to change if the choiceList changes, so we set
    // the key to be the hash of the choice list
    this.setState({
      missing,
      key: this.generateKey(this.props.value, this.props.choiceList)
    });
  }

  handleChange(v) {
    let { value } = v || {};
    const missing = this.props.required && this.isEmpty(v);

    // If the chosen id is a number, cast it to a number
    if (!this.isEmpty(v) && !_.isNaN(Number(v))) {
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
  }

  getOptionList() {
    return _.map(this.props.choiceList, c => {
      let disabled = false;
      const isDisabled = _.has(c, "disabled") && c.disabled === true;
      if (_.contains(this.props.disableList, c.id) || isDisabled) {
        disabled = true;
      }
      return { value: c.id, label: c.label, disabled };
    });
  }

  getFilteredOptionList(input) {
    const items = this.props.choiceList;
    const filteredItems = input ? _.filter(items, item => {
          return item.label.toLowerCase().indexOf(`${input}`.toLowerCase()) !==
            -1;
        }) : items;
    return _.map(filteredItems, c => ({
      value: `${c.id}`,
      label: c.label,
      disabled: _.has(c, "disabled") ? c.disabled : false
    }));
  }

  getOptions(input, cb) {
    const options = this.getFilteredOptionList(input);
    if (options) {
      cb(null, { options, complete: true });
    }
  }

  getCurrentChoice() {
    const choiceItem = _.find(this.props.choiceList, item => {
      console.log("  chooser -", item, item.id, this.state.value);
      return item.id === this.state.value;
    });

    console.log("Current choice (chooser):", choiceItem);

    return choiceItem ? choiceItem.id : undefined;
  }

  getCurrentChoiceLabel() {
    const choiceItem = _.find(this.props.choiceList, item => {
      return item.id === this.state.value;
    });

    return choiceItem ? choiceItem.label : "";
  }

  render() {
    const choice = this.getCurrentChoice();
    const isMissing = this.isMissing(this.state.value);

    if (this.props.edit) {
      let className = "";
      const chooserStyle = { marginBottom: 10 };
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
              className={isMissing ? "is-missing" : ""}
              key={key}
              name="form-field-name"
              value={choice}
              options={options}
              disabled={this.props.disabled}
              searchable={true}
              matchPos={matchPos}
              placeholder={this.props.placeholder}
              onChange={v => this.handleChange(v)}
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
              className={isMissing ? "is-missing" : ""}
              key={key}
              name="form-field-name"
              value={choice}
              options={options}
              disabled={this.props.disabled}
              searchable={false}
              clearable={clearable}
              matchPos={matchPos}
              placeholder={this.props.placeholder}
              onChange={v => this.handleChange(v)}
            />
          </div>
        );
      }
    } else {
      let text = this.getCurrentChoiceLabel();
      let color = "inherited";
      let background = "inherited";
      if (this.state.error) {
        color = "#b94a48";
        background = "pink";
      } else if (isMissing) {
        text = " ";
        background = "floralwhite";
      }
      const style = {
        color,
        background,
        height: 23,
        width: "100%",
        paddingLeft: 3
      };
      return <div style={style}>{text}</div>;
    }
  }
}

Chooser.defaultProps = {
  disabled: false,
  disableSearch: false,
  searchContains: true,
  allowSingleDeselect: false,
  width: 300
};

export default formGroup(Chooser);

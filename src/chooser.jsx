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
import Select from "react-select";
import hash from "string-hash";

import "./select.css";

/**
 * React Form control to select an item from a list.
 *
 * Wraps the react-select library
 *
 * Props:
 *     initialChoice     - Pass in the initial value as an id
 *
 *     initialChoiceList - Pass in the available list of options as a list of
 *                         objects.
 *                         e.g. [{id: 1: label: "cat"},
 *                               {id: 2: label: "dog"},
 *                               ... ]
 *
 *     attr              - The identifier of the property being editted
 *
 *     onChange          - Callback for when value changes.
 *                         Will be passed the attr and new value as a string.
 * States:
 *     value             - The current value (index) of the chosen selector.
 *
 */
export default React.createClass({

    displayName: "Chooser",

    getDefaultProps() {
        return {
            disabled: false,
            disableSearch: false,
            searchContains: true,
            allowSingleDeselect: false,
            limit: 20,
            width: "300"
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
        return (_.isNull(value) ||
                _.isUndefined(value) ||
                value === "");
    },

    _isMissing() {
        return this.props.required &&
                !this.props.disabled &&
                this._isEmpty(this.state.value);
    },

    _generateKey(choice, choiceList) {
        let key = hash(_.map(choiceList, label => label).join("-"));
        key += "-" + choice;
        return key;
    },

    componentWillReceiveProps(nextProps) {
        if (this.state.initialChoice !== nextProps.initialChoice) {
            const key = this._generateKey(nextProps.initialChoice,
                                        this.props.initialChoiceList);
            this.setState({
                initialChoice: nextProps.initialChoice,
                value: nextProps.initialChoice,
                key: key
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
            missing: missing,
            key: this._generateKey(this.props.initialChoice,
                                   this.props.initialChoiceList)
        });
    },

    handleChange(v) {

        const missing = this.props.required && this._isEmpty(v);

        // If the chosen id is a number, cast it to a number
        let value;
        if (!this._isEmpty(v) && !_.isNaN(Number(v))) {
            value = Number(v);
        } else {
            value = v;
        }

        // State changes
        this.setState({value: value,
                       missing: missing});

        // Callbacks
        if (this.props.onChange) {
            this.props.onChange(this.props.attr, value);
        }
        if (this.props.onMissingCountChange) {
            this.props.onMissingCountChange(this.props.attr, missing ? 1 : 0);
        }
    },

    getOptionList() {
        return _.map(this.props.initialChoiceList, (c) => {
            let disabled = false;
            if (_.contains(this.props.disableList, c.id) ||
                (_.has(c, "disabled") && c.disabled === true)) {
                disabled = true;
            }
            return {
                value: c.id,
                label: c.label,
                disabled: disabled
            };
        });
    },

    getFilteredOptionList(input, limit, choice) {
        const items = this.props.initialChoiceList;
        const filteredItems = input ? _.filter(items, item => {
            return (item.id === choice || item.label.toLowerCase().indexOf(`${input}`.toLowerCase()) !== -1);
        }) : items;
        const limitItems = _.first(filteredItems, limit);
        let results = _.map(limitItems, (c) =>
            ({value: c.id, label: c.label, disabled: _.has(c, "disabled") ? c.disabled : false}));

        if (filteredItems.length > limit) {
            results.push({id: null, label: "(truncated)", disabled: true});
        }
        return results;
    },

    getOptions(input, cb) {
        cb(null, {
            options: this.getFilteredOptionList(input, this.props.limit, this.getCurrentChoice()),
            complete: false
        });
    },

    getCurrentChoice() {
        const choiceItem = _.find(this.props.initialChoiceList, (item) => {
            let itemId;
            if (!this._isEmpty(item.id) && !_.isNaN(Number(item.id))) {
                itemId = Number(item.id);
            } else {
                itemId = item.id;
            }
            return itemId === this.state.value;
        });

        return choiceItem ? choiceItem.id : undefined;
    },

    render() {
        let className = "";

        if (!this.props.initialChoiceList) {
            console.warn("No initial choice list supplied for attr",
                this.props.attr);
        }

        const width = this.props.width ? this.props.width + "px" : "100%";
        if (this.props.showRequired && this._isMissing()) {
            className = "has-error";
        }

        const choice = this.getCurrentChoice();
        const clearable = this.props.allowSingleDeselect;
        const searchable = !this.props.disableSearch;
        const matchPos = this.props.searchContains ? "any" : "start";
        const labelList = _.map(this.props.initialChoiceList, (item) => item.label);
        const key = `${labelList}--${this.state.choice}`;

        if (searchable) {
            return (
                <div className={className} style={{width: width}}>
                    <Select
                        key={key}
                        name="form-field-name"
                        value={choice}
                        options={this.getFilteredOptionList(null, this.props.limit, choice)}
                        disabled={this.props.disabled}
                        searchable={true}
                        matchPos={matchPos}
                        onChange={this.handleChange}
                        asyncOptions={this.getOptions}
                        cacheAsyncResults={false}
                    />
                </div>
            );
        } else {
            return (
                <div className={className} style={{width: width}}>
                    <Select
                        key={key}
                        name="form-field-name"
                        value={choice}
                        options={this.getOptionList()}
                        disabled={this.props.disabled}
                        searchable={false}
                        clearable={clearable}
                        matchPos={matchPos}
                        onChange={this.handleChange}
                    />
                </div>
            );
        }
    }
});

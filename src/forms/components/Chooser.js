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
import VirtualizedSelect from "react-virtualized-select";
import _ from "underscore";

import formGroup from "../formGroup";
import "react-select/dist/react-select.css";
import "react-virtualized/styles.css";
import "react-virtualized-select/styles.css";

import "./css/chooser.css";

/**
 * React Form control to select an item from a list.
 *
 *
 * ### Props
 *
 *  * *choiceList* - Pass in the available list of options as a list of
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
 *  * *width* - Customize the horizontal size of the Chooser
 *
 *  * *field* - The identifier of the field being edited
 *
 *  * *onChange* - Callback for when value changes
 *
 *  * *allowSingleDeselect* - Add a [x] icon to the chooser allowing the user to
 *    clear the selected value
 *
 *  * *searchContains* - Can be "any" or "start", indicating how the search is
 *    matched within the items (anywhere, or starting with)
 */
class Chooser extends React.Component {
    isEmpty(value) {
        return _.isNull(value) || _.isUndefined(value) || value === "";
    }

    isMissing(value = this.props.value) {
        return this.props.required && !this.props.disabled && this.isEmpty(value);
    }

    componentDidMount() {
        const missing = this.props.required &&
            !this.props.disabled &&
            (_.isNull(this.props.value) ||
                _.isUndefined(this.props.value) ||
                this.props.value === "");
        const missingCount = missing ? 1 : 0;

        if (this.props.onMissingCountChange) {
            this.props.onMissingCountChange(this.props.name, missingCount);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (
            this.props.value !== nextProps.value ||
            (!this.props.value && nextProps.value) ||
            (this.props.value && !nextProps.value)
        ) {
            // The value might have been missing and is now set explicitly
            // with a prop
            const missing = this.props.required &&
                !this.props.disabled &&
                (_.isNull(nextProps.value) ||
                    _.isUndefined(nextProps.value) ||
                    nextProps.value === "");
            const missingCount = missing ? 1 : 0;

            if (this.props.onMissingCountChange) {
                this.props.onMissingCountChange(this.props.name, missingCount);
            }
        }
    }

    handleChange(v) {
        let { value } = v || {};
        const missing = this.props.required && this.isEmpty(v);

        // If the chosen id is a number, cast it to a number
        if (!this.isEmpty(v) && !_.isNaN(Number(v))) {
            value = +v;
        }

        // Callbacks
        if (this.props.onChange) {
            this.props.onChange(this.props.name, value);
        }
        if (this.props.onMissingCountChange) {
            this.props.onMissingCountChange(this.props.name, missing ? 1 : 0);
        }
        if (this.props.onBlur) {
            this.props.onBlur(this.props.name);
        }
    }

    getOptionList() {
        return this.props.choiceList
            .map(item => {
                let disabled = false;
                const isDisabled = item.has("disabled") && item.get("disabled") === true;
                if (_.contains(this.props.disableList, item.get("id")) || isDisabled) {
                    disabled = true;
                }
                return { value: item.get("id"), label: item.get("label"), disabled };
            })
            .toJS();
    }

    getFilteredOptionList(input) {
        const items = this.props.choiceList;
        const filteredItems = input
            ? items.filter(item => {
                  return item.label.toLowerCase().indexOf(`${input}`.toLowerCase()) !== -1;
              })
            : items;
        const result = [];
        filteredItems.forEach(item =>
            result.push({
                value: `${item.get("id")}`,
                label: item.get("label"),
                disabled: item.has("disabled") ? item.get("disabled") : false
            }));
        return result;
    }

    getOptions(input, cb) {
        const options = this.getFilteredOptionList(input);
        if (options) {
            cb(null, { options, complete: true });
        }
    }

    getCurrentChoice() {
        const choiceItem = this.props.choiceList.find(item => {
            return item.get("id") === this.props.value;
        });
        return choiceItem ? choiceItem.get("id") : undefined;
    }

    getCurrentChoiceLabel() {
        const choiceItem = this.props.choiceList.find(item => {
            return item.get("id") === this.props.value;
        });
        return choiceItem ? choiceItem.get("label") : "";
    }

    render() {
        const choice = this.getCurrentChoice();
        const isMissing = this.isMissing(this.props.value);

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
            const view = this.props.view;
            let text = this.getCurrentChoiceLabel();
            let color = "";
            let background = "";
            if (isMissing) {
                text = " ";
                background = "floralwhite";
            }

            const viewStyle = {
                color,
                background,
                minHeight: 23,
                width: "100%",
                paddingLeft: 3
            };

            const style = {
                color,
                background,
                height: 23,
                width: "100%",
                paddingLeft: 3
            };

            if (!view) {
                return <div style={style}>{text}</div>;
            } else {
                return <div style={viewStyle}>{view(text, choice)}</div>;
            }
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

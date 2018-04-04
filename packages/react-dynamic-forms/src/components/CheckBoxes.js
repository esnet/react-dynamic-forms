/**
 *  Copyright (c) 2015 - present, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import React from "react";
import _ from "underscore";
import Immutable from "immutable";

import formGroup from "../js/formGroup";

/**
 * Form control to select multiple items from a list,
 * uses checkboxes next to each item.
 */
class CheckBoxes extends React.Component {
    componentWillReceiveProps(nextProps) {
        if (this.props.value !== nextProps.value) {
            const missingCount = this.isMissing(nextProps.value) ? 1 : 0;
            if (this.props.onMissingCountChange) {
                this.props.onMissingCountChange(this.props.name, missingCount);
            }
        }
    }

    handleChange(i) {
        let value;
        const option = this.props.optionList.get(i);
        if (this.props.value.includes(option)) {
            value = this.props.value.filterNot(item => item === option);
        } else {
            value = this.props.value.push(option);
        }
        if (this.props.onChange) {
            this.props.onChange(this.props.name, value);
        }
    }

    isEmpty(value) {
        if (Immutable.List.isList(value)) {
            return value.size === 0;
        }
        return _.isNull(value) || _.isUndefined(value);
    }

    isMissing(value = this.props.value) {
        return this.props.required && !this.props.disabled && this.isEmpty(value);
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
            width: "100%",
            paddingLeft: 3
        };
    }

    render() {
        if (this.props.edit) {
            const items = [];
            this.props.optionList.forEach((option, i) => {
                items.push(
                    <div key={i} className="checkbox">
                        <label>
                            <input
                                type="checkbox"
                                checked={this.props.value.includes(option)}
                                onChange={() => this.handleChange(i)}
                            />
                            {option}
                        </label>
                    </div>
                );
            });

            return (
                <div>
                    {items}
                </div>
            );
        } else {
            return (
                <div style={this.inlineStyle(false, false)}>
                    {this.props.value.join(", ")}
                </div>
            );
        }
    }
}

export default formGroup(CheckBoxes);

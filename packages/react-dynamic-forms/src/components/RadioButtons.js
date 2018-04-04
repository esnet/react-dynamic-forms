/**
 *  Copyright (c) 2017 - present, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import React from "react";
import _ from "underscore";

import formGroup from "../js/formGroup";

class RadioButtons extends React.Component {
    handleChange(v) {
        // Callbacks
        if (this.props.onChange) {
            this.props.onChange(this.props.name, v);
        }
        if (this.props.onBlur) {
            this.props.onBlur(this.props.name);
        }
    }

    getCurrentChoiceLabel() {
        const choiceItem = this.props.optionList.find(item => {
            return item.get("id") === this.props.value;
        });
        return choiceItem ? choiceItem.get("label") : "";
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
            const items = this.props.optionList.map((item, i) => {
                const id = item.get("id");
                const label = item.get("label");
                return (
                    <div className="radio" key={i}>
                        <label>
                            <input
                                type="radio"
                                name={label}
                                id={id}
                                value={id}
                                checked={id === this.props.value}
                                onChange={() => this.handleChange(id)}
                            />
                            {label}
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
            let text = this.getCurrentChoiceLabel();
            return (
                <div style={this.inlineStyle(false, false)}>
                    {text}
                </div>
            );
        }
    }
}

RadioButtons.defaultProps = {
    width: 300
};

export default formGroup(RadioButtons);

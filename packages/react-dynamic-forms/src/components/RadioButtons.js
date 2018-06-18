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
import { textView } from "../js/renderers";
import { editAction } from "../js/actions";
import { inlineStyle } from "../js/style";

class RadioButtons extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isFocused: false };
    }

    getCurrentChoiceLabel() {
        const choiceItem = this.props.optionList.find(item => {
            return item.get("id") === this.props.value;
        });
        return choiceItem ? choiceItem.get("label") : "";
    }

    handleMouseEnter() {
        this.setState({ hover: true });
    }

    handleMouseLeave() {
        this.setState({ hover: false });
    }

    handleFocus() {
        this.setState({ isFocused: true });
    }

    handleBlur() {
        if (this.props.onBlur) {
            this.props.onBlur(this.props.name);
        }
        this.setState({ isFocused: false, touched: true });
    }

    handleChange(v) {
        // Callbacks
        if (this.props.onChange) {
            this.props.onChange(this.props.name, v);
        }
        if (this.props.onBlur) {
            this.props.onBlur(this.props.name);
        }
    }

    handleEditItem() {
        this.props.onEditItem(this.props.name);
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
            return <div>{items}</div>;
        } else {
            let s = this.getCurrentChoiceLabel();
            const view = this.props.view || textView;
            const text = <span style={{ minHeight: 28 }}>{view(s)}</span>;
            const edit = editAction(this.state.hover && this.props.allowEdit, () =>
                this.handleEditItem()
            );
            return (
                <div
                    style={inlineStyle(false, false)}
                    onMouseEnter={() => this.handleMouseEnter()}
                    onMouseLeave={() => this.handleMouseLeave()}
                >
                    {text}
                    {edit}
                </div>
            );
        }
    }
}

RadioButtons.defaultProps = {
    width: 300
};

export default formGroup(RadioButtons);

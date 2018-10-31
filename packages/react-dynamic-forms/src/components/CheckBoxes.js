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
import { textView } from "../js/renderers";
import { editAction } from "../js/actions";
import { inlineStyle, inlineDoneButtonStyle, inlineCancelButtonStyle } from "../js/style";

/**
 * Form control to select multiple items from a list,
 * uses checkboxes next to each item.
 */
class CheckBoxes extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isFocused: false };
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.value !== nextProps.value) {
            const missingCount = this.isMissing(nextProps.value) ? 1 : 0;
            if (this.props.onMissingCountChange) {
                this.props.onMissingCountChange(this.props.name, missingCount);
            }
        }
    }

    handleMouseEnter() {
        this.setState({ hover: true });
    }

    handleMouseLeave() {
        this.setState({ hover: false });
    }

    handleFocus() {
        if (!this.state.isFocused) {
            this.setState({ isFocused: true, oldValue: this.props.value });
        }
    }

    handleKeyPress(e) {
        if (e.key === "Enter") {
            if (!e.shiftKey) {
                this.handleDone();
            }
        }
        if (e.keyCode === 27 /* ESC */) {
            this.handleCancel();
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

    handleEditItem() {
        this.props.onEditItem(this.props.name);
    }

    handleDone() {
        if (this.props.onBlur) {
            this.props.onBlur(this.props.name);
        }
        this.setState({ isFocused: false, hover: false, oldValue: null });
    }

    handleCancel() {
        if (this.props.onChange) {
            const v = this.state.oldValue;
            this.props.onChange(this.props.name, v);
        }
        this.props.onBlur(this.props.name);
        this.setState({ isFocused: false, hover: false, oldValue: null });
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

    // border-style: solid;
    // border-radius: 2px;
    // border-width: 1px;
    // padding: 5px;
    // border-color: #ececec;

    render() {
        if (this.props.edit) {
            const editStyle = {
                borderStyle: "solid",
                borderRadius: 2,
                borderWidth: 1,
                padding: 5,
                borderColor: "#ececec",
                marginBottom: 5
            };

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
                <div style={{ marginBottom: 5 }}>
                    <div
                        style={editStyle}
                        onFocus={e => this.handleFocus(e)}
                        onKeyUp={e => this.handleKeyPress(e)}
                    >
                        {items}
                    </div>
                    {this.props.selected ? (
                        <span style={{ marginTop: 5 }}>
                            <span
                                style={inlineDoneButtonStyle(0)}
                                onClick={() => this.handleDone()}
                            >
                                DONE
                            </span>
                            <span
                                style={inlineCancelButtonStyle()}
                                onClick={() => this.handleCancel()}
                            >
                                CANCEL
                            </span>
                        </span>
                    ) : (
                        <div />
                    )}
                </div>
            );
        } else {
            const view = this.props.view || textView;
            const text = <span style={{ minHeight: 28 }}>{view(this.props.value.join(", "))}</span>;
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

export default formGroup(CheckBoxes);

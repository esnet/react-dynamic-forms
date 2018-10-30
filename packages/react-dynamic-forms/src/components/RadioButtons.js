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

import formGroup from "../js/formGroup";
import { textView } from "../js/renderers";
import { editAction } from "../js/actions";
import { inlineStyle, inlineDoneButtonStyle, inlineCancelButtonStyle } from "../js/style";

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

    handleChange(v) {
        // Callbacks
        if (this.props.onChange) {
            this.props.onChange(this.props.name, v);
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
                <div style={{ marginBottom: 10 }}>
                    <div
                        onFocus={e => this.handleFocus(e)}
                        onKeyUp={e => this.handleKeyPress(e)}
                        style={editStyle}
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

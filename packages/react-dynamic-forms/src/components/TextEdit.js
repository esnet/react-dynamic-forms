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
import { validate } from "revalidator";
import Flexbox from "flexbox-react";

import formGroup from "../js/formGroup";
import { textView } from "../js/renderers";
import { editAction } from "../js/actions";
import { inlineStyle, inlineDoneButtonStyle, inlineCancelButtonStyle, colors } from "../js/style";

import "../css/textedit.css";

/**
 * Form control to edit a text field.
 */
class TextEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.value,
            isFocused: false,
            touched: false,
            selectText: false
        };
    }

    handleMouseEnter() {
        this.setState({ hover: true });
    }

    handleMouseLeave() {
        this.setState({ hover: false });
    }

    handleEditItem() {
        this.props.onEditItem(this.props.name);
    }

    isEmpty(value) {
        return _.isNull(value) || _.isUndefined(value) || value === "";
    }

    isMissing(v) {
        return this.props.required && !this.props.disabled && this.isEmpty(v);
    }

    getError(value) {
        const result = { validationError: false, validationErrorMessage: null };

        // If the user has a field blank then that is never an error. Likewise if the field
        // is disabled then that is never an error.
        if (this.isEmpty(value) || this.props.disabled) {
            return result;
        }

        // Validate the value with Revalidator, given the rules in this.props.rules
        let obj = {};
        obj[this.props.name] = value;

        let properties = {};
        properties[this.props.name] = this.props.validation;

        const rules = this.props.validation ? { properties } : null;
        if (obj && rules) {
            const validation = validate(obj, rules, { cast: true });
            const name = this.props.name || "Value";

            let msg;
            if (!validation.valid) {
                msg = `${name} ${validation.errors[0].message}`;
                result.validationError = true;
                result.validationErrorMessage = msg;
            }
        }
        return result;
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.selected && this.props.edit !== nextProps.edit && nextProps.edit === true) {
            this.setState({ selectText: true });
        }
        if (this.state.value !== nextProps.value && !this.state.isFocused) {
            console.log("state value set to", nextProps.value);
            this.setState({ value: nextProps.value });

            const missing = this.isMissing(nextProps.value);
            const { validationError: error } = this.getError(nextProps.value);

            // Broadcast error and missing states up to the parent
            if (this.props.onErrorCountChange) {
                this.props.onErrorCountChange(this.props.name, error ? 1 : 0);
            }
            if (this.props.onMissingCountChange) {
                this.props.onMissingCountChange(this.props.name, missing ? 1 : 0);
            }
        }
    }

    componentDidMount() {
        const missing = this.isMissing(this.props.value);
        const { validationError } = this.getError(this.props.value);

        // Initial error and missing states are fed up to the parent
        if (this.props.onErrorCountChange) {
            this.props.onErrorCountChange(this.props.name, validationError ? 1 : 0);
        }

        if (this.props.onMissingCountChange) {
            this.props.onMissingCountChange(this.props.name, missing ? 1 : 0);
        }
    }

    componentDidUpdate() {
        if (this.state.selectText) {
            this.textInput.focus();
            this.textInput.select();
            this.setState({ selectText: false });
        }
    }

    handleChange(e) {
        const name = this.props.name;
        const value = e.target.value;

        this.setState({ value }, () => {
            const missing = this.props.required && this.isEmpty(value);
            const { validationError } = this.getError(value);
            let cast = value;

            // Callbacks
            if (this.props.onErrorCountChange) {
                this.props.onErrorCountChange(name, validationError ? 1 : 0);
            }

            if (this.props.onMissingCountChange) {
                this.props.onMissingCountChange(name, missing ? 1 : 0);
            }

            if (this.props.onChange) {
                if (_.has(this.props.rules, "type")) {
                    switch (this.props.rules.type) {
                        case "integer":
                            cast = value === "" ? null : parseInt(value, 10);
                            break;
                        case "number":
                            cast = value === "" ? null : parseFloat(value, 10);
                            break;
                        //pass
                        default:
                    }
                }
                this.props.onChange(name, cast);
            }
        });
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

    handleDone() {
        if (this.props.onBlur) {
            this.props.onBlur(this.props.name);
        }
        this.setState({ isFocused: false, hover: false, oldValue: null });
    }

    handleCancel() {
        if (this.props.onChange) {
            const v = this.state.oldValue;
            let cast = v;
            if (_.has(this.props.rules, "type")) {
                switch (this.props.rules.type) {
                    case "integer":
                        cast = v === "" ? null : parseInt(v, 10);
                        break;
                    case "number":
                        cast = v === "" ? null : parseFloat(v, 10);
                        break;
                    //pass
                    default:
                }
            }
            this.props.onChange(this.props.name, cast);
        }
        this.props.onBlur(this.props.name);
        this.setState({ isFocused: false, hover: false, oldValue: null });
    }

    render() {
        // Control state
        const isMissing = this.isMissing(this.props.value);
        const { validationError, validationErrorMessage } = this.getError(this.props.value);

        if (this.props.edit) {
            // Error style/message
            let className = "";
            const msg = validationError && this.state.touched ? validationErrorMessage : "";
            let helpClassName = "help-block";
            if (validationError && this.state.touched) {
                helpClassName += " has-error";
                className = "has-error";
            }

            // Warning style
            const style = isMissing ? { background: colors.MISSING_COLOR_BG } : {};
            const type = this.props.type || "text";

            return (
                <Flexbox flexDirection="row" style={{ width: "100%" }}>
                    <div className={className} style={{ width: "100%" }}>
                        <input
                            ref={input => {
                                this.textInput = input;
                            }}
                            className="form-control input-sm"
                            style={style}
                            type={type}
                            disabled={this.props.disabled}
                            placeholder={this.props.placeholder}
                            value={this.state.value}
                            onChange={e => this.handleChange(e)}
                            onFocus={e => this.handleFocus(e)}
                            onKeyUp={e => this.handleKeyPress(e)}
                        />
                        <div className={helpClassName}>{msg}</div>
                    </div>
                    {this.props.selected ? (
                        <span style={{ marginTop: 3 }}>
                            <span
                                style={inlineDoneButtonStyle(5)}
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
                </Flexbox>
            );
        } else {
            const view = this.props.view || textView;
            const text = isMissing ? (
                <span />
            ) : (
                <span style={{ minHeight: 28 }}>{view(this.props.value)}</span>
            );
            const edit = editAction(this.state.hover && this.props.allowEdit, () =>
                this.handleEditItem()
            );
            const style = inlineStyle(validationError, isMissing);
            return (
                <div
                    style={style}
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

export default formGroup(TextEdit);

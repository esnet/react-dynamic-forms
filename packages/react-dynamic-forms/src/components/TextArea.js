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

import formGroup from "../js/formGroup";
import { textView } from "../js/renderers";
import { editAction } from "../js/actions";

import "../css/textarea.css";

/**
 * Form control to edit a Text Area field
 */
class TextArea extends React.Component {
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
        let result = { validationError: false, validationErrorMessage: null };

        // If the user has a field blank then that is never an error
        // Likewise if this item is disabled it can't be called an error
        if (this.isEmpty(value) || this.props.disabled) {
            return result;
        }

        // Validate the value with Revalidator, given the rules in this.props.rules
        let obj = {};
        obj[this.props.name] = value;

        let properties = {};
        properties[this.props.name] = this.props.rules;

        const rules = this.props.rules ? { properties } : null;
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
        if (this.props.edit !== nextProps.edit && nextProps.edit === true) {
            this.setState({ selectText: true });
        }
        if (this.state.value !== nextProps.value && !this.state.isFocused) {
            this.setState({ value: nextProps.value });

            const missing = this.isMissing(nextProps.value);
            const { validationError } = this.getError(nextProps.value);

            // Broadcast error and missing states up to the parent
            if (this.props.onErrorCountChange) {
                this.props.onErrorCountChange(this.props.name, validationError ? 1 : 0);
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
                this.props.onChange(name, value);
            }
        });
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

    inlineStyle(hasError, isMissing) {
        let color = "";
        let background = "";
        if (hasError) {
            color = "#b94a48";
            background = "#fff0f3";
        } else if (isMissing) {
            background = "floralwhite";
        }
        return {
            color,
            background,
            height: "100%",
            width: "100%",
            paddingLeft: 3
        };
    }

    render() {
        // Control state
        const isMissing = this.isMissing(this.props.value);
        const { validationError, validationErrorMessage } = this.getError(this.props.value);

        if (this.props.edit) {
            // Error style/message
            let className = "";
            const msg = validationError ? validationErrorMessage : "";
            let helpClassName = "help-block";
            if (validationError && this.state.touched) {
                helpClassName += " has-error";
                className = "has-error";
            }

            // Warning style
            const style = isMissing ? { background: "floralwhite" } : {};

            return (
                <div className={className}>
                    <textarea
                        ref={input => {
                            this.textInput = input;
                        }}
                        className="form-control"
                        style={style}
                        type="text"
                        disabled={this.props.disabled}
                        placeholder={this.props.placeholder}
                        value={this.state.value}
                        onChange={e => this.handleChange(e)}
                        onFocus={e => this.handleFocus(e)}
                        onBlur={() => this.handleBlur()}
                    />
                    <div className={helpClassName}>{msg}</div>
                </div>
            );
        } else {
            const view = this.props.view || textView;
            const text = isMissing ? <span /> : <span>{view(this.props.value)}</span>;
            const edit = editAction(this.state.hover && this.props.allowEdit, () =>
                this.handleEditItem()
            );

            const style = this.inlineStyle(validationError, isMissing);
            return (
                <div
                    style={style}
                    onMouseEnter={() => this.handleMouseEnter()}
                    onMouseLeave={() => this.handleMouseLeave()}
                >
                    <hr style={{ marginTop: 3, marginBottom: 1 }} />
                    {text}
                    {edit}
                    <hr style={{ marginTop: 1, marginBottom: 3 }} />
                </div>
            );
        }
    }
}

export default formGroup(TextArea);

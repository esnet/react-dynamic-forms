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
        if (this.props.edit !== nextProps.edit && nextProps.edit === true) {
            this.setState({ selectText: true });
        }
        if (this.state.value !== nextProps.value && !this.state.isFocused) {
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

        // Initial error and missing states are fed up to the owner
        if (this.props.onErrorCountChange) {
            this.props.onErrorCountChange(this.props.name, validationError ? 1 : 0);
        }

        if (this.props.onMissingCountChange) {
            this.props.onMissingCountChange(this.props.name, missing ? 1 : 0);
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
            height: 23,
            width: "100%",
            paddingLeft: 3
        };
    }

    componentDidUpdate() {
        if (this.state.selectText) {
            this.textInput.focus();
            this.textInput.select();
            this.setState({ selectText: false });
        }
    }

    render() {
        // Control state
        const isMissing = this.isMissing(this.props.value);
        const { validationError, validationErrorMessage } = this.getError(this.props.value);

        const iconStyle = {
            fontSize: 11
        };

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
            const style = isMissing ? { background: "floralwhite" } : {};

            const type = this.props.type || "text";

            return (
                <div className={className}>
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
                        onBlur={() => this.handleBlur()}
                    />
                    <div className={helpClassName}>{msg}</div>
                    <div>{this.state.isFocused}</div>
                </div>
            );
        } else {
            const view = this.props.view;
            let text = <span>{this.props.value}</span>;
            if (isMissing) {
                text = <span />;
            }

            let editAction = <span />;
            if (this.state.hover && this.props.allowEdit) {
                editAction = (
                    <span style={{ marginLeft: 5 }} onClick={() => this.handleEditItem()}>
                        <i
                            style={iconStyle}
                            className="glyphicon glyphicon-pencil icon edit-action active"
                        />
                    </span>
                );
            } else {
                editAction = <div />;
            }

            const style = this.inlineStyle(validationError, isMissing);
            if (!view) {
                return (
                    <div
                        style={style}
                        onMouseEnter={() => this.handleMouseEnter()}
                        onMouseLeave={() => this.handleMouseLeave()}
                    >
                        {text}
                        {editAction}
                    </div>
                );
            } else {
                return <div style={style}>{view(text)}</div>;
            }
        }
    }
}

export default formGroup(TextEdit);

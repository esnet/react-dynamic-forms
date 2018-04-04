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
import moment from "moment";
import PropTypes from "prop-types";
import DatePicker from "react-datepicker";

import formGroup from "../js/formGroup";

import "react-datepicker/dist/react-datepicker.css";
import "../css/dateedit.css";

/**
 * Form control to edit a date text field.
 *
 * Set the initial value with `initialValue` and set a callback for
 * value changed with `onChange`.
 */
class DateEdit extends React.Component {
    isEmpty(value) {
        return _.isNull(value) || _.isUndefined(value) || value === "";
    }

    isMissing(v) {
        return this.props.required && !this.props.disabled && this.isEmpty(v);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.value && nextProps.value) {
            if (this.props.value.getTime() !== nextProps.value.getTime()) {
                const missing = this.isMissing(nextProps.value);
                if (this.props.onMissingCountChange) {
                    this.props.onMissingCountChange(this.props.name, missing ? 1 : 0);
                }
            }
        }
    }

    componentDidMount() {
        const missing = this.isMissing(this.props.value);
        if (this.props.onMissingCountChange) {
            this.props.onMissingCountChange(this.props.name, missing ? 1 : 0);
        }
    }

    handleDateChange(v) {
        const value = v ? v.toDate() : null;
        const missing = this.isMissing(value);

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
            height: 23,
            width: "100%",
            paddingLeft: 3
        };
    }

    render() {
        // Control state
        const isMissing = this.isMissing(this.props.value);

        // Selected date
        const selected = this.props.value ? moment(this.props.value) : null;

        let className = "datepicker__input rdf";

        if (isMissing) {
            className += " is-missing";
        }

        if (this.props.edit) {
            return (
                <div>
                    <div>
                        <DatePicker
                            key={`date`}
                            ref={(input) => { this.textInput = input; }}
                            className={className}
                            disabled={this.props.disabled}
                            placeholderText={this.props.placeholder}
                            selected={selected}
                            onChange={v => this.handleDateChange(v)}
                        />
                    </div>
                </div>
            );
        } else {
            const hasError = false;
            let text = selected ? selected.format("MM/DD/YYYY") : "";
            if (isMissing) {
                text = " ";
            }
            const style = this.inlineStyle(hasError, isMissing);
            return <div style={style}>{text}</div>;
        }
    }
}

DateEdit.propTypes = {
    /**
     * width - Customize the horizontal size of the Chooser
     */
    width: PropTypes.number,

    /**
     * field - The identifier of the field being edited
     */
    field: PropTypes.string
};

DateEdit.defaultProps = {
    width: 100
};

export default formGroup(DateEdit);

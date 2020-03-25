/**
 *  Copyright (c) 2015 - present, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import _ from "lodash";
import React, { FunctionComponent } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { formGroup, FormGroupProps } from "../../hoc/group";
import { editAction } from "../../util/actions";
import { inlineStyle } from "../../util/style";
import { FieldValue } from "../Form";
import "./styles.css";

export interface DateEditProps {
    /**
     * Required on all Controls
     */
    field: string;

    /**
     * Customize the horizontal size of the Chooser
     */
    width: number;

    /**
     * Show the Chooser itself as disabled
     */
    isDisabled?: boolean;

    /**
     * Optional view component to render when the field
     * isn't being editted.
     */
    displayView?: string | ((value: FieldValue) => React.ReactElement<any>);
}

// Props passed into the Tags editor are the above Props combined with what is
// passed into the Group that wraps this.
type DateEditControlProps = DateEditProps & FormGroupProps;

interface DateEditControlState {
    value: FieldValue;
    oldValue: FieldValue;
    isFocused: boolean;
    touched: boolean;
    selectText: boolean;
    hover: boolean;
}

/**
 * This is the control code implemented here which wraps the react-select (multi select creatable) code to provide
 * appropiate interaction with the Form itself
 */
class DateEditControl extends React.Component<DateEditControlProps, DateEditControlState> {
    dateEditor: any;

    static defaultProps = {
        disabled: false,
        width: 300
    };

    state = {
        value: null,
        oldValue: null,
        isFocused: false,
        touched: false,
        selectText: false,
        hover: false
    };

    constructor(props: DateEditControlProps) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        const { isRequired, isDisabled, value, onMissingCountChange } = this.props;
        const missing =
            isRequired && !isDisabled && (_.isNull(value) || _.isUndefined(value) || value === "");
        const missingCount = missing ? 1 : 0;

        if (onMissingCountChange) {
            onMissingCountChange(name, missingCount);
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps: DateEditControlProps) {
        const { onMissingCountChange } = this.props;
        if (this.props.value !== nextProps.value) {
            const missingCount = this.isMissing(nextProps.value) ? 1 : 0;
            onMissingCountChange?.(name, missingCount);
        }
    }

    handleMouseEnter() {
        this.setState({ hover: true });
    }

    handleMouseLeave() {
        this.setState({ hover: false });
    }

    handleEditItem() {
        if (this.props.onEditItem) {
            this.props.onEditItem(this.props.name);
        }
    }

    handleChange(d?: Date | null) {
        console.log("d:", d);
        const { isRequired, onChange, onMissingCountChange, name } = this.props;
        const isMissing = this.isMissing(d) && isRequired;

        // Callbacks
        onChange?.(name, d);
        onMissingCountChange?.(name, isMissing ? 1 : 0);
    }

    private isEmpty(value: FieldValue): boolean {
        const v = value as string[];
        return _.isNull(value) || _.isUndefined(value) || v.length === 0;
    }

    private isMissing(value = this.props.value): boolean {
        const { isRequired = false, isDisabled = false } = this.props;
        return isRequired && !isDisabled && this.isEmpty(value);
    }

    render() {
        const { value, displayView, placeholder, isDisabled = false } = this.props;

        const isMissing = this.isMissing(this.props.value);
        const selected = value as Date;

        let className = "form-control form-control-sm";
        if (isMissing) {
            className += " missing-input";
        }

        if (this.props.isBeingEdited) {
            return (
                <div>
                    <DatePicker
                        key={`date`}
                        ref={input => {
                            this.dateEditor = input;
                        }}
                        selected={selected}
                        className={className}
                        disabled={isDisabled}
                        placeholderText={placeholder}
                        onChange={v => this.handleChange(v)}
                        // onFocus={e => this.handleFocus(e)}
                        // onKeyUp={e => this.handleKeyPress(e)}
                    />
                </div>
            );
        } else {
            let view: React.ReactElement;
            const displayStyle = { fontSize: 14 };
            if (_.isFunction(displayView)) {
                const callableDisplayView = displayView as (
                    value: FieldValue
                ) => React.ReactElement;
                view = (
                    <span style={{ minHeight: 28 }}>{callableDisplayView(this.props.value)}</span>
                );
            } else if (_.isString(displayView)) {
                const text = displayView as string;
                view = <span style={displayStyle}>{text}</span>;
            } else if (this.props.value) {
                const m = this.props.value as Date;
                const dateString =
                    ("0" + (m.getUTCMonth() + 1)).slice(-2) +
                    "/" +
                    ("0" + m.getUTCDate()).slice(-2) +
                    "/" +
                    m.getUTCFullYear();
                view = <span style={displayStyle}>{dateString}</span>;
            } else {
                view = <div />;
            }

            const edit = editAction(this.state.hover && this.props.allowEdit, () =>
                this.handleEditItem()
            );

            const style = inlineStyle(false, isMissing ? isMissing : false);

            return (
                <div
                    style={style}
                    key={`key-${isMissing}`}
                    onMouseEnter={() => this.handleMouseEnter()}
                    onMouseLeave={() => this.handleMouseLeave()}
                >
                    {view}
                    {edit}
                </div>
            );
        }
    }
}

/**
 * A `DateEditGroup` is a `TagsControl` wrapped by the `formGroup()` HOC. This is the
 * component which can be rendered by the Form when the user adds a `DateEdit` to their `Form`.
 */
export const DateEditGroup = formGroup<DateEditProps>(DateEditControl);

/**
 * Form control to select a date from a picker.
 */
export const DateEdit: FunctionComponent<DateEditProps> = () => <></>;

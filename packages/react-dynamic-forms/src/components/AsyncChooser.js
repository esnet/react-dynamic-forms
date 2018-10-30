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
import PropTypes from "prop-types";
import Flexbox from "flexbox-react";
import Immutable from "immutable";

import formGroup from "../js/formGroup";
import { textView } from "../js/renderers";
import { editAction } from "../js/actions";
import { inlineChooserStyle, inlineDoneButtonStyle, inlineCancelButtonStyle } from "../js/style";

import "react-select/dist/react-select.css";
import "react-virtualized/styles.css";
import "react-virtualized-select/styles.css";

import Select from "react-virtualized-select";

import "../css/chooser.css";

/**
 * React Form control to select an item from a list. The list is built from
 * an async call. Once the call has been made and the options list if built
 * the list is immutable. Also note that if a value is provided (current or
 * default) that value will only actually show once the list is received.
 */
export class AsyncChooser extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isFocused: false, focusChooser: false };
        this.handleChange = this.handleChange.bind(this);
        this.loadOptions = this.loadOptions.bind(this);

        this.loadedOptions = Immutable.List();
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
        return _.isNull(value) || _.isUndefined(value) || value === "";
    }

    isMissing(value = this.props.value) {
        return this.props.required && !this.props.disabled && this.isEmpty(value);
    }

    componentDidMount() {
        const missing =
            this.props.required &&
            !this.props.disabled &&
            (_.isNull(this.props.value) ||
                _.isUndefined(this.props.value) ||
                this.props.value === "");
        const missingCount = missing ? 1 : 0;

        if (this.props.onMissingCountChange) {
            this.props.onMissingCountChange(this.props.name, missingCount);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.selected && this.props.edit !== nextProps.edit && nextProps.edit === true) {
            this.setState({ focusChooser: true });
        }
        if (
            this.props.value !== nextProps.value ||
            (!this.props.value && nextProps.value) ||
            (this.props.value && !nextProps.value)
        ) {
            // The value might have been missing and is now set explicitly
            // with a prop
            const missing =
                this.props.required &&
                !this.props.disabled &&
                (_.isNull(nextProps.value) ||
                    _.isUndefined(nextProps.value) ||
                    nextProps.value === "");
            const missingCount = missing ? 1 : 0;

            if (this.props.onMissingCountChange) {
                this.props.onMissingCountChange(this.props.name, missingCount);
            }
        }
    }

    componentDidUpdate() {
        if (this.state.focusChooser) {
            this.chooser.focus();
            this.setState({ focusChooser: false });
        }
    }

    handleChange(item) {
        let { value, label } = item || {};

        const isMissing = this.props.required && _.isNull(item);
        const id = !isMissing && !_.isNaN(Number(value)) ? +value : value;

        // Callbacks
        if (this.props.onChange) {
            this.props.onChange(this.props.name, Immutable.Map({ id, label }));
        }
        if (this.props.onMissingCountChange) {
            this.props.onMissingCountChange(this.props.name, isMissing ? 1 : 0);
        }
    }

    handleEditItem() {
        this.props.onEditItem(this.props.name);
    }

    getOptionList(options) {
        return options
            .map(item => {
                let disabled = false;
                const isDisabled = item.has("disabled") && item.get("disabled") === true;
                if (_.contains(this.props.disableList, item.get("id")) || isDisabled) {
                    disabled = true;
                }
                return { value: item.get("id"), label: item.get("label"), disabled };
            })
            .toJS();
    }

    loadOptions(input, cb) {
        if (this.cachedOptions) {
            cb(null, {
                options: this.getOptionList(this.cachedOptions),
                complete: true
            });
            return;
        }

        this.props.loader(input, (err, options) => {
            cb(err, {
                options: this.getOptionList(options),
                complete: true
            });
            this.cachedOptions = options;
        });
    }

    render() {
        const choice = this.props.value ? this.props.value.get("id") : null;
        const isMissing = this.isMissing(this.props.value);

        if (this.props.edit) {
            const chooserStyle = { marginBottom: 10, width: "100%" };
            const clearable = this.props.allowSingleDeselect;
            const matchPos = this.props.searchContains ? "any" : "start";

            return (
                <Flexbox flexDirection="row" style={{ width: "100%" }}>
                    <div style={chooserStyle} onFocus={e => this.handleFocus(e)}>
                        <Select
                            async
                            ref={chooser => {
                                this.chooser = chooser;
                            }}
                            className={isMissing ? "is-missing" : ""}
                            value={choice}
                            loadOptions={this.loadOptions}
                            openOnFocus={true}
                            disabled={this.props.disabled}
                            searchable={true}
                            matchPos={matchPos}
                            placeholder={this.props.placeholder}
                            clearable={clearable}
                            onChange={v => this.handleChange(v)}
                        />
                    </div>
                    {this.props.selected ? (
                        <span style={{ marginTop: 5 }}>
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
            const label = this.props.value.get("label");
            const View = this.props.view || textView;
            const style = inlineChooserStyle(false, false, !!View);
            const text = <span style={{ minHeight: 28 }}>{View(label)}</span>;
            const edit = editAction(this.state.hover && this.props.allowEdit, () =>
                this.handleEditItem()
            );

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

AsyncChooser.propTypes = {
    /**
     * The identifier of the field being edited. References back into
     * the Form's Schema for additional properties of this field
     */
    field: PropTypes.string.isRequired,

    /**
     * Pass in the available list of options as a Immutable.List of objects. Each
     * object contains a "id" and the user visible "label". For example:
     *
     * Immutable.fromJS([
     *     { id: 1, label: "Dog" },
     *     { id: 2, label: "Duck" },
     *     { id: 3, label: "Cat" }
     * ]);
     *
     */
    choiceList: PropTypes.object.isRequired,

    /**
     * If the chooser should be shown as disabled
     */
    disabled: PropTypes.bool,

    /**
     * Customize the horizontal size of the Chooser
     */
    width: PropTypes.number,

    /**
     * Add a [x] icon to the chooser allowing the user to clear the selected value
     */
    allowSingleDeselect: PropTypes.bool,

    /**
     * Can be "any" or "start", indicating how the search is matched within the items (anywhere, or starting with)
     */
    searchContains: PropTypes.oneOf(["any", "start"])
};

AsyncChooser.defaultProps = {
    disabled: false,
    disableSearch: false,
    searchContains: "any",
    allowSingleDeselect: false,
    width: 300
};

export const AsyncChooserGroup = formGroup(AsyncChooser, "AsyncChooser");

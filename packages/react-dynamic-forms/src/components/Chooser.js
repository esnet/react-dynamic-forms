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

import formGroup from "../js/formGroup";
import { textView } from "../js/renderers";
import { editAction } from "../js/actions";
import { inlineChooserStyle, inlineDoneButtonStyle, inlineCancelButtonStyle } from "../js/style";

import "react-select/dist/react-select.css";
import "react-virtualized/styles.css";
import "react-virtualized-select/styles.css";

import VirtualizedSelect from "react-virtualized-select";

import "../css/chooser.css";

/**
 * React Form control to select an item from a list.
 */
export class Chooser extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isFocused: false, focusChooser: false };
        this.handleChange = this.handleChange.bind(this);
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
        if (this.props.edit !== nextProps.edit && nextProps.edit === true) {
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

    handleChange(v) {
        let { value } = v || {};
        const missing = this.props.required && this.isEmpty(v);

        // If the chosen id is a number, cast it to a number
        if (!this.isEmpty(v) && !_.isNaN(Number(v))) {
            value = +v;
        }

        // Callbacks
        if (this.props.onChange) {
            this.props.onChange(this.props.name, value);
        }
        if (this.props.onMissingCountChange) {
            this.props.onMissingCountChange(this.props.name, missing ? 1 : 0);
        }
    }

    handleEditItem() {
        this.props.onEditItem(this.props.name);
    }

    getOptionList() {
        return this.props.choiceList
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

    getFilteredOptionList(input) {
        const items = this.props.choiceList;
        const filteredItems = input
            ? items.filter(item => {
                  return item.label.toLowerCase().indexOf(`${input}`.toLowerCase()) !== -1;
              })
            : items;
        const result = [];
        filteredItems.forEach(item =>
            result.push({
                value: `${item.get("id")}`,
                label: item.get("label"),
                disabled: item.has("disabled") ? item["disabled"] : false
            })
        );
        return result;
    }

    getOptions(input, cb) {
        const options = this.getFilteredOptionList(input);
        if (options) {
            cb(null, { options, complete: true });
        }
    }

    getCurrentChoice() {
        const choiceItem = this.props.choiceList.find(item => {
            return item.get("id") === this.props.value;
        });
        return choiceItem ? choiceItem.get("id") : undefined;
    }

    getCurrentChoiceLabel() {
        const choiceItem = this.props.choiceList.find(item => {
            return item.get("id") === this.props.value;
        });
        return choiceItem ? choiceItem.get("label") : "";
    }

    render() {
        const choice = this.getCurrentChoice();
        const isMissing = this.isMissing(this.props.value);

        if (this.props.edit) {
            let className = "";
            const chooserStyle = { marginBottom: 10, width: "100%" };
            const clearable = this.props.allowSingleDeselect;
            const searchable = !this.props.disableSearch;

            const matchPos = this.props.searchContains ? "any" : "start";

            let ctl;
            if (searchable) {
                const options = this.getFilteredOptionList(null);
                const labelList = _.map(options, item => item.label);
                const key = `${labelList}--${choice}`;
                ctl = (
                    <VirtualizedSelect
                        ref={chooser => {
                            this.chooser = chooser;
                        }}
                        className={isMissing ? "is-missing" : ""}
                        key={key}
                        value={choice}
                        options={options}
                        openOnFocus={true}
                        disabled={this.props.disabled}
                        searchable={true}
                        matchPos={matchPos}
                        placeholder={this.props.placeholder}
                        onChange={v => this.handleChange(v)}
                    />
                );
            } else {
                const options = this.getOptionList();
                const labelList = _.map(options, item => item.label);
                const key = `${labelList}--${choice}`;
                ctl = (
                    <VirtualizedSelect
                        ref={chooser => {
                            this.chooser = chooser;
                        }}
                        className={isMissing ? "is-missing" : ""}
                        key={key}
                        value={choice}
                        options={options}
                        openOnFocus={true}
                        disabled={this.props.disabled}
                        searchable={false}
                        matchPos={matchPos}
                        placeholder={this.props.placeholder}
                        clearable={clearable}
                        onChange={v => this.handleChange(v)}
                    />
                );
            }
            return (
                <Flexbox flexDirection="row" style={{ width: "100%" }}>
                    <div
                        className={className}
                        style={chooserStyle}
                        onFocus={e => this.handleFocus(e)}
                    >
                        {ctl}
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
            let s = this.getCurrentChoiceLabel();
            const view = this.props.view || textView;
            const style = inlineChooserStyle(false, false, !!view);

            const text = <span style={{ minHeight: 28 }}>{view(s, choice)}</span>;
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

Chooser.propTypes = {
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
     * If true the chooser becomes a simple pulldown menu
     * rather than allowing the user to type into it to search
     * though the entries
     */
    disableSearch: PropTypes.bool,

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

Chooser.defaultProps = {
    disabled: false,
    disableSearch: false,
    searchContains: "any",
    allowSingleDeselect: false,
    width: 300
};

export const ChooserGroup = formGroup(Chooser, "Chooser");

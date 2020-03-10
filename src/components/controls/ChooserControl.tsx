/**
 *  Copyright (c) 2015 - present, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import Immutable from "immutable";
import _ from "lodash";
import React, { FunctionComponent } from "react";
import { createFilter } from "react-select";
import WindowedSelect from "react-windowed-select";
import { formGroup, FormGroupProps } from "../../hoc/group";
import { FieldValue } from "../Form";

interface Option {
    value?: string;
    label?: string;
    disabled?: boolean;
}

export type Options = Option[];

export interface ChooserProps {
    /**
     * Required on all Controls
     */
    field: string;

    /**
     * Customize the horizontal size of the Chooser
     */
    width: number;

    /**
     * Pass in the available list of options as a list of objects. For example:
     * ```
     * [
     *  {id: 1: label: "cat"},
     *  {id: 2: label: "dog"},
     *  ...
     * ]
     * ```
     */
    choiceList: Immutable.List<Immutable.Map<"id" | "label" | "disabled", string>>;

    /**
     * List of items in the Chooser list which should be presented disabled
     */
    disableList?: string[];

    /**
     * Show the Chooser itself as disabled
     */
    disabled?: boolean;

    /**
     * If `disableSearch` is true the chooser becomes a simple pulldown menu
     * rather than allowing the user to type into it to filter this list.
     * This is good for short little pull downs where the extra UI is annoying.
     */
    disableSearch?: boolean;

    /**
     * Add a [x] icon to the chooser allowing the user to clear the selected value
     */
    allowSingleDeselect?: boolean;

    /**
     * Can be "any" or "start", indicating how the search is matched within
     * the items (substring anywhere, or starting with)
     */
    searchContains?: "any" | "start";
}

// Props passed into the Chooser are the above Props combined with what is
// passed into the Group that wraps this.
type ChooserControlProps = ChooserProps & FormGroupProps;

interface ChooserControlState {
    value: FieldValue;
    oldValue: FieldValue;
    isFocused: boolean;
    touched: boolean;
    selectText: boolean;
    hover: boolean;
}

/**
 * This is the control code implemented here which wraps the react-select code to provide
 * appropiate interaction with the Form itself
 */
class ChooserControl extends React.Component<ChooserControlProps, ChooserControlState> {
    static defaultProps = {
        disabled: false,
        disableSearch: false,
        searchContains: "any",
        allowSingleDeselect: false,
        width: 300
    };

    constructor(props: ChooserControlProps) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        const { required, disabled, value, onMissingCountChange } = this.props;
        const missing =
            required && !disabled && (_.isNull(value) || _.isUndefined(value) || value === "");
        const missingCount = missing ? 1 : 0;

        if (onMissingCountChange) {
            onMissingCountChange(name, missingCount);
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps: ChooserControlProps) {
        const { required, disabled, value, onMissingCountChange } = this.props;
        const { value: newValue } = nextProps;
        if (value !== newValue || (!value && newValue) || (value && !newValue)) {
            const missing =
                required &&
                disabled &&
                (_.isNull(newValue) || _.isUndefined(newValue) || newValue === "");
            const missingCount = missing ? 1 : 0;
            onMissingCountChange?.(name, missingCount);
        }
    }

    handleChange(selected?: Option) {
        const { onChange, onMissingCountChange, onBlur, name } = this.props;

        const value = selected?.value;
        const missing = this.props.required && this.isEmpty(value);

        console.log("Chooser: handleChange:", value, missing);

        // Callbacks
        onChange?.(name, !_.isUndefined(value) ? +value : null);
        onMissingCountChange?.(name, missing ? 1 : 0);
        onBlur?.(name);
    }

    private isEmpty(value: FieldValue): boolean {
        return _.isNull(value) || _.isUndefined(value) || value === "";
    }

    private isMissing(value = this.props.value): boolean {
        const { required = false, disabled = false } = this.props;
        return required && !disabled && this.isEmpty(value);
    }

    private getOptionList(): Options {
        const { choiceList, disableList } = this.props;

        return choiceList
            .map(item => {
                let disabled = false;
                const isDisabled = item.has("disabled") && item.get("disabled") === "true";
                if (_.includes(disableList, item.get("id")) || isDisabled) {
                    disabled = true;
                }
                return { value: item.get("id"), label: item.get("label"), disabled };
            })
            .toJS();
    }

    // private getFilteredOptionList(input: string | null): Option[] {
    //     const { choiceList } = this.props;

    //     const items = choiceList;
    //     const filteredItems = input
    //         ? items.filter(item => {
    //               const label = item["label"].toLowerCase();
    //               const subString = `${input}`.toLowerCase();
    //               return label.indexOf(subString) !== -1;
    //           })
    //         : items;

    //     const result: Option[] = [];
    //     filteredItems.forEach(item =>
    //         result.push({
    //             value: `${item.get("id")}`,
    //             label: item.get("label"),
    //             disabled: item.has("disabled") ? item["disabled"] : false
    //         })
    //     );
    //     return result;
    // }

    private getCurrentChoice(): Option | null {
        console.log(this.props.choiceList);
        const choiceItem = this.props.choiceList.find(item => {
            return item.get("id") === this.props.value;
        });
        if (choiceItem) {
            return {
                value: choiceItem.get("id"),
                label: choiceItem.get("label")
            };
        }
        return null;
    }

    // private getCurrentChoiceLabel() {
    //     const choiceItem = this.props.choiceList.find(item => {
    //         return item.get("id") === this.props.value;
    //     });
    //     return choiceItem ? choiceItem.get("label") : "";
    // }

    render() {
        const {
            disabled,
            placeholder,
            allowSingleDeselect,
            disableSearch,
            searchContains
        } = this.props;

        const choice = this.getCurrentChoice();
        const isMissing = this.isMissing(this.props.value);

        if (this.props.edit) {
            let className = "";
            const chooserStyle = { marginBottom: 0 };
            const clearable = allowSingleDeselect;
            const searchable = !disableSearch;

            const filterConfig = {
                matchFrom: searchContains ? "any" : ("start" as "any" | "start")
            };

            const customStyles = {
                control: (base: object) => ({
                    ...base,
                    height: 31,
                    minHeight: 31
                }),
                indicatorsContainer: (base: object) => ({
                    ...base,
                    height: 31
                }),
                singleValue: (base: object) => ({
                    ...base,
                    top: "42%"
                }),
                placeholder: (base: object) => ({
                    ...base,
                    top: "42%",
                    fontSize: 14
                })
            };

            const options = this.getOptionList();
            if (searchable) {
                const labelList = _.map(options, item => item.label);
                const key = `${labelList}--${choice}`;
                return (
                    <div className={className} style={chooserStyle}>
                        <WindowedSelect
                            className={isMissing ? "is-missing" : ""}
                            key={key}
                            value={choice}
                            options={options}
                            filterOption={createFilter(filterConfig)}
                            styles={customStyles}
                            isDisabled={disabled}
                            isSearchable={true}
                            placeholder={placeholder}
                            onChange={this.handleChange}
                        />
                    </div>
                );
            } else {
                const labelList = _.map(options, item => item.label);
                const key = `${labelList}--${choice}`;
                return (
                    <div className={className} style={chooserStyle}>
                        <WindowedSelect
                            className={isMissing ? "is-missing" : ""}
                            key={key}
                            value={choice}
                            options={options}
                            styles={customStyles}
                            isDisabled={disabled}
                            isSearchable={false}
                            placeholder={placeholder}
                            clearable={clearable}
                            onChange={this.handleChange}
                        />
                    </div>
                );
            }
            // } else {
            //     const view = this.props.view;
            //     let text = this.getCurrentChoiceLabel();
            //     let color = "";
            //     let background = "";
            //     if (isMissing) {
            //         text = " ";
            //         background = "floralwhite";
            //     }

            //     const viewStyle = {
            //         color,
            //         background,
            //         // minHeight: 23,
            //         height: "100%",
            //         width: "100%",
            //         paddingLeft: 3
            //     };

            //     const style = {
            //         color,
            //         background,
            //         // height: 23,
            //         height: "100%",
            //         width: "100%",
            //         paddingLeft: 3
            //     };

            //     if (!view) {
            //         return <div style={style}>{text}</div>;
            //     } else {
            //         return <div style={viewStyle}>{view(text, choice)}</div>;
            //     }
            // }
        } else {
            return <div>view</div>;
        }
    }
}

/**
 * A `ChooserGroup` is a `ChooserControl` wrapped by the `formGroup()` HOC. This is the
 * component which can be rendered by the Form when the user adds a `Chooser` to their `Form`.
 */
export const ChooserGroup = formGroup<ChooserProps>(ChooserControl);

/**
 * A control which allows the user to select from a list defined in `chooserList`. See
 * `ChooserProps` for a list of available props.
 */
export const Chooser: FunctionComponent<ChooserProps> = () => <></>;

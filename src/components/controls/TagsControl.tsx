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
import CreatableSelect from "react-select/creatable";
import { formGroup, FormGroupProps } from "../../hoc/group";
import { editAction } from "../../util/actions";
import { inlineStyle } from "../../util/style";
import { FieldValue } from "../Form";

interface Option {
    value?: string;
    label?: string;
    disabled?: boolean;
}

export type Options = Option[];

export interface TagsProps {
    /**
     * If the available tag options changes because the use added a tag, then
     * this callback will be called with the complete list of possible tags
     * (essentially this will be this.props.tagList + the new tag)
     */
    onTagListChange?: (name: string | undefined, tagList: string[]) => void;

    /**
     * Required on all Controls
     */
    field: string;

    /**
     * Customize the horizontal size of the Chooser
     */
    width: number;

    /**
     * Pass in the available list of options as a list of strings. For example:
     * ```
     * [
     *  "cat",
     *  "dog",
     *  ...
     * ]
     * ```
     */
    tagList: string[];

    /**
     * List of items in the Chooser list which should be presented disabled
     */
    disableList?: string[];

    /**
     * Show the Chooser itself as disabled
     */
    isDisabled?: boolean;

    /**
     * If `isSearchable` is true the Chooser becomes a simple pulldown menu
     * rather than allowing the user to type into it to filter this list.
     */
    isSearchable?: boolean;

    /**
     * Add a [x] icon to the chooser allowing the user to clear the selected value
     */
    isClearable?: boolean;

    /**
     * Can be "any" or "start", indicating how the search is matched within
     * the items (substring anywhere, or starting with)
     */
    searchContains?: "any" | "start";

    /**
     * Optional view component to render when the field
     * isn't being editted.
     */
    displayView?: string | ((value: FieldValue) => React.ReactElement<any>);
}

// Props passed into the Tags editor are the above Props combined with what is
// passed into the Group that wraps this.
type TagsControlProps = TagsProps & FormGroupProps;

interface TagsControlState {
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
class TagsControl extends React.Component<TagsControlProps, TagsControlState> {
    static defaultProps = {
        disabled: false,
        disableSearch: false,
        searchContains: "any",
        allowSingleDeselect: false,
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

    constructor(props: TagsControlProps) {
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

    UNSAFE_componentWillReceiveProps(nextProps: TagsControlProps) {
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

    handleChange(selected?: Option[]) {
        const {
            isRequired,
            onChange,
            onMissingCountChange,
            onTagListChange,
            onBlur,
            name
        } = this.props;

        const value = selected ? selected.map(item => item.label) : [];
        const isMissing = isRequired && value.length === 0;

        const newTags = selected
            ?.filter(item => item["__isNew__"])
            .map(item => item.value as string);

        // Callbacks
        onChange?.(name, value);
        if (newTags !== undefined && newTags.length > 0) {
            const existingTags = this.props.tagList ? this.props.tagList : [];
            onTagListChange?.(name, [...existingTags, ...newTags]);
        }
        onMissingCountChange?.(name, isMissing ? 1 : 0);
        onBlur?.(name);
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
        const { placeholder, isDisabled = false } = this.props;

        const isMissing = this.isMissing(this.props.value);
        const options = this.props.tagList.map(tag => ({ value: tag, label: tag }));
        const tags = (this.props.value as string[]).map(tag => ({ value: tag, label: tag }));
        const chooserStyle = { marginBottom: 0 };
        const customStyles = {
            control: (base: object) => ({
                ...base,
                background: isMissing ? "floralwhite" : "white"
            })
        };

        if (this.props.isBeingEdited) {
            return (
                <div style={chooserStyle}>
                    <CreatableSelect
                        value={tags}
                        isMulti
                        isDisabled={isDisabled}
                        options={options}
                        placeholder={placeholder}
                        styles={customStyles}
                        onChange={this.handleChange}
                    />
                </div>
            );
        } else {
            let view: React.ReactElement;
            const tagStyle = {
                cursor: "default",
                fontSize: 12,
                paddingTop: 2,
                paddingBottom: 2,
                paddingLeft: 5,
                paddingRight: 5,
                background: "#ececec",
                borderRadius: 4,
                borderStyle: "solid",
                borderWidth: 1,
                borderColor: "#eaeaea",
                marginLeft: 2,
                marginRight: 2
            };

            const { displayView } = this.props;
            if (_.isFunction(displayView)) {
                const callableDisplayView = displayView as (
                    value: FieldValue
                ) => React.ReactElement;
                view = (
                    <span style={{ minHeight: 28 }}>{callableDisplayView(this.props.value)}</span>
                );
            } else if (_.isString(displayView)) {
                const text = displayView as string;
                view = <span>{text}</span>;
            } else if (this.props.value) {
                view = (
                    <span>
                        {(this.props.value as string[]).map((tag, i) => (
                            <span key={i} style={tagStyle}>
                                {tag}
                            </span>
                        ))}
                    </span>
                );
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
 * A `TagsGroup` is a `TagsControl` wrapped by the `formGroup()` HOC. This is the
 * component which can be rendered by the Form when the user adds a `Tags` to their `Form`.
 */
export const TagsGroup = formGroup<TagsProps>(TagsControl);

/**
 * Form control to select tags from a pull down list. You can also add a new tag with the Add tag button.
 */
export const Tags: FunctionComponent<TagsProps> = () => <></>;

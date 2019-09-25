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
import Creatable from "react-select/creatable";
import Immutable from "immutable";
import Flexbox from "flexbox-react";

import formGroup from "../js/formGroup";
import { editAction } from "../js/actions";
import { inlineDoneButtonStyle, inlineCancelButtonStyle } from "../js/style";

//import "react-select/dist/react-select.css";
import "../css/tagsedit.css";

/**
 * Form control to select tags from a pull down list.
 * You can also add a new tag with the Add tag button.
 */
class TagsEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            touched: false
        };
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.value !== nextProps.value) {
            const missingCount = this.isMissing(nextProps.value) ? 1 : 0;
            if (this.props.onMissingCountChange) {
                this.props.onMissingCountChange(this.props.name, missingCount);
            }
        }
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

    handleChange(tags) {
        //converting object to array
        const arr = [];
        arr.push(tags.label);

        const value = arr;
        //const value = _.map(tags, tag => tag.label);

        let updatedTagList;
        _.each(tags, tag => {
            if (tag.className === "Select-create-option-placeholder") {
                updatedTagList = this.props.tagList.push(tag.label);
            }
        });

        if (updatedTagList && this.props.onTagListChange) {
            this.props.onTagListChange(this.props.name, updatedTagList);
        }

        if (this.props.onChange) {
            this.props.onChange(this.props.name, Immutable.fromJS(value));
        }
    }

    isEmpty(value) {
        if (Immutable.List.isList(value)) {
            return value.size === 0;
        }
        return _.isNull(value) || _.isUndefined(value);
    }

    isMissing(value = this.props.value) {
        return this.props.required && !this.props.disabled && this.isEmpty(value);
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
            this.props.onChange(this.props.name, v);
        }
        this.props.onBlur(this.props.name);
        this.setState({ isFocused: false, hover: false, oldValue: null });
    }

    render() {
        const isMissing = this.isMissing(this.props.value);
        if (this.props.edit) {
            const options = [];
            const value = [];

            this.props.tagList.forEach((tag, i) => {
                if (this.props.value.contains(tag)) {
                    value.push({ value: i, label: tag });
                } else {
                    options.push({ value: i, label: tag });
                }
            });

            let className;
            if (isMissing) {
                className = "missing";
            }

            return (
                <div style={{ marginBottom: 8 }}>
                    <Flexbox flexDirection="row" style={{ width: "100%" }}>
                        <Creatable
                            className={className}
                            multi={true}
                            disabled={this.props.disabled}
                            placeholder="Select tags..."
                            allowCreate={true}
                            value={value}
                            options={options}
                            onChange={value => this.handleChange(value)}
                            onFocus={e => this.handleFocus(e)}
                            onKeyUp={e => this.handleKeyPress(e)}
                        />
                        <div className="help-block" />
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
                </div>
            );
        } else {
            const tagStyle = {
                cursor: "default",
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
            const edit = editAction(this.state.hover && this.props.allowEdit, () =>
                this.handleEditItem()
            );
            return (
                <div
                    onMouseEnter={() => this.handleMouseEnter()}
                    onMouseLeave={() => this.handleMouseLeave()}
                >
                    {this.props.value.map((tag, i) => (
                        <span key={i} style={tagStyle}>
                            {tag}
                        </span>
                    ))}
                    {edit}
                </div>
            );
        }
    }
}

export default formGroup(TagsEdit);

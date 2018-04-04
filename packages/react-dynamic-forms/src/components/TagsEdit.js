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
import { Creatable } from "react-select";
import Immutable from "immutable";

import formGroup from "../js/formGroup";

import "react-select/dist/react-select.css";
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

    handleChange(tags) {
        const value = _.map(tags, tag => tag.label);

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
                <div>
                    <Creatable
                        key="bob"
                        className={className}
                        multi={true}
                        disabled={this.props.disabled}
                        placeholder="Select tags..."
                        allowCreate={true}
                        value={value}
                        options={options}
                        onChange={value => this.handleChange(value)}
                    />
                    <div className="help-block" />
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
                borderRadius: 2,
                marginLeft: 2,
                marginRight: 2
            };
            return (
                <div>
                    {this.props.value.map((tag, i) => <span key={i} style={tagStyle}>{tag}</span>)}
                </div>
            );
        }
    }
}

export default formGroup(TagsEdit);

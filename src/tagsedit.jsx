/**
 *  Copyright (c) 2015, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import React from "react";
import _ from "underscore";
import Select from "react-select";

import "./select.css";

/**
 * Form control to select tags from a pull down list.
 * You can also add a new tag with the Add tag button.
 */
export default React.createClass({

    displayName: "TagsEdit",

    getInitialState() {
        return {
            tags: this.props.initialTags || [],
            tagList: this.props.initialTagList || [],
            showNewTagUI: false
        };
    },

    componentWillReceiveProps(nextProps) {
        this.setState({
            tags: nextProps.initialTags || [],
            tagList: nextProps.initialTagList || []
        });
    },

    handleChange(val, tagList) {
        const tags = _.unique(_.map(tagList, tag => tag.label));

        let newAvailableTags = this.state.tagList;
        _.each(tags, (tag) => {
            if (_.indexOf(newAvailableTags, tag) === -1) {
                newAvailableTags.push(tag);
            }
        });

        this.setState({
            tags,
            tagList: newAvailableTags
        });
        if (this.props.onChange) {
            this.props.onChange(this.props.attr, tags);
        }
    },

    render() {
        let className = "";

        const width = this.props.width ? this.props.width + "px" : "100%";
        if (this.props.showRequired && this._isMissing()) {
            className = "has-error";
        }

        const options = _.map(this.state.tagList, (tag, index) => {
            let disabled = false;
            if (_.has(this.state.tags, tag)) {
                disabled = true;
            }
            return {value: index, label: tag, disabled};
        });

        if (_.isUndefined(this.state.tags) ||
            _.isUndefined(this.state.tagList)) {
            let err = `Tags was supplied with bad state: attr is ${this.props.attr}`;
            err += ` (tags are: ${this.state.tags} and tagList is: ${this.state.tagList})`;
            throw new Error(err);
        }

        const key =
            `${this.state.tags.join("-")}--${this.state.tagList.join("-")}`;
        return (
            <div className={className} style={{width}}>
                <Select
                    key={key}
                    multi={true}
                    disabled={this.props.disabled}
                    placeholder="Select tags..."
                    value={this.state.tags}
                    allowCreate={true}
                    options={options}
                    onChange={this.handleChange}
                />
                <div className="help-block"></div>
            </div>
        );
    }
});

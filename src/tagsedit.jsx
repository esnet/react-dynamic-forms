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

import "./chooser.css";

/**
 * Form control to select tags from a pull down list. You can also add a new tag with
 * the Add tag button.
 */
export default React.createClass({
    
    displayName: "TagsEdit",

    getInitialState() {
        console.log("Initial", this.props.initialTags, this.props.initialTagList)
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

    handleShowNewTagUI() {
        this.setState({"showNewTagUI": true});
    },

    handleSubmitNewTagUI(e) {
        e.preventDefault();

        let currentTagList = this.state.tags;
        let tagList = this.state.tagList;
        const tag = this.refs.newTag.getDOMNode().value.trim();
        
        if (tag) {
            if (!_.contains(tagList, tag)) {
                tagList.push(tag);
            }
            currentTagList.push(tag);
        }

        this.setState({"showNewTagUI": false,
                       "tags": currentTagList,
                       "tagList": tagList});

        if (this.props.onChange) {
            this.props.onChange(this.props.attr, currentTagList);
        }
    },

    handleChange(val, tagList) {
        const tags = _.unique(_.map(tagList, tag => tag.label));
        this.setState({"tags": tags});
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
            return {value: index, label: tag, disabled: disabled}
        });

        if (_.isUndefined(this.state.tags) || _.isUndefined(this.state.tagList)) {
            console.error("Tags was supplied with bad state: attr is", this.props.attr,
                " (tags are:", this.state.tags, "and tagList is:", this.state.tagList, ")");
            return null;
        }

        const key = this.state.tags.join("-") + "--" + this.state.tagList.join("-");
        const clearable = this.props.allowSingleDeselect;
        const searchable = !this.props.disableSearch
        const matchPos = this.props.searchContains ? "any" : "start";

        return (
            <div className={className} style={{width: width}}>
                <Select multi={true}
                        placeholder="Select tags..."
                        value={this.state.tags}
                        disabled={this.props.disabled}
                        searchable={searchable}
                        clearable={clearable}
                        allowCreate={true}
                        matchPos={matchPos}
                        options={options}
                        onChange={this.handleChange}
                />
                <div className="help-block"></div>
            </div>
        );
    }
});

/** @jsx React.DOM */

"use strict";

var React = require("react/addons");
var _ = require("underscore");
var hash = require("string-hash");
var {Multiselect} = require("react-widgets");

require("./assets/css/react-widgets.css");
require("./tagsedit.css");

/**
 * Form control to select tags from a pull down list. You can also add a new tag with
 * the Add tag button.
 */

var TagsEdit = React.createClass({
    
    displayName: "TagsEdit",

    getInitialState: function() {
        return {
            tags: this.props.initialTags,
            tagList: this.props.initialTagList,
            showNewTagUI: false
        };
    },

    componentWillReceiveProps: function(nextProps) {
        this.setState({
            tags: nextProps.initialTags,
            tagList: nextProps.initialTagList
        });
    },

    handleChange: function(value) {
        this.setState({"tags": value});

        //Callback
        this.props.onChange(this.props.attr, value);
    },

    handleCreate: function(tag) {
        var currentTagList = this.state.tags;
        var tagList = this.state.tagList;

        if (tag) {
            if (!_.contains(tagList, tag)) {
                tagList.push(tag);
            }
            currentTagList.push(tag);
        }

        this.setState({"showNewTagUI": false,
                       "tags": currentTagList,
                       "tagList": tagList});

        //Callback
        this.props.onChange(this.props.attr, currentTagList);
    },

    render: function() {
        var newTagUI;

        if (_.isUndefined(this.state.tags) || _.isUndefined(this.state.tagList)) {
            console.error("Tags was supplied with bad state: attr is", this.props.attr,
                " (tags are:", this.state.tags, "and tagList is:", this.state.tagList, ")");
            return null;
        }

        var key = this.state.tags.join("-") + ":" + hash(this.state.tagList.join("-"));

        return (
            <div>
                <Multiselect multiple
                             ref={this.props.attr}
                             className="editTags"
                             key={key}
                             noResultsText="No tags found matching "
                             defaultValue={this.state.tags}
                             data={this.state.tagList}
                             onChange={this.handleChange}
                             onCreate={this.handleCreate}
                             width="300px"
                             placeholder="Select tags..."
                             messages={{emptyFilter: "No unused tags available", createNew: "Create a new tag"}}/>
                <div className="help-block"></div>
            </div>
        );
    }
});


module.exports = TagsEdit;
/** @jsx React.DOM */

"use strict";

var React = require("react");
var _ = require("underscore");
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

    handleShowNewTagUI: function() {
        this.setState({"showNewTagUI": true});
    },

    handleSubmitNewTagUI: function() {
        var currentTagList = this.state.tags;
        var tagList = this.state.tagList;
        var tag = this.refs.newTag.getDOMNode().value.trim();
        
        if (tag) {
            if (!_.contains(tagList, tag)) {
                tagList.push(tag);
            }
            currentTagList.push(tag);
        }

        this.setState({"showNewTagUI": false,
                       "tags": currentTagList,
                       "tagList": tagList});

        this.props.onChange(this.props.attr, currentTagList);

        return false;
    },

    handleChange: function(value) {
        console.log("handleChange", value);
        this.props.onChange(this.props.attr, value);
        this.setState({"tags": value});
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
    },

    render: function() {
        var newTagUI;

        if (_.isUndefined(this.state.tags) || _.isUndefined(this.state.tagList)) {
            console.error("Tags was supplied with bad state: attr is", this.props.attr,
                " (tags are:", this.state.tags, "and tagList is:", this.state.tagList, ")");
            return null;
        }

        var key = this.state.tags.join("-") + "--" + this.state.tagList.join("-");

        console.log(this.state.tags, this.state.tagList);
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
                             placeholder="Select tags..." />
                <div className="help-block"></div>
            </div>
        );
    }
});


module.exports = TagsEdit;
/** @jsx React.DOM */

"use strict";

var React = require("react/addons");
var _ = require("underscore");
var Chosen = require("react-chosen");

require("./assets/chosen.css");
require("./chooser.css");

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

    handleChange: function(e) {
        this.props.onChange(this.props.attr, $(e.target).val());
        this.setState({"tags": $(e.target).val()});
    },

    render: function() {
        var newTagUI;
        var chosenOptions = [];

        //The current list of tags, expressed as select options
        chosenOptions = _.map(this.state.tagList, function(tag, index) {
            return (
                <option key={index} value={tag}>{tag}</option>
            );
        });

        //The new tag UI, dependent on state.showNewTagUI
        var plusStyle = {"width": this.props.plusWidth ? this.props.plusWidth : 28,
                         "height": 28,
                         "margin-top": 0,
                         "float": "left"};
        if (this.state.showNewTagUI) {
            newTagUI = (<form onSubmit={this.handleSubmitNewTagUI} onBlur={this.blurNewTagUI} >
                            <input autoFocus type="text" ref="newTag" width="20" placeholder="Enter new tag..."/>
                        </form>);
        } else {
            newTagUI = (
                <div className="esdb-plus-action-box" onClick={this.handleShowNewTagUI} style={plusStyle}>
                    <i className="glyphicon glyphicon-plus esdb-small-action-icon"></i>
                </div>
            );
        }
        if (_.isUndefined(this.state.tags) || _.isUndefined(this.state.tagList)) {
            console.error("Tags was supplied with bad state: attr is", this.props.attr,
                " (tags are:", this.state.tags, "and tagList is:", this.state.tagList, ")");
            return null;
        }

        var key = this.state.tags.join("-") + "--" + this.state.tagList.join("-");

        return (
            <div>
                <table style={{width: "100%"}}>
                    <tr>
                        <td>
                            <Chosen
                                multiple
                                ref={this.props.attr}
                                className="editTags"
                                key={key}
                                noResultsText="No tags found matching "
                                defaultValue={this.state.tags}
                                onChange={this.handleChange}
                                width="300px"
                                data-placeholder="Select tags...">
                                    {chosenOptions}
                            </Chosen>
                        </td>
                        <td>
                            {newTagUI}
                        </td>
                    </tr>
                </table>
                <div className="help-block"></div>
            </div>
        );
    }
});


module.exports = TagsEdit;
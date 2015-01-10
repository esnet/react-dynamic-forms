/** @jsx React.DOM */

"use strict";

var React = require("react/addons");
var _ = require("underscore");

var Group = require("./group.jsx");
var TagsEdit= require("./tagsedit.jsx");

/**
 * Wraps the tags editor widget
 */
var TagsGroup = React.createClass({

    displayName: "TagsGroup",

    render: function() {
        var attr = this.props.attr;
        return this.transferPropsTo(
            <Group>
                <TagsEdit initialTags={attr.value}
                          initialTagList={this.props.availableTags} />
            </Group>
        );
    }
});


module.exports = TagsGroup;
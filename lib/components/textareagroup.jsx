/** @jsx React.DOM */

"use strict";

var React = require("react/addons");
var _ = require("underscore");

var Group = require("./group.jsx");
var TextArea= require("./textarea.jsx");

/**
 * Wraps the textarea widget
 */
var TextAreaGroup = React.createClass({

    displayName: "TextAreaGroup",

    render: function() {
        var attr = this.props.attr;
        return this.transferPropsTo(
            <Group>
                <TextArea initialValue={attr.initialValue}
                          width={this.props.width}/>
            </Group>
        );
    }
});


module.exports = TextAreaGroup;
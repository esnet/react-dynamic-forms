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
        var {attr, ...others} = this.props;
        return (
            <Group attr={attr} >
                <TextArea initialValue={attr.initialValue} {...others} />
            </Group>
        );
    }
});


module.exports = TextAreaGroup;
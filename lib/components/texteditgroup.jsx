/** @jsx React.DOM */

"use strict";

var React = require("react/addons");
var _ = require("underscore");

var Group = require("./group.jsx");
var TextEdit = require("./textedit.jsx");

/**
 * Wraps the textedit widget
 */
var TextEditGroup = React.createClass({
    
    displayName: "TextEditGroup",

    render: function() {
        var {attr, ...others} = this.props;
        return (
            <Group attr={attr}>
                <TextEdit initialValue={attr.initialValue} {...others} />
            </Group>
        ); 
    }
});

module.exports = TextEditGroup;
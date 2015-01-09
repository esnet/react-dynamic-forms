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
        var attr = this.props.attr;
        return this.transferPropsTo(
            <Group>
                <TextEdit initialValue={attr.initialValue}
                          width={this.props.width}
                          disabled={this.props.disabled}/>
            </Group>
        );
    }
});

module.exports = TextEditGroup;
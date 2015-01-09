/** @jsx React.DOM */

"use strict";

var React = require("react/addons");
var _ = require("underscore");
var OptionButtons = require("./optionbuttons.jsx");

/**
 * Wraps the optionbutton widget
 */
var OptionsGroup = React.createClass({

    displayName: "OptionsGroup",

    render: function() {
        return this.transferPropsTo(
            <Group>
                <OptionButtons initialChoice={this.props.initialChoice}
                               initialChoiceList={this.props.initialChoiceList}
                               width={this.props.width}/>
            </Group>
        );
    }
});

module.exports = OptionsGroup;
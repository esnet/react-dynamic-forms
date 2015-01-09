/** @jsx React.DOM */

"use strict";

var React = require("react/addons");
var _ = require("underscore");
var Group = require("./group.jsx");
var Chooser = require("./chooser.jsx");

var ChooserGroup = React.createClass({

    displayName: "ChooserGroup",

    render: function() {
        return this.transferPropsTo(
            <Group>
                <Chooser initialChoice={this.props.initialChoice}
                         initialChoiceList={this.props.initialChoiceList}
                         disableSearch={this.props.disableSearch}
                         allowSingleDeselect={this.props.allowSingleDeselect}
                         width={this.props.width}/>
            </Group>
        );
    }
});

module.exports = ChooserGroup;
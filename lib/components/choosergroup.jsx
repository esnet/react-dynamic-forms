/** @jsx React.DOM */

"use strict";

var React = require("react/addons");
var _ = require("underscore");
var Group = require("./group.jsx");
var Chooser = require("./chooser.jsx");

var ChooserGroup = React.createClass({

    displayName: "ChooserGroup",

    render: function() {
        var {attr, ...others} = this.props;
        return (
            <Group attr={attr} >
                <Chooser {...others} />
            </Group>
        );
    }
});

module.exports = ChooserGroup;
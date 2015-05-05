"use strict";

var React = require("react");
var _ = require("underscore");

var Group = require("./group");
var Chooser = require("./chooser");

var ChooserGroup = React.createClass({

    displayName: "ChooserGroup",

    render: function() {
        var {attr, children, ...others} = this.props;
        return (
            <Group attr={attr}>
                <Chooser {...others} />
            </Group>
        );
    }
});

module.exports = ChooserGroup;
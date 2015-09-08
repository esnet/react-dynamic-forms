"use strict";

var React = require("react");
var _ = require("underscore");

var {Nav, NavItem} = require("react-bootstrap");

var NavItems = React.createClass({
    
    displayName: "NavItems",

    getInitialState: function() {
        return {"active": this.props.active};
    },

    handleSelect: function(key) {
        if (this.props.onChange) {
            this.props.onChange(key)
        }
    },

    render: function() {
        var navElements = _.map(this.props.navItems, (item) => {
            var label = item["label"];
            if (_.has(item, "url")) {
                var url = item["url"];
                return (
                    <NavItem eventKey={label} href={url}>{label}</NavItem>
                );

            } else {
                return (
                    <NavItem eventKey={label} onSelect={this.handleSelect}>{label}</NavItem>
                );
            };
        });

        return (
            <div>
                <Nav bsStyle='pills' activeKey={this.props.active}>
                    {navElements}
                </Nav>
            </div>
        );
    },
});

module.exports = NavItems;
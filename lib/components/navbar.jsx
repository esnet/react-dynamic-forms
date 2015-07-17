"use strict";

var React = require("react/addons");
var _ = require("underscore");

var {Nav,
     NavItem} = require("react-bootstrap");

var NavBar = React.createClass({
    
    displayName: "NavBar",

    getInitialState: function() {
        return {"active": this.props.active};
    },

    handleSelect: function(key) {
        if (this.props.onChange) {
            this.props.onChange(key)
        }
    },

    render: function() {
        var self = this;

        var navElements = _.map(this.props.navItems, function(item) {
            var label = item["label"]
            if (_.has(item, "url")) {
                var url = item["url"]
                return (
                    <NavItem eventKey={label} href={url}>{label}</NavItem>
                );

            } else {
                return (
                    <NavItem eventKey={label} onSelect={self.handleSelect}>{label}</NavItem>
                );
            };             
        });        

        console.log("this.props", this.props)
        return (
            <div>
                <Nav bsStyle='pills' activeKey={this.props.active}>
                    {navElements}
                </Nav>
            </div>
        );
    },
});

module.exports = NavBar;


//var navInstance = (
//  
//    <NavItem eventKey={1} href='/home'>NavItem 1 content</NavItem>
//    <NavItem eventKey={2} title='Item'>NavItem 2 content</NavItem>
//    <NavItem eventKey={3} disabled={true}>NavItem 3 content</NavItem>
//  </Nav>
//);
//}
//React.render(navInstance, mountNode);

//<Nav bsStyle='pills' activeKey={this.state.active} >
//<NavItem eventKey={label} href={url}>{label}</NavItem>
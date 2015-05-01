"use strict";

var React = require("react");
var invariant = require('react/lib/invariant');
var _ = require("underscore");

var Attr = React.createClass({
    displayName: "Attr",
	render() {
	  invariant(
	    false,
	    '%s elements are for schema configuration only and should not be rendered',
	    	this.constructor.name
	  );
	}
});

module.exports = Attr;
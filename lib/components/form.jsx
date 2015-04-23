/** @jsx React.DOM */

"use strict";

var React = require("react/addons");
var invariant = require('react/lib/invariant');

var Form = React.createClass({
    displayName: "Form",
    render: function() {
      invariant(
        false,
        '%s elements are for use in renderForm() and should not be rendered directly',
            this.constructor.name
      );
    }
});

module.exports = Form;

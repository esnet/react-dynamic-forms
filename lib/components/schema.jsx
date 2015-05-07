"use strict";

var React = require("react/addons");
var invariant = require('react/lib/invariant');
var _ = require("underscore");

"use strict";

var Schema = React.createClass({
    displayName: "Schema",
    render() {
      invariant(
        false,
        '%s elements are for schema configuration only and should not be rendered', this.constructor.name
      );
    }
});

module.exports = Schema;
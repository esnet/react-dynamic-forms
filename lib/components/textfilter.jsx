"use strict";

var React = require("react/addons");
var _ = require("underscore");

/**
 * Filter text extry box.
 */
var TextFilter = React.createClass({

    displayName: "TextFilter",

    getDefaultProps: function() {
        return {width: "100%"};
    },

    getInitialState: function() {
        return {value: this.props.initialValue};
    },

    onChange: function(e) {
        this.setState({"value": e.target.value});
        if (this.props.onChange) {
            this.props.onChange(e.target.value);
        }
    },
 
    render: function() {
        var filterStyle = {"height": 27, "marginTop": 1, "width": this.props.width};
        return (
            <div className="input-group" style={filterStyle}>
                <input className="form-control"
                       type="text"
                       ref="filter"
                       placeholder="Filter"
                       defaultValue={this.state.value}
                       onChange={this.onChange}>
                </input>
                <span className="input-group-addon">
                    <span className="glyphicon glyphicon-filter"></span>
                </span>
            </div>
        );
    }
});

module.exports = TextFilter;
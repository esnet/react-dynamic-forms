/** @jsx React.DOM */

"use strict";

var React = require("react");
var _ = require("underscore");

/**
 * Filter text extry box.
 */
var TextFilter = React.createClass({

    displayName: "TextFilter",

    getDefaultProps: function() {
        return {width: 300};
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
        var w = _.isUndefined(this.props.width) ? "100%" : this.props.width;
        var filterStyle = {"height": 27, "margin-top": 1, "width": w};
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
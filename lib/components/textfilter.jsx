/** @jsx React.DOM */

"use strict";

var React = require("react");
var _ = require("underscore");

/**
 * Filter text extry box.
 */
var TextFilter = React.createClass({

    displayName: "TextFilter",

    getInitialState: function() {
        return {value: this.props.initialValue};
    },

    componentDidMount: function() {
        var missing = this.props.required &&
                (_.isNull(this.props.initialValue) ||
                 _.isUndefined(this.props.initialValue) ||
                 this.props.initialValue === "");
        var missingCount = missing ? 1 : 0;
        this.setState({"missing": missing});
        
        //Callback
        if (this.props.onMissingCountChange) {
            this.props.onMissingCountChange(this.props.attr, missingCount);
        }
    },

    onChange: function(e) {
        this.setState({"value": e.target.value});

        //Callback
        if (this.props.onChange) {
            this.props.onChange(e.target.value);
        }
    },
 
    render: function() {
        return (
            <div className="input-group">
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
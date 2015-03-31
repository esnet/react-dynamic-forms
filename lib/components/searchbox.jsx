/** @jsx React.DOM */

"use strict";

var React = require("react/addons");
var _ = require("underscore");

/**
 * Search text extry box.
 */
var SearchBox = React.createClass({

    displayName: "SearchBox",

    getInitialState: function() {
        return {value: this.props.initialValue};
    },

    onSubmit: function() {
        var val = this.refs.search.getDOMNode().value;
        this.setState({"value": val});

        //Callback
        if (this.props.onSubmit) {
            this.props.onSubmit(val);
        }
    },
 
    render: function() {
        return (
            <form onSubmit={this.onSubmit}>
                <div className="input-group">
                    <input className="form-control"
                           type="search"
                           ref="search"
                           placeholder="Search"
                           defaultValue={this.state.value} >
                    </input>
                    <span className="input-group-addon" onClick={this.onSubmit}>
                        <span className="glyphicon glyphicon-search"></span>
                    </span>
                </div>
            </form>
        );
    }
});

module.exports = SearchBox;
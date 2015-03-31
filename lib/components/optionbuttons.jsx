/** @jsx React.DOM */

"use strict";

var React = require("react/addons");
var _ = require("underscore");

var OptionButtons = React.createClass({

    displayName: "OptionButtons",

    getInitialState: function() {
        return {"value": this.props.initialChoice};
    },

    handleChange: function(e) {
        var value = $(e.target).val();
        var missing = this.props.required && this._isEmpty(value);

        //State changes
        this.setState({"value": e.target.value,
                       "missing": missing});

        //Callbacks
        if (this.props.onChange) {
            this.props.onChange(this.props.attr, e.target.value);
        }
    },

    render: function() {
        var self = this;
        var classes = "btn-group btn-group-sm esdb-";

        if (!this.props.initialChoiceList) {
            console.warn("No initial choice list supplied for attr", this.props.attr);
        }

        var buttonElements = _.map(self.props.initialChoiceList, function(choice, i) {
            if (Number(i) === Number(self.props.initialChoice)) {
                return (
                    <button type="button" className="active btn btn-default" key={i} value={i} onClick={self.handleChange}>{choice} </button>
                );
            } else {
                return (
                    <button type="button" className="btn btn-default" key={i} value={i} onClick={self.handleChange}>{choice}</button>
                );
            }
        });

        var width = this.props.width ? this.props.width + "px" : "400px";

        //Key based on the choice list
        var choiceList = _.map(this.props.initialChoiceList, function(choice) {
            return choice;
        });
        var list = choiceList.join("-");

        return (
            <div className={classes} key={list} width={width} style={{"marginBottom": 5}}>
                {buttonElements}
            </div>
        );
    }
});


module.exports = OptionButtons;
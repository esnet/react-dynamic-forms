"use strict";

var React = require("react");
var _ = require("underscore");

require("./listoptions.css");

var OptionList = React.createClass({

    displayName: "OptionList",

    getInitialState: function() {
        return {"value": this.props.choice};
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
        var classes = "list-group";

        if (!this.props.options) {
            console.warn("No initial choice list supplied for attr", this.props.attr);
        }

        var listElements = _.map(self.props.options, function(option, i) {
            if (self.props.choice === Number(i)) {
                return (
                    <li className="list-group-item active" key={i} value={i} onClick={self.handleChange}>{option} </li>
                );
            } else {
                return (
                    <li className="list-group-item" key={i} value={i} onClick={self.handleChange}>{option}</li>
                );
            }
        });

        var style = this.props.width ? {width: this.props.width} : {};

        //Key based on the choice list
        var choiceList = _.map(this.props.options, function(choice) {
            return choice;
        });
        var list = choiceList.join("-");

        return (
            <ul className={classes} style={style} key={list}>
                {listElements}
            </ul>
        );
    }
});

module.exports = OptionList;
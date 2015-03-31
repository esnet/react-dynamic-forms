/** @jsx React.DOM */

"use strict";

var React = require("react/addons");
var _ = require("underscore");
var ReactWidgets = require("react-widgets");

require("./assets/css/react-widgets.css");
require("./chooser.css");

var {Combobox,
     DropdownList} = ReactWidgets;

/**
 * React Form control to select an item from a list.
 * Wraps the Chosen library pull down with search functionality.
 *
 * Props:
 *     initialChoice     - Pass in the initial value as an id
 *     initialChoiceList - Pass in the available list of options as an object
 *                         e.g. {1: cat, 2: dog, 3: fish, ...}
 *                         NOTE: keys begins at 1, because 0 is the placeholder.
 *
 *     attr              - The identifier of the property being editted
 *
 *     onChange          - Callback for when value changes.
 *                         Will be passed the attr and new value as a string.
 * States:
 *     value             - The current value (index) of the chosen selector.
 *
 */

var Chooser = React.createClass({

    displayName: "Chooser",

    getInitialState: function() {
        return {"initialChoice": this.props.initialChoice,
                "value": this.props.initialChoice,
                "missing": false};
    },

    _isEmpty: function(value) {
        return (_.isNull(value) ||
                _.isUndefined(value) ||
                value === "");
    },

    _isMissing: function() {
        return this.props.required &&
                !this.props.disabled &&
                this._isEmpty(this.state.value);
    },

    componentWillReceiveProps: function(nextProps) {
        var self = this;
        if (this.state.initialChoice !== nextProps.initialChoice) {

            //
            // We defer this change so that the chooser's menu can close before anything here
            // changes it (the new props may have been caused by the pulldown selection in the
            // first place)
            //

            _.defer(function(initialChoice){
                self.setState({
                    "initialChoice": initialChoice,
                    "value": initialChoice
                });
            }, nextProps.initialChoice);

        }
    },

    /**
     * If there's no initialValue for the chooser and this field is required then
     * report the missing count up to the parent.
     */
    componentDidMount: function() {
        var missing = this.props.required && !this.props.disabled &&
                        (_.isNull(this.props.initialChoice) ||
                         _.isUndefined(this.props.initialChoice) ||
                         this.props.initialChoice === "");
        var missingCount = missing ? 1 : 0;
        this.setState({"missing": missing});
        if (this.props.onMissingCountChange) {
            this.props.onMissingCountChange(this.props.attr, missingCount);
        }
    },

    handleChange: function(v) {
        var self = this;
        var value = v.id;

        //is value missing?
        var missing = this.props.required && this._isEmpty(value);

        //State changes
        self.setState({"value": value,
                       "missing": missing});
        
        //Callbacks
        if (self.props.onChange) {
            self.props.onChange(this.props.attr, value);
        }
        if (self.props.onMissingCountChange) {
            self.props.onMissingCountChange(this.props.attr,  missing ? 1 : 0);
        }
    },

    render: function() {
        var self = this;
        var className = "";
        
        if (!this.props.initialChoiceList) {
            console.warn("No initial choice list supplied for attr", this.props.attr);
        }

        var width = this.props.width ? this.props.width + "px" : "400px";

        if (this.props.showRequired && this._isMissing()) {
            className = "has-error";
        }

        function filterFunction(item, value) {
            return item.value.toLowerCase().indexOf(value.toLowerCase()) >= 0;
        }

        //Current choice and list of choices
        var choice = this.props.initialChoiceList[this.state.value];
        var choiceList = _.map(this.props.initialChoiceList, function(choiceLabel, key) {
            return {"id": key, "value": choiceLabel};
        });

        var itemList = _.map(this.props.initialChoiceList, function(choiceLabel) {
            return choiceLabel;
        }).join("-");

        if (this.props.disableSearch) {
            return (
                <div className={className} >
                    <DropdownList disabled={this.props.disabled}
                                  style={{width: width}}
                                  key={this.state.initialChoice}
                                  valueField="id" textField="value"
                                  data={choiceList}
                                  defaultValue={choice}
                                  filter={false}
                                  onChange={this.handleChange} />
                </div>
            );
        } else {
            return (
                <div className={className} >
                    <Combobox disabled={this.props.disabled}
                              style={{width: width}}
                              key={this.state.initialChoice}
                              textField="value"
                              data={choiceList}
                              defaultValue={choice}
                              filter={filterFunction}
                              suggest={false}
                              onToggle={this.handleToggle}
                              onChange={this.handleChange} />
                </div>
            );
        }
    }
});

module.exports = Chooser;
/** @jsx React.DOM */

"use strict";

var React = require("react/addons");
var _ = require("underscore");
var ReactWidgets = require("react-widgets");
var hash = require("string-hash");

require("./assets/css/react-widgets.css");
require("./chooser.css");

var {Combobox,
     DropdownList} = ReactWidgets;

/**
 * React Form control to select an item from a list.
 *
 * Wraps the react-widget library combobox and dropdownlist components.
 *
 * Props:
 *     initialChoice     - Pass in the initial value as an id
 *
 *     initialChoiceList - Pass in the available list of options as a list of objects
 *                         e.g. [{id: 1: label: "cat"}, {id: 2: label: "dog"}, ... ]
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

        //If the user types something in that's not in the list, we
        //just ignore that here
        if (!_.isObject(v) && v !== "") {
            return;
        }

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

        //Current choice
        var choiceItem = _.find(this.props.initialChoiceList, function(item) {
            return item.id == self.state.value;
        });
        var choice = choiceItem ? choiceItem.label : undefined;
        
        //List of choices
        var choiceList = _.map(this.props.initialChoiceList, function(v, i) {
            return {id: Number(v.id), value: v.label};
        });
        
        //Optionally sort the choice list
        if (this.props.sorted) {
            choiceList = _.sortBy(choiceList, function(item){
                return item.value;
            });
        }

        //The key needs to change if the initialChoiceList changes, so we set
        //the key to be the hash of the choice list
        var key = hash(_.map(this.props.initialChoiceList, function(choiceLabel) {
            return choiceLabel;
        }).join("-"));

        if (this.props.disableSearch) {
            //Disabled search builds a simple pulldown list
            return (
                <div className={className} >
                    <DropdownList disabled={this.props.disabled}
                                  style={{width: width}}
                                  key={key}
                                  valueField="id" textField="value"
                                  data={choiceList}
                                  defaultValue={choice}
                                  onChange={this.handleChange} />
                </div>
            );
        } else {
            //Otherwise build a combobox style list
            return (
                <div className={className} >
                    <Combobox ref="chooser"
                              disabled={this.props.disabled}
                              style={{width: width}}
                              key={key}
                              valueField="id"
                              textField="value"
                              defaultValue={choice}
                              data={choiceList}
                              filter={false}
                              suggest={true}
                              onChange={this.handleChange} />
                </div>
            );
        }
    }
});

module.exports = Chooser;
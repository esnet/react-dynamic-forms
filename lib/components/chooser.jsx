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

    _generateKey: function(choice, choiceList) {
        var key = hash(_.map(choiceList, function(label) {
            return label;
        }).join("-"));
        key += "-" + choice;
        return key;
    },

    componentWillReceiveProps: function(nextProps) {
        var self = this;
        if (this.state.initialChoice !== nextProps.initialChoice) {

            //
            // We defer this change so that the chooser's menu can close before anything here
            // changes it (the new props may have been caused by the pulldown selection in the
            // first place). Also, we need to regenerate the key used here, because a new
            // initial value specified from above should rebuild the chooser, otherwise it will
            // be potentially stale.
            //

            _.defer(function(initialChoice) {
                var key = self._generateKey(initialChoice, self.props.initialChoiceList);
                self.setState({
                    "initialChoice": initialChoice,
                    "value": initialChoice,
                    "key": key
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
        
        if (this.props.onMissingCountChange) {
            this.props.onMissingCountChange(this.props.attr, missingCount);
        }

        //The key needs to change if the initialChoiceList changes, so we set
        //the key to be the hash of the choice list


        this.setState({
            "missing": missing,
            "key": this._generateKey(this.props.initialChoice, this.props.initialChoiceList)
        });

    },

    handleChange: function(v) {
        var missing = false;

        //If v is an object then something was selected
        //If v is a string, then something was typed in that may or may not be in the
        //choice list.
        var selected;
        if (!_.isObject(v)) {
            selected = _.findWhere(this.props.initialChoiceList, {label: v});
        } else {
            selected = v;
        }

        //If the user types something in that's not in the list, we
        //just ignore that here
        if (!selected) {
            missing = this.props.required;
            this.setState({"value": undefined,
                           "missing": missing});
            return;
        }

        var value = selected.id;

        //State changes
        this.setState({"value": value});

        //Callbacks
        if (this.props.onChange) {
            this.props.onChange(this.props.attr, value);
        }
        if (this.props.onMissingCountChange) {
            this.props.onMissingCountChange(this.props.attr,  missing ? 1 : 0);
        }
    },

    onBlur: function(x) {
        var value = this.state.value;
        var missing = this.props.required && this._isEmpty(value);

        //State changes
        this.setState({"value": value,
                       "missing": missing});

        //Callbacks
        if (this.props.onChange) {
            this.props.onChange(this.props.attr, missing ? "" : value );
        }
        if (this.props.onMissingCountChange) {
            this.props.onMissingCountChange(this.props.attr,  missing ? 1 : 0);
        }
        return false;
    },

    render: function() {
        var self = this;
        var className = "";
        
        if (!this.props.initialChoiceList) {
            console.warn("No initial choice list supplied for attr", this.props.attr);
        }

        var width = this.props.width ? this.props.width + "px" : "100%";
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
            return {id: v.id, value: v.label};
        });
        
        //Optionally sort the choice list
        if (this.props.sorted) {
            choiceList = _.sortBy(choiceList, function(item){
                return item.value;
            });
        }

        if (this.props.disableSearch) {
            //Disabled search builds a simple pulldown list
            return (
                <div className={className} >
                    <DropdownList disabled={this.props.disabled}
                                  style={{width: width}}
                                  key={this.state.key}
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
                              key={this.state.key}
                              onBlur={this.onBlur}
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
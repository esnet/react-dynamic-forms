/** @jsx React.DOM */

"use strict";

var React = require("react");
var _ = require("underscore");
var Chosen = require("react-chosen");

require("./assets/chosen.css");
require("./chooser.css");

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
        return {"value": this.props.initialChoice,
                "missing": false};
    },

    _isEmpty: function(value) {
        return (_.isNull(value) ||
                _.isUndefined(value) ||
                value === "");
    },

    _isMissing: function() {
        return this.props.required && !this.props.disabled && this._isEmpty(this.state.value);
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

    handleChange: function(e) {
        e.stopPropagation();
        var value = $(e.target).val();
        var missing = this.props.required && this._isEmpty(value);

        //State changes
        this.setState({"value": e.target.value,
                       "missing": missing});

        //Callbacks
        if (this.props.onChange) {
            this.props.onChange(this.props.attr, e.target.value);
        }

        if (this.props.onMissingCountChange) {
            this.props.onMissingCountChange(this.props.attr,  missing ? 1 : 0);
        }
    },

    render: function() {
        var self = this;
        var className = "";
        
        if (!this.props.initialChoiceList) {
            console.warn("No initial choice list supplied for attr", this.props.attr);
        }

        var choiceOptions = [];
        if (!this.props.disabled) {
            choiceOptions = _.map(self.props.initialChoiceList, function(choice, i) {
                if (_.contains(self.props.disableList, i)) {
                    return (
                        <option key={i} value={i} disabled>{choice}</option>
                    );
                } else {
                    return (
                        <option key={i} value={i}>{choice}</option>
                    );
                }
            });
        }

        var width = this.props.width ? this.props.width + "px" : "400px";

        if (this.props.showRequired && this._isMissing()) {
            className = "has-error";
        }

        var helpClassName = "help-block";
        if (this.state.error) {
            helpClassName += " has-error";
        }

        //Key based on the choice list
        var choiceList = _.map(this.props.initialChoiceList, function(choice) {
            return choice;
        });
        var allowSingleDeselect = this.props.allowSingleDeselect || false;
        var list = choiceList.join("-");

        return (
            <div className={className} >
                <Chosen
                    key={list}
                    defaultValue={this.state.value}
                    width={width}
                    disabled={this.props.disabled}
                    data-placeholder="Select..."
                    disableSearch={this.props.disableSearch}
                    allowSingleDeselect={allowSingleDeselect}
                    searchContains={true}
                    onChange={this.handleChange} >
                        <option
                            value="">
                        </option>
                        {choiceOptions}
                </Chosen>
            </div>
        );
    }
});

module.exports = Chooser;
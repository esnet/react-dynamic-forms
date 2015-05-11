"use strict";

var React = require("react/addons");
var _ = require("underscore");
var Chosen = require("react-chosen");
var hash = require("string-hash");

require("./assets/chosen.css");
require("./chooser.css");

/**
 * React Form control to select an item from a list.
 *
 * Wraps the react-chooser library
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

    handleChange: function(e) {
        var value = $(e.target).val();
        var missing = this.props.required && this._isEmpty(value);

        //State changes
        this.setState({"value": value,
                       "missing": missing});

        //Callbacks
        if (this.props.onChange) {
            this.props.onChange(this.props.attr, value);
        }
        if (this.props.onMissingCountChange) {
            this.props.onMissingCountChange(this.props.attr,  missing ? 1 : 0);
        }

        e.stopPropagation();
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
        var choice = choiceItem ? choiceItem.id : undefined;
        
        //List of choice options
        var choiceOptions = [];
        if (!this.props.disabled) {
            choiceOptions = _.map(self.props.initialChoiceList, function(v, i) {
                if (_.contains(self.props.disableList, i)) {
                    return (
                        <option key={v.id} value={v.id} disabled>{v.label}</option>
                    );
                } else {
                    return (
                        <option key={v.id} value={v.id}>{v.label}</option>
                    );
                }
            });
        }

        //Optionally sort the choice list
        //if (this.props.sorted) {
        //    choiceList = _.sortBy(choiceList, function(item){
        //        return item.value;
        //    });
        //}

        var allowSingleDeselect = this.props.allowSingleDeselect || false;

        return (
            <div className={className} >
                <Chosen
                    key={this.state.key}
                    width={width}
                    defaultValue={choice}
                    disabled={this.props.disabled}
                    data-placeholder="Select..."
                    disableSearch={this.props.disableSearch}
                    allowSingleDeselect={allowSingleDeselect}
                    searchContains={true}
                    onChange={this.handleChange} >
                    
                        <option value=""></option>
                        {choiceOptions}
                 </Chosen>
            </div>
        );
    }
});

module.exports = Chooser;
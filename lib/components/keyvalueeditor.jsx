"use strict";

var _ = require("underscore");
var React = require("react");
var Copy = require("deepcopy");

var Attr = require("./attr");
var KeyMirror = require('react/lib/keyMirror');
var ListEditorMixin = require("./listeditormixin");
var Chooser = require("./chooser");
var TextEdit = require("./textedit");
var Group = require("./group");
var FormMixin = require("./formmixin");
var Schema = require("./schema");

//State transitions when adding to the key-value list
var CreationState = KeyMirror({
    OFF: null,
    PICK_KEYNAME: null,
});

var KeyValueListEditor = React.createClass({
    
    displayName: "KeyValueListEditor",

    mixins: [ListEditorMixin],
    
    getInitialState: function () {
        return {
            createState: CreationState.OFF,
            keyName: null,
            value: "",
            valueError: false,
            validationRule: null,
        };
    },
    
    /**  Set initial items */
    initialItems: function() {
        return this.props.keyValues || []; 
    },

    /** Create a new item */
    createItem: function(data) {
        var keyName = data.keyName;
        var value = data.value;
        return {
            "keyName": keyName, 
            "value": value,
            "valueError": false,
            "validationRule": null, 
        };
    },

    handleKeyNameSelect: function(attr, value) {
        var validation = null;
        _.each(this.props.constraints, function(constraint){
            if (_.isMatch(constraint, {"keyname":value})) {
                if (constraint["datatype"] == "integer") {
                    validation = {"format":constraint["datatype"],"type":"integer"};
                } else {
                    validation = {"format":constraint["datatype"],"type":"string"};
                };    
            }
        });
        this.setState({"validationRule": validation});
        this.setState({"keyName": value});  
    },

    handleDialogValueChanged: function(attr, value) {  
        this.setState({"value": value});
    },

    handleDone: function() {
        var data = {
            "keyName": this.state.keyName, 
            "value": this.state.value,  
            "valueError": this.state.valueError,
            "validationRule": this.state.validationRule,
        };

        this.transitionTo(CreationState.OFF)();
        this.handleAddItem(data);

        this.setState({
            "keyName": null,
            "value": "",
            "valueError": false,
            "validationRule": null
        });
    },

    handleDialogValueError: function(attr, errorCount) {
        this.setState({"valueError": errorCount === 1 ? true : false}); 
    },

  
    handleCancel: function() {
        this.transitionTo(CreationState.OFF)();
        this.setState({
            "keyName": null,
            "value": "",
            "valueError": false,
            "validationRule": null
        });
    },

    //
    // General state transition
    //

    transitionTo: function(newState) {
        var self = this;
        return function(e) {
            var oldState = self.state.createState;
            self.setState({"createState": newState});
        }
    },

    plusUI: function() {
        var self = this;

        var ui;
        
        var keyValueChoice = _.map(this.props.constraints, function(value, keyname) {
            return {
                "id": value["keyname"],
                "label": value["keyname"],
            }
        });

        // Get a list of keys not already used in the existing items
        var existingKeys = _.pluck(this.state.items, "keyName");
        var existingKeySet = _.object(existingKeys, existingKeys);

        var filteredChoiceList = _.filter(keyValueChoice, function(choice){
            return !_.has(existingKeySet, choice.label)
        });

        switch (this.state.createState) {

            case CreationState.OFF:
                //Initial UI to show the [+] Contact
                if (filteredChoiceList.length != 0) {
                    ui = (
                        <div className="esdb-plus-action-box"
                            key="append-new-or-existing"
                            style={{marginBottom: 10}}
                            onClick={this.transitionTo(CreationState.PICK_KEYNAME)} >
                            <div>
                                <i className="glyphicon glyphicon-plus esnet-forms-small-action-icon">
                                    Key
                                </i>
                            </div>
                        </div>
                    );
                } else {
                    ui = (
                        <div> 
                            <table>
                                <tbody>
                                    <tr>
                                        <td>
                                            <i className="glyphicon glyphicon-plus esdb-small-action-icon text-muted">
                                                All available choices selected   
                                            </i>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        );
                };
                break;

            case CreationState.PICK_KEYNAME:

                var doneButtonElement;
                var cancelButtonElement;
                var buttonStyle = {
                    marginLeft: 0,
                    marginRight: 10,
                    marginTop: 10,
                    marginBottom: 10,
                    height: 22,
                    width: 55,
                    float: "right"
                }

                cancelButtonElement = (
                    <button style={buttonStyle}
                            type="button"
                            className="btn btn-xs btn-default"
                            key="cancel-button"
                            onClick={this.handleCancel}>Cancel</button>
                );
                
                if (this.state.keyName === null || this.state.value === "" || this.state.valueError === true) {
                    doneButtonElement = (
                        <button style={buttonStyle}
                                type="button"
                                key="pick-contact-button-disabled"
                                className="btn btn-xs btn-default"
                                disabled="disabled">Done</button>
                    );
                } else {
                    doneButtonElement = (
                       <button style={buttonStyle}
                                type="button"
                                className="btn btn-xs btn-default"
                                key="pick-contact-button"
                                onClick={this.handleDone}>Done</button>
                    );
                }

                ui = (
                    <div className="esdb-plus-action-box-dialog-lg"
                         key="select-existing"
                         style={{marginBottom: 10}}>
                        <table>
                        <tbody>
                            <tr>
                                <td width="150">Key Name</td>
                                <td>
                                    <Chooser attr="keyName"
                                             initialChoice={null}
                                             initialChoiceList={filteredChoiceList} 
                                             onChange={this.handleKeyNameSelect} />
                                </td>
                            </tr>
                            <tr>
                                <td width="150">Value</td>
                                <td>
                                    <TextEdit attr="value" rules={this.state.validationRule} onErrorCountChange={this.handleDialogValueError}
                                     onChange={this.handleDialogValueChanged}
                                     width={300} />
                                </td>
                            </tr>
                            <tr>
                                <td></td><td><span>{cancelButtonElement}</span><span>{doneButtonElement}</span></td>
                            </tr>
                        </tbody>
                        </table>
                    </div>
                );
                break;
        }

        return ui;

    },

    renderItem: function(item) {
        var style={
            paddingLeft: 12,
            color: "#A6A6A6"
        };
        var keyName = item.keyName;
        var value = item.value;
        return (
            <div>
                <table>
                    <tbody>
                        <tr>
                            <td width="140">{keyName}</td>
                            <td>
                                <span style={style}>
                                    {value}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    },
});

var KeyValueEditor = React.createClass({

    displayName: "KeyValueEditor",

    handleChange: function(attr, keyValue) {
        var newKeyValues={};
        _.each(keyValue, function(keyName) {
            newKeyValues[keyName["keyName"]]=keyName["value"];
        });
        if (this.props.onChange) {
            this.props.onChange(this.props.attr, newKeyValues);
        };    
    },

    render: function() {
        var keyValuesDict = this.props.keyValues;
        var keyValueList=[];
        _.each(keyValuesDict, function(value, keyName) {
            keyValueList.push({"keyName": keyName, "value": value});
        });
        var constraints = this.props.constraints;
        return (
                <KeyValueListEditor keyValues={keyValueList}
                                    constraints={constraints}
                                    onChange={this.handleChange} />
        );
    }
});

module.exports = KeyValueEditor;


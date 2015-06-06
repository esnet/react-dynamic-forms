"use strict";

var _ = require("underscore");
var React = require("react/addons");
var Copy = require("deepcopy");

var Attr = require("./attr");
var KeyMirror = require('react/lib/keyMirror');
var ListEditorMixin = require("./listeditormixin");
var Chooser = require("./chooser");
var TextEdit = require("./textedit");

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
            value: null,
            valueError: false,
        };
    },
    
    /**  Set initial items */
    initialItems: function() {
        return this.props.keyValueList || []; 
    },

    /** Create a new item */
    createItem: function(data) {
        var keyName = data.keyName;
        var value = data.value;
        return {
            "keyName": keyName, 
            "value": value,
            "valueError": false 
        };
    },

    handleKeyNameSelect: function(attr, value) {
        console.log("attr",attr);
        console.log("value",value);
        this.setState({"keyName": value});  
    },

    handleValueChanged: function(attr, value) {  
        this.setState({"value": value});
    },

    handleDone: function() {
        var data = {
            "keyName": this.state.keyName, 
            "value": this.state.value,  
            "valueError": this.state.valueError
        };

        this.transitionTo(CreationState.OFF)();
        this.handleAddItem(data);

        this.setState({
            "keyName": null,
            "value": null,
            "valueError": false
        });
    },

    handleValueError: function(attr, errorCount) {
        this.setState({"valueError": errorCount === 1 ? true : false}); 
    },

  
    handleCancel: function() {
        this.transitionTo(CreationState.OFF)();
        this.setState({
            "keyName": null,
            "value": null,
            "valueError": false
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
        console.log("this.state.items", this.state.items)
        var self = this;
        
        var ui;
        switch (this.state.createState) {

            case CreationState.OFF:
                //Initial UI to show the [+] Contact
                ui = (
                    <div className="esdb-plus-action-box"
                         key="append-new-or-existing"
                         style={{marginBottom: 10}}
                         onClick={this.transitionTo(CreationState.PICK_KEYNAME)} >
                        <i className="glyphicon glyphicon-plus esdb-small-action-icon">
                            Detail
                        </i>
                    </div>
                );
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

                var keyValueChoice = _.map(this.props.constraints, function(value, keyname) {
                    return {
                        "id": value["keyname"],
                        "label": value["keyname"],
                    }
                });
                
                var used = _.object(_.pluck(this.state.items, "keyName"), _.pluck(this.state.items, "keyName"))

                var filteredChoiceList = _.filter(keyValueChoice, function(choice){
                    return !_.has(used, choice.label)
                });
              
                console.log("used", used);
                console.log("this.props.constraints", this.props.constraints)
                console.log("keyValueChoice", keyValueChoice);
                console.log("filteredChoiceList", filteredChoiceList);

                cancelButtonElement = (
                    <button style={buttonStyle}
                            type="button"
                            className="btn btn-xs btn-default"
                            key="cancel-button"
                            onClick={this.handleCancel}>Cancel</button>
                );

                if (this.state.keyName === null || this.state.value === null || this.state.valueError === true) {
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

                var validationRule = {"format":"email"}

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
                                             initialChoiceList={filteredChoiceList}  //Need to construct chooser list
                                             onChange={this.handleKeyNameSelect} />
                                </td>
                            </tr>
                            <tr>
                                <td width="150">Value</td>
                                <td>
                                    <TextEdit attr="value" rules={validationRule} onErrorCountChange={this.handleValueError}
                                     onChange={this.handleValueChanged}
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
                            <td>{keyName}</td>
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
    
    render: function() {
        var keyValues = this.props.keyValues;
        var keyValueList=[];
        _.each(keyValues, function(value, keyName) {
            keyValueList.push({"keyName": keyName, "value": value});
            });
        var constraints = this.props.constraints;
        return (
            <KeyValueListEditor keyValueList={keyValueList} constraints={constraints}/> 
        );
    }
});

module.exports = KeyValueEditor;


"use strict";

var React = require("react/addons");
var _ = require("underscore");

var {Chooser} = require("../../entry");

var animalMap = {1: "dog", 2: "duck", 3: "cat", 4: "donkey",
                 5: "fish", 6: "hedgehog", 7: "banana slug"};

var ChooserExamples = React.createClass({

    getInitialState: function() {

        return {
            animalList: _.map(animalMap, function(value, key) {
                return {id: key, label: value}
            }),
            selection: "",
            missingCount: 0,
        };
    },

    handleChange: function(attr, value) {
        this.setState({"selection": value});
    },

    handleMissingCountChange: function(attr, count) {
        this.setState({"missingCount": count});
    },

    render: function() {
        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <h3>Chooser Examples</h3>
                        The Chooser widget wraps the combobox and simple pulldown of react-widgets.<br />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12">
                        <h4>Chooser</h4>

                        <p />
                        Simple chooser:
                        <Chooser initialChoiceList={this.state.animalList} width={300}/>

                        <p />
                        Simple chooser sorted:
                        <Chooser initialChoiceList={this.state.animalList} sorted={true} width={300}/>


                        <p />
                        Chooser with initial choice:
                        <Chooser initialChoice={4} initialChoiceList={this.state.animalList} width={300}/>

                        <p />
                        Chooser with initial choice and sorted:
                        <Chooser initialChoice={4} initialChoiceList={this.state.animalList} sorted={true} width={300}/>

                        <p />
                        Chooser disabled:
                        <Chooser initialChoice={2} initialChoiceList={this.state.animalList} disabled={true} width={300}/>

                        <p />
                        Chooser with search disabled:
                        <Chooser initialChoice={3} initialChoiceList={this.state.animalList} disableSearch={true} width={300}/>

                        <p />
                        Chooser with a required value:
                        <Chooser initialChoiceList={this.state.animalList}  width={300} required={true} showRequired={true} allowSingleDeselect={true} onMissingCountChange={this.handleMissingCountChange}/>
                        Missing count: {this.state.missingCount}
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = ChooserExamples;
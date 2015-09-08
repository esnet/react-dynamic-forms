"use strict";

var React = require("react");
var _ = require("underscore");

var {Chooser} = require("../../index");

var animalMap = {1: "dog", 2: "duck", 3: "cat", 4: "donkey",
                 5: "fish", 6: "hedgehog", 7: "banana slug"};

var animalList = _.map(animalMap, (value, key) => {return {id: key, label: value}})

var sortedAnimalList = _.sortBy(animalList, (item) => {return item.label; });

var ChooserExamples = React.createClass({

    getInitialState: function() {

        return {
            animalList: animalList,
            sortedAnimalList: sortedAnimalList,
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
                        The Chooser widget wraps the react-select component<br />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12">
                        <h4>Chooser</h4>

                        <p />
                        Simple chooser:
                        <Chooser initialChoiceList={this.state.animalList} width={300}/>

                        <p />
                        Wider chooser:
                        <Chooser initialChoiceList={this.state.animalList} width={500}/>

                        <p />
                        Simple chooser sorted:
                        <Chooser initialChoiceList={this.state.sortedAnimalList} width={300}/>

                        <p />
                        Chooser with initial choice:
                        <Chooser initialChoice={4} initialChoiceList={this.state.animalList} width={300}/>

                        <p />
                        Chooser with initial choice and sorted:
                        <Chooser initialChoice={4} initialChoiceList={this.state.sortedAnimalList} width={300}/>

                        <p />
                        Chooser disabled:
                        <Chooser initialChoice={2} initialChoiceList={this.state.animalList} disabled={true} width={300}/>

                        <p />
                        Chooser with item disabled:
                        <Chooser initialChoice={3} initialChoiceList={this.state.animalList} disableList={["2"]} disableSearch={true} width={300}/>


                        <p />
                        Chooser with search disabled:
                        <Chooser initialChoice={3} initialChoiceList={this.state.animalList} disableSearch={true} width={300}/>

                        <p />
                        Chooser with single deselect:
                        <Chooser initialChoice={2} initialChoiceList={this.state.animalList} disableSearch={true} allowSingleDeselect={true} width={300}/>

                        <p />
                        Chooser with a required value:
                        <Chooser initialChoiceList={this.state.animalList}  width={300} required={true} showRequired={true}
                                 allowSingleDeselect={true} onMissingCountChange={this.handleMissingCountChange}/>
                        Missing count: {this.state.missingCount}

                        <p />
                        Chooser onChange callback:
                        <Chooser initialChoiceList={this.state.sortedAnimalList} width={300} onChange={this.handleChange}/>
                        Chosen: {this.state.selection} ({animalMap[this.state.selection]})

                    </div>
                </div>
            </div>
        );
    }
});

module.exports = ChooserExamples;
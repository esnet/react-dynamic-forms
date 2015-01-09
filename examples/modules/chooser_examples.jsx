/** @jsx React.DOM */

var React = require('react');

var {Chooser} = require("../../entry");

var ChooserExamples = React.createClass({

    getInitialState: function() {
        return {
            animals: {1: "cat", 2: "dog", 3: "fish", 4: "hedgehog", 5: "banana slug"},
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
                        The Chooser widget wraps the <a href="https://github.com/chenglou/react-chosen">react-chosen</a> widget, which in tern wraps the <a href="http://harvesthq.github.io/chosen/">Chosen</a> widget.<br />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12">
                    <h4>Chooser</h4>

                    <p />
                    Simple chooser:
                    <Chooser initialChoiceList={this.state.animals}/>

                    <p />
                    Chooser with initial choice:
                    <Chooser initialChoice={2} initialChoiceList={this.state.animals}/>

                    <p />
                    Chooser disabled:
                    <Chooser initialChoice={2} initialChoiceList={this.state.animals} disabled={true}/>

                    <p />
                    Chooser with search disabled:
                    <Chooser initialChoice={2} initialChoiceList={this.state.animals} disableSearch={true}/>

                    <p />
                    Chooser with a required value:
                    <Chooser initialChoiceList={this.state.animals} required={true} showRequired={true} allowSingleDeselect={true} onMissingCountChange={this.handleMissingCountChange}/>
                    Missing count: {this.state.missingCount}

                    <p />
                    Chooser with single deselect:
                    <Chooser initialChoice={2} initialChoiceList={this.state.animals} disableSearch={true} allowSingleDeselect={true}/>

                    <p />
                    Chooser onChange callback:
                    <Chooser initialChoiceList={this.state.animals} onChange={this.handleChange}/>
                    Chosen: {this.state.selection} ({this.state.animals[this.state.selection]})
                    </div>

                </div>
            </div>
        );
    }
});

module.exports = ChooserExamples;
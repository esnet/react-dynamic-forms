/** @jsx React.DOM */

var React = require("react");

var {OptionButtons} = require("../../entry");

var OptionButtonsExamples = React.createClass({

    getInitialState: function() {
        return {
            choices: {1: "Yes", 2: "No", 3: "Maybe"},
            selection: 1,
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
                        <h3>Option button Examples</h3>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12">
                        <p />
                        <OptionButtons initialChoice={this.state.selection} initialChoiceList={this.state.choices} onChange={this.handleChange}/>
                        <br />
                        Selection: {this.state.selection} ({this.state.choices[this.state.selection]})
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = OptionButtonsExamples;
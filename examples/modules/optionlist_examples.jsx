/** @jsx React.DOM */

var React = require("react/addons");

var {OptionList} = require("../../entry");

var OptionListExamples = React.createClass({

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
                        <h3>List Options Example</h3>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12">
                        <form>
                        <p />
                        <OptionList choice={this.state.selection} options={this.state.choices} onChange={this.handleChange} width={300}/>
                        <br />
                        Selection: {this.state.selection} ({this.state.choices[this.state.selection]})
                        </form>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = OptionListExamples;
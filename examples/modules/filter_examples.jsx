/** @jsx React.DOM */

var React = require("react/addons");

var {TextFilter} = require("../../entry");

var FilterExamples = React.createClass({

    getInitialState: function() {
        return {
            choices: ["Red", "Green", "Blue"],
            filter: "",
        };
    },

    handleChange: function(value) {
        this.setState({"filter": value});
    },

    render: function() {
        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <h3>Tagging Example</h3>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12">
                        <form>
                        <p />
                        <TextFilter onChange={this.handleChange} width={300}/>
                        <br />
                        Filter: {this.state.filter}
                        </form>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = FilterExamples;
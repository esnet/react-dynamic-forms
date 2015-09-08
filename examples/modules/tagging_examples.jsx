"use strict";

var React = require("react");

var {TagsEdit} = require("../../index");

var TaggingExamples = React.createClass({

    getInitialState: function() {
        return {
            choices: ["Red", "Green", "Blue"],
            emptyChoices: null,
            selection: ["Green"],
        };
    },

    handleChange: function(attr, value) {
        this.setState({"selection": value});
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
                        With an initial selection:
                        <TagsEdit attr="tags" initialTags={this.state.selection}
                                  initialTagList={this.state.choices} onChange={this.handleChange} width={400}/>
                        Selection: {this.state.selection.join(", ")}

                        <hr />

                        Without no initial selection:
                        <TagsEdit attr="tags2" initialTags={null}
                                  initialTagList={this.state.choices} width={400}/>
                        <br />

                        </form>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = TaggingExamples;
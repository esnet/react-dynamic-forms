/** @jsx React.DOM */

var React = require("react");

var {Group, Chooser} = require("../../entry");

var GroupExamples = React.createClass({

    getInitialState: function() {
        return {
            animals: {1: "cat", 2: "dog", 3: "fish", 4: "hedgehog", 5: "banana slug"},
            attr: {
                name: "Animals",
                placeholder: "Pick an animal",
                help: "Some animals are small and cute.",
                disabled: false,
                initialValue: "cat",
            }
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
                        <h3>Groups</h3>

                        Groups are intended to be used with the formMixin and provide a shorthand
                        method of adding a control and its label to a form, including support for
                        managing missing and error fields automatically.

                        A group has two main purposes:<br />

                        <ul>
                            <li> Wrap a form component such that it is shown with a label
                            and arrangled within a the bootstap grid.</li>
                            <li> Except standard props that are added to each of the wrapped form 
                            components (attrName, placeholder, validation etc) as a 'attr' object.</li>
                        </ul>

                        Within ESDB we display the same form layout for each form element over and
                        over. This component is used to reduce all that boiler plate code. As such
                        this component is pretty hard coded in terms of its layout: 2 columns for
                        the label and 10 for the control.

                        The Group is also meant to be used with the formMixin. The formMixing provides
                        a getAttr() call that extracts existing formValues, meta info such as label
                        name, placeholder name. In addition it also supplies callbacks for missing
                        and error counts as well as value changed that are attached to functions that
                        alter the mixin state.

                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12">
                        <p />
                        Here is an example of the generic Group being used with a Chooser:
                        <p />
                        <Group attr={this.state.attr} >
                            <Chooser initialChoiceList={this.state.animals}/>
                        </Group>

                    </div>
                </div>
            </div>
        );
    }
});

module.exports = GroupExamples;
/**
 *  Copyright (c) 2015, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import React from "react";
import _ from "underscore";
import Group from "../../src/group";
import Chooser from "../../src/chooser";

// Data
const animalMap = {1: "dog", 2: "duck", 3: "cat", 4: "donkey",
                   5: "fish", 6: "hedgehog", 7: "banana slug"};

export default React.createClass({

    getInitialState() {
        return {
            animalList: _.map(animalMap, function(value, key) {
                return {id: key, label: value}
            }),
            attr: {
                name: "Animals",
                placeholder: "Pick an animal",
                help: "Some animals are small and cute.",
                disabled: false,
                initialValue: "cat",
            }
        };
    },

    handleChange(attr, value) {
        this.setState({"selection": value});
    },

    handleMissingCountChange(attr, count) {
        this.setState({"missingCount": count});
    },

    render() {
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
                            and arranged within a bootstrap grid layout.</li>
                            <li> Expect standard props that are added to each of the wrapped form
                            components (attrName, placeholder, validation etc) as a 'attr' object.</li>
                        </ul>

                        Within ESDB we display the same form layout for each form element over and
                        over. This component is used to reduce all that boiler plate code. As such
                        this component is pretty hard coded in terms of its layout: 2 columns for
                        the label and 10 for the control.

                        The Group is also meant to be used with the formMixin. The formMixin provides
                        a getAttr() call that extracts data such as existing formValues, meta info such as label
                        name, placeholder name, etc. In addition it also supplies callbacks for missing
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
                            <Chooser initialChoiceList={this.state.animalList} initialChoice={4}/>
                        </Group>

                    </div>
                </div>
            </div>
        );
    }
});

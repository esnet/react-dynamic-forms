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
import OptionList from "../../src/optionlist";

export default React.createClass({

    getInitialState() {
        return {
            choices: {1: "Yes", 2: "No", 3: "Maybe"},
            selection: 1,
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

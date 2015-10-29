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
import TextFilter from "../../src/textfilter";

export default React.createClass({

    getInitialState() {
        return {
            choices: ["Red", "Green", "Blue"],
            filter: "",
        };
    },

    handleChange(value) {
        this.setState({"filter": value});
    },

    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <h3>Filter Example</h3>
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

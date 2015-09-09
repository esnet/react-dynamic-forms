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
import NavItems from "../../src/navitems";

export default React.createClass({

    getInitialState() {
        return {
            data: {summary: {label: "Summary"},
                   circuit: {label: "Circuits"},
                   diagrams: {label: "Diagrams"}
                  },
            active: "Summary",
        };
    },

    handleChange(value) {
        this.setState({"active": value});
    },

    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <h3> NavItem Button Examples</h3>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <NavItems active={this.state.active} 
                                  navItems={this.state.data}
                                  onChange={this.handleChange}/>
                        <br />
                        Selection: {this.state.active}
                    </div>
                </div>
            </div>
        );
    },
});

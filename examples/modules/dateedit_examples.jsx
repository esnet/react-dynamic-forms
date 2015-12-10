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
import moment from "moment";
import DateEdit from "../../src/dateedit";

export default React.createClass({

    getInitialState() {
        const today = new Date();
        return {
            missing: 0,
            value: today
        };
    },

    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <h3>DateEdit Examples</h3>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12">

                        <hr />

                        Date editor, with default value:
                        <p />
                        <DateEdit showRequired={true} required={true} initialValue={new Date()} />

                        Date editor, with no default value, but required:
                        <p />
                        <DateEdit showRequired={true} required={true} />

                        Date editor, with no default value and not required:
                        <p />
                        <DateEdit required={false} />

                        Date editor with value callback:
                        <p />
                        <DateEdit
                            attr="expires"
                            showRequired={true}
                            required={true}
                            initialValue={this.state.value}
                            onChange={(attr, value) => this.setState({attr, value})}
                            onMissingCountChange={(attr, missing) => this.setState({missing})} />
                        <span>{`Value: ${this.state.value} (attr is ${this.state.attr})`}</span>
                        <br />
                        <span>{`Missing: ${this.state.missing}`}</span>
                    </div>

                </div>
            </div>
        );
    }
});

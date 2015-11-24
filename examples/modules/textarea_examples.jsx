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
import TextArea from "../../src/textarea";

export default React.createClass({

    getInitialState() {
        return {
            errorCount: 0,
            missingCount: 0
        };
    },

    handleErrorCountChange(attr, errorCount) {
        this.setState({errorCount});
    },

    handleMissingCountChange(attr, missingCount) {
        this.setState({missingCount});
    },

    render() {
        const text = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
anim id est laborum.`;
        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <h3>TextArea Examples</h3>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12">

                    <hr />
                    <h4>Basic examples</h4>

                    Simple single line text input, with default value:
                    <p />
                    <TextArea initialValue={text} rows={6} width={300} />

                    Disabled:
                    <p />
                    <TextArea initialValue={text} disabled={true}/>

                    Placeholder:
                    <p />
                    <TextArea placeholder="The description will go here!"/>

                    <hr />
                    <h4>Errors and missing values</h4>

                    Required field (with showRequired turned ON):
                    <p />
                    <TextArea required={true} showRequired={true}/>

                    Required field (with showRequired turned OFF):
                    <p />
                    <TextArea required={true} showRequired={false}/>

                    Required field (with showRequired turned ON and initial value):
                    <p />
                    <TextArea initialValue={text} required={true} showRequired={true}/>

                    Validated field (email address):
                    <p />
                    <TextArea initialValue="bob.at.gmail.com" rules={{format: "email"}}/>

                    <hr />
                    <h4>Callbacks</h4>

                    Validated field (email address) with error callback:
                    <p />
                    <TextArea initialValue="bob.at.gmail.com" onErrorCountChange={this.handleErrorCountChange} rules={{format: "email"}}/>
                    Error count: {this.state.errorCount}
                    <p />

                    Required field (with showRequired turned on) with missing count callback:
                    <p />
                    <TextArea required={true} showRequired={true} onMissingCountChange={this.handleMissingCountChange}/>
                    Missing count: {this.state.missingCount}
                    <p />

                    </div>
                </div>
            </div>
        );
    }
});

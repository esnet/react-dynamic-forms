/**
 *  Copyright (c) 2017, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import React from "react";
import {
    TestBasic // TextEditDisabled, // TextEditPlaceholder,
} from // TextEditPassword,
// TextEditRequired1,
// TextEditRequired2,
// TextEditRequired3,
// TextEditValidate,
// TextEditValidateInt
"./components_test/TextEditExamples";

export default React.createClass({
    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <h3>TextEdit Tests</h3>
                        TextEdit initial value
                        <TestBasic />
                        {/*}
            Diabled TextEdit
            <TextEditDisabled />
            With a placeholder
            <TextEditPlaceholder />
            Password type
            <TextEditPassword />
            Required field (with showRequired turned ON):
            <TextEditRequired1 />
            Required field (with showRequired turned OFF):
            <TextEditRequired2 />
            Required field (with showRequired turned ON and initial value):
            <TextEditRequired3 />
            Validated field (email address)
            <TextEditValidate />
            Validated field (integer)
            <TextEditValidateInt /> */}
                    </div>
                </div>
            </div>
        );
    }
});

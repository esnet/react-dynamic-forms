/**
 *  Copyright (c) 2017 - present, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import React from "react";
import TextEdit from "../../src/components/TextEdit";

export class TestBasic extends React.Component {
    render() {
        const attr = {
            name: "Basic"
        };
        return <TextEdit attr={attr} value="Bob" width={300} />;
    }
};
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
    ChooserBasic,
    ChooserWider,
    ChooserSortedList,
    ChooserInitialValue,
    ChooserInitialNull,
    ChooserSortedInitial,
    ChooserDisabled,
    ChooserSearchDisabled,
    ChooserSingleDeselect,
    ChooserLongList
} from "./components_test/ChooserExamples";

export default React.createClass({
    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <h3>Chooser Tests</h3>
                        Chooser with simple list
                        <ChooserBasic />
                        Wider chooser
                        <ChooserWider />
                        Chooser with a sorted list
                        <ChooserSortedList />
                        Chooser with initial value
                        <ChooserInitialValue />
                        Chooser with a null initial value
                        <ChooserInitialNull />
                        Chooser with sorted list and initial value
                        <ChooserSortedInitial />
                        Disabled chooser
                        <ChooserDisabled />
                        Chooser with no search
                        <ChooserSearchDisabled />
                        Chooser allowing clearing single selection
                        <ChooserSingleDeselect />
                        Chooser with a very long list
                        <ChooserLongList />
                    </div>
                </div>
            </div>
        );
    }
});

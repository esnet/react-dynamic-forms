/**
 *  Copyright (c) 2015 - present, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import React from "react";

import formGroup from "../js/formGroup";

class View extends React.Component {
    render() {
        const text = this.props.value;
        const view = this.props.view;
        let color = "";
        let background = "";
        const style = {
            color,
            background,
            // height: 23,
            height: "100%",
            width: "100%",
            paddingLeft: 3
        };
        if (!view) {
            return (
                <div style={style}>
                    {text}
                </div>
            );
        } else {
            return (
                <div style={style}>
                    {view(text)}
                </div>
            );
        }
    }
}

export default formGroup(View, true);
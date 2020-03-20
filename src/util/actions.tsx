/**
 *  Copyright (c) 2018 - present, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */
import Octicon, { Info, Pencil } from "@primer/octicons-react";
import React from "react";

export function editAction(enabled: any, handler: any) {
    let action = <span />;
    if (enabled) {
        action = (
            <span onClick={handler} className="icon edit-action" style={{ paddingLeft: 5 }}>
                <Octicon icon={Pencil} size="small" verticalAlign="middle" />
            </span>
        );
    } else {
        action = <div />;
    }
    return action;
}

export function helpAction(enabled: any, handler: any) {
    let action = <span />;
    if (enabled) {
        action = (
            <span onClick={handler} className="icon help-action" style={{ paddingLeft: 5 }}>
                <Octicon icon={Info} size="small" verticalAlign="middle" />
            </span>
        );
    } else {
        action = <div />;
    }
    return action;
}

/**
 *  Copyright (c) 2018 - present, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import _ from "underscore";
import React from "react";
import Markdown from "react-markdown";

export function textView(value) {
    return <span style={{ minHeight: 28 }}>{value}</span>;
}

export function linkView(value) {
    return (
        <span style={{ minHeight: 28 }}>
            <a>{value}</a>
        </span>
    );
}

export function markdownView(value) {
    console.log(value);
    if (value === "" || _.isUndefined(value)) {
        return <div style={{ height: 28 }} />;
    } else {
        return (
            <span style={{ minHeight: 28 }}>
                <Markdown source={value} />
            </span>
        );
    }
}

export function dateView(fmt = "MM/DD/YYYYY") {
    return function(d) {
        const s = d ? d.format(fmt) : "";
        return <span style={{ minHeight: 28 }}>{s}</span>;
    };
}

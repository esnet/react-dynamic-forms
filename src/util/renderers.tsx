/**
 *  Copyright (c) 2018 - present, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import React from "react";

export function textView(value: string) {
    return <span style={{ minHeight: 28 }}>{value}</span>;
}

export function linkView(value: string) {
    return (
        <span style={{ minHeight: 28 }}>
            <a>{value}</a>
        </span>
    );
}

// export function markdownView(value) {
//     if (value === "" || _.isUndefined(value)) {
//         return <div style={{ height: 28 }} />;
//     } else {
//         return (
//             <span style={{ minHeight: 28 }}>
//                 <Markdown source={value} />
//             </span>
//         );
//     }
// }

export function dateView(fmt = "MM/DD/YYYYY") {
    return function(d: any) {
        const s = d ? d.format(fmt) : "";
        return <span style={{ minHeight: 28 }}>{s}</span>;
    };
}

export function colorView(hex: string) {
    return (
        <span>
            <div
                style={{
                    marginTop: 4,
                    width: 14,
                    height: 14,
                    borderRadius: 2,
                    background: hex,
                    float: "left"
                }}
            />
        </span>
    );
}

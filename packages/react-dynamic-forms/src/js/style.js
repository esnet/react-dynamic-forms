/**
 *  Copyright (c) 2018 - present, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

const LINE_HEIGHT = 23;
const LEFT_SPACING = 3;

export const colors = {
    ERROR_COLOR: "#b94a48",
    ERROR_COLOR_BG: "#fff0f3",
    MISSING_COLOR_BG: "floralwhite"
};

export function inlineStyle(hasError, isMissing) {
    let color = "inherited";
    let background = "inherited";
    if (hasError) {
        color = colors.ERROR_COLOR;
        background = colors.ERROR_COLOR_BG;
    } else if (isMissing) {
        background = colors.MISSING_COLOR_BG;
    }
    return {
        color,
        background,
        width: "100%",
        height: LINE_HEIGHT,
        paddingLeft: LEFT_SPACING
    };
}

export function inlineTextAreaStyle(hasError, isMissing) {
    let color = "";
    let background = "";
    if (hasError) {
        color = colors.ERROR_COLOR;
        background = colors.ERROR_COLOR_BG;
    } else if (isMissing) {
        background = colors.MISSING_COLOR_BG;
    }
    return {
        color,
        background,
        height: "100%",
        width: "100%",
        paddingLeft: LEFT_SPACING
    };
}

export function inlineChooserStyle(hasError, isMissing, isView) {
    let color = "";
    let background = "";
    if (hasError) {
        color = colors.ERROR_COLOR;
        background = colors.ERROR_COLOR_BG;
    } else if (isMissing) {
        background = colors.MISSING_COLOR_BG;
    }

    if (isView) {
        return {
            color,
            background,
            minHeight: LINE_HEIGHT,
            width: "100%",
            paddingLeft: LEFT_SPACING
        };
    } else {
        return {
            color,
            background,
            height: LINE_HEIGHT,
            width: "100%",
            paddingLeft: LEFT_SPACING
        };
    }
}

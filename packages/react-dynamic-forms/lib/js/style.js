"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.inlineStyle = inlineStyle;
exports.inlineTextAreaStyle = inlineTextAreaStyle;
exports.inlineChooserStyle = inlineChooserStyle;
/**
 *  Copyright (c) 2018 - present, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

var LINE_HEIGHT = 23;
var LEFT_SPACING = 3;

var colors = exports.colors = {
    ERROR_COLOR: "#b94a48",
    ERROR_COLOR_BG: "#fff0f3",
    MISSING_COLOR_BG: "floralwhite"
};

function inlineStyle(hasError, isMissing) {
    var color = "inherited";
    var background = "inherited";
    if (hasError) {
        color = colors.ERROR_COLOR;
        background = colors.ERROR_COLOR_BG;
    } else if (isMissing) {
        background = colors.MISSING_COLOR_BG;
    }
    return {
        color: color,
        background: background,
        width: "100%",
        height: LINE_HEIGHT,
        paddingLeft: LEFT_SPACING
    };
}

function inlineTextAreaStyle(hasError, isMissing) {
    var color = "";
    var background = "";
    if (hasError) {
        color = colors.ERROR_COLOR;
        background = colors.ERROR_COLOR_BG;
    } else if (isMissing) {
        background = colors.MISSING_COLOR_BG;
    }
    return {
        color: color,
        background: background,
        height: "100%",
        width: "100%",
        paddingLeft: LEFT_SPACING
    };
}

function inlineChooserStyle(hasError, isMissing, isView) {
    var color = "";
    var background = "";
    if (hasError) {
        color = colors.ERROR_COLOR;
        background = colors.ERROR_COLOR_BG;
    } else if (isMissing) {
        background = colors.MISSING_COLOR_BG;
    }

    if (isView) {
        return {
            color: color,
            background: background,
            minHeight: LINE_HEIGHT,
            width: "100%",
            paddingLeft: LEFT_SPACING
        };
    } else {
        return {
            color: color,
            background: background,
            height: LINE_HEIGHT,
            width: "100%",
            paddingLeft: LEFT_SPACING
        };
    }
}
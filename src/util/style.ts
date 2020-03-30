/**
 *  Copyright (c) 2018 - present, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */
import _ from "lodash";

const LINE_HEIGHT = 23;
const LEFT_SPACING = 3;

export const colors = {
    ERROR_COLOR: "#b94a48",
    ERROR_COLOR_BG: "#fff0f3",
    MISSING_COLOR_BG: "floralwhite",
    PRIMARY_ACTION_COLOR: "#2379c1",
    PRIMARY_ACTION_COLOR_DISABLED: "#2379c169",
    SECONDARY_ACTION_COLOR: "#AAA"
};

export function inlineDoneButtonStyle(marginLeft: number, enabled: boolean) {
    const isEnabled = _.isUndefined(enabled) ? true : enabled;
    return {
        padding: 5,
        marginLeft,
        fontSize: 12,
        height: 30,
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "rgba(70, 129, 180, 0.19)",
        borderRadius: 2,
        color: isEnabled ? colors.PRIMARY_ACTION_COLOR : colors.PRIMARY_ACTION_COLOR_DISABLED,
        cursor: "pointer"
    };
}

export function inlineCancelButtonStyle() {
    return {
        padding: 5,
        marginLeft: 3,
        marginBottom: 5,
        height: 30,
        color: colors.SECONDARY_ACTION_COLOR,
        cursor: "pointer",
        fontSize: 12
    };
}

export function inlineStyle(hasError: boolean, isMissing: boolean) {
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

export function inlineTextAreaStyle(
    hasError: boolean,
    isMissing: boolean,
    isCustomView: boolean = false
) {
    let color = "";
    let background = isCustomView ? "" : "#FAFAFA";
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
        minHeight: 28,
        paddingLeft: LEFT_SPACING,
        fontWeight: 200,
        borderRadius: 3
    };
}

export function inlineChooserStyle(hasError: boolean, isMissing: boolean, isView: boolean) {
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

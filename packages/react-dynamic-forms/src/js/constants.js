/**
 *  Copyright (c) 2017 - present, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import keymirror from "keymirror";

module.exports = {
    /**
     * At Form can either:
     *   * ALL - Always show edit state for all of its fields
     *   * SELECTION -  Show edit icons next to items, selecting one show edit state for that item
     *   * NEVER - Never show edit state for the items (view only)
     */
    FormEditStates: keymirror({
        ALWAYS: null,
        SELECTED: null,
        NEVER: null,
        TABLE: null
    }),

    FormGroupLayout: keymirror({
        ROW: null,
        COLUMN: null,
        INLINE: null
    })
};

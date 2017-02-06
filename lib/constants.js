"use strict";

var _keymirror = require("keymirror");

var _keymirror2 = _interopRequireDefault(_keymirror);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
    /**
     * At Form can either:
     *   * ALL - Always show edit state for all of its fields
     *   * SELECTION -  Show edit icons next to items, selecting one show edit state for that item
     *   * NEVER - Never show edit state for the items (view only)
     */
    FormEditStates: (0, _keymirror2.default)({
        ALWAYS: null,
        SELECTED: null,
        NEVER: null,
        TABLE: null
    })
};
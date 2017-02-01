import keymirror from "keymirror";

module.exports = {
    /**
     * At Form can either:
     *   * ALL - Always show edit state for all of its fields
     *   * SELECTION -  Show edit icons next to items, selecting one show edit state for that item
     *   * NEVER - Never show edit state for the items (view only)
     */
    FormEditStates: keymirror({ ALWAYS: null, SELECTED: null, NEVER: null })
};


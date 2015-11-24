/**
 *  Copyright (c) 2015, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import React from "react";
import TagsEdit from "../../src/tagsedit";

export default React.createClass({

    getInitialState() {
        return {
            choices: ["Red", "Green", "Blue"],
            emptyChoices: null,
            selection: ["Green"]
        };
    },

    handleChange(attr, value) {
        this.setState({selection: value});
    },

    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <h3>Tagging Example</h3>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12">
                        <form>
                        <p />
                        With an initial selection:
                        <TagsEdit
                            attr="tags"
                            initialTags={this.state.selection}
                            initialTagList={this.state.choices}
                            onChange={this.handleChange}
                            width={400} />
                        Selection: {this.state.selection.join(", ")}

                        <hr />

                        Without no initial selection:
                        <TagsEdit
                            attr="tags2"
                            initialTags={null}
                            initialTagList={this.state.choices}
                            width={400} />
                        <br />

                        </form>
                    </div>
                </div>
            </div>
        );
    }
});

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

/**
 * Search text extry box.
 */
export default React.createClass({

    displayName: "SearchBox",

    getInitialState() {
        return {value: this.props.initialValue};
    },

    onSubmit() {
        const val = this.refs.search.getDOMNode().value;

        this.setState({value: val});

        // Callback
        if (this.props.onSubmit) {
            this.props.onSubmit(val);
        }
    },

    render() {
        return (
            <form onSubmit={this.onSubmit}>
                <div className="input-group">
                    <input className="form-control"
                           type="search"
                           ref="search"
                           placeholder="Search"
                           defaultValue={this.state.value} >
                    </input>
                    <span className="input-group-addon" onClick={this.onSubmit}>
                        <span className="glyphicon glyphicon-search"></span>
                    </span>
                </div>
            </form>
        );
    }
});

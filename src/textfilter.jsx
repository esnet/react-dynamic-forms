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
 * Filter text extry box.
 */
export default React.createClass({

    displayName: "TextFilter",

    getDefaultProps() {
        return {width: "100%"};
    },

    getInitialState() {
        return {value: this.props.initialValue};
    },

    onChange(e) {
        this.setState({value: e.target.value});
        if (this.props.onChange) {
            this.props.onChange(e.target.value);
        }
    },

    render() {
        const style = {
            height: 27,
            marginTop: 1,
            width: this.props.width
        };

        return (
            <div className="input-group" style={style}>
                <input className="form-control"
                       type="text"
                       ref="filter"
                       placeholder="Filter"
                       defaultValue={this.state.value}
                       onChange={this.onChange}>
                </input>
                <span className="input-group-addon">
                    <span className="glyphicon glyphicon-filter"></span>
                </span>
            </div>
        );
    }
});

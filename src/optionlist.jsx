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
import _ from "underscore";

import "./listoptions.css";

export default React.createClass({

    displayName: "OptionList",

    getInitialState() {
        return {value: this.props.choice};
    },

    handleChange(e) {
        const value = e.target.value;
        const missing = this.props.required && this._isEmpty(value);

        // State changes
        this.setState({value: e.target.value,
                       missing: missing});

        // Callbacks
        if (this.props.onChange) {
            this.props.onChange(this.props.attr, e.target.value);
        }
    },

    render() {
        const classes = "list-group";

        if (!this.props.options) {
            console.warn("No initial choice list supplied for attr", this.props.attr);
        }

        const listElements = _.map(this.props.options, (option, i) => {
            if (this.props.choice === Number(i)) {
                return (
                    <li className="list-group-item active"
                        key={i}
                        value={i}
                        onClick={this.handleChange}>
                        {option}
                    </li>
                );
            } else {
                return (
                    <li className="list-group-item"
                        key={i}
                        value={i}
                        onClick={this.handleChange}>
                        {option}
                    </li>
                );
            }
        });

        const style = this.props.width ? {width: this.props.width} : {};

        // Key based on the choice list
        const choiceList = _.map(this.props.options, choice => choice);
        const list = choiceList.join("-");

        return (
            <ul className={classes} style={style} key={list}>
                {listElements}
            </ul>
        );
    }
});

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
import {Nav, NavItem} from "react-bootstrap";

export default React.createClass({
    
    displayName: "NavItems",

    getInitialState() {
        return {"active": this.props.active};
    },

    handleSelect(key) {
        if (this.props.onChange) {
            this.props.onChange(key)
        }
    },

    render() {
        const navElements = _.map(this.props.navItems, (item) => {
            const label = item["label"];
            if (_.has(item, "url")) {
                const url = item["url"];
                return (
                    <NavItem eventKey={label} href={url}>{label}</NavItem>
                );

            } else {
                return (
                    <NavItem eventKey={label} onSelect={this.handleSelect}>{label}</NavItem>
                );
            };
        });

        return (
            <div>
                <Nav bsStyle='pills' activeKey={this.props.active}>
                    {navElements}
                </Nav>
            </div>
        );
    },
});

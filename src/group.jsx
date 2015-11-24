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
import classNames from "classnames";

import "./group.css";

/**
 * Example:
 *  <Group attr={this.getAttr("contact_type")} >
 *      <Chooser initialChoice={contactType} initialChoiceList={contactTypes} disableSearch={true}/>
 *  </Group>
 */
export default React.createClass({

    displayName: "Group",

    render() {
        const attr = this.props.attr;

        if (!attr) {
            throw new Error("Group: Attr not found");
        }

        const hidden = attr.hidden || false;

        if (hidden) {
            return (
                <div />
            );
        }

        // Control
        const props = {
            attr: attr.attr,
            key: attr.key,
            ref: attr.attr,
            disabled: attr.disabled,
            placeholder: attr.placeholder,
            rules: attr.validation,
            required: attr.required,
            showRequired: attr.showRequired,
            onErrorCountChange: attr.errorCountCallback,
            onMissingCountChange: attr.missingCountCallback,
            onChange: attr.changeCallback,
            validator: this.props.validator
        };

        const child = React.Children.only(this.props.children);
        const childControl = React.cloneElement(child, props);

        const control = (
            <div className="col-sm-9">
                {childControl}
            </div>
        );

        //
        // Required
        //

        let required;
        if (attr.required) {
            required = (
                <span className="group-required" style={{paddingLeft: 3}}>*</span>
            );
        } else {
            required = (
                <span>&nbsp;</span>
            );
        }

        //
        // Label
        //

        const labelText = attr.name;
        const labelClasses = classNames({
            "group-label": true,
            "col-sm-3": true,
            required: attr.required
        });
        const label = (
            <div className={labelClasses} style={{whiteSpace: "nowrap"}}>
                <label muted={attr.disabled} htmlFor={attr.key}>{labelText}</label>
                {required}
            </div>
        );

        // Group
        return (
            <div className="form-group row">
                {label} {control}
            </div>
        );
    }
});

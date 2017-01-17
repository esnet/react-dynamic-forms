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
import FlexBox from "react-flexbox";

import "./group.css";

/**
 * Example:
 *  <Group attr={this.getAttr("contact_type")} >
 *      <Chooser initialChoice={contactType} initialChoiceList={contactTypes} disableSearch={true}/>
 *  </Group>
 */
export default React.createClass({

    displayName: "Group",

    getDefaultProps() {
        return {
            inline: false
        };
    },

    getInitialState() {
        return {
            edit: !this.props.inline,
            editHover: false,
            missing: true
        };
    },

    handleEdit() {
        const edit = !this.state.edit;
        this.setState({edit});
    },

    handleMissingCountChange(attr, attrName, value) {
        if (attr.missingCountCallback) {
            attr.missingCountCallback(attrName, value);
        }
        this.setState({missing: value > 0});
    },

    handleValueChange(attr, attrName, value) {
        if (attr.changeCallback) {
            attr.changeCallback(attrName, value);
        }

        if (this.props.inline) {
            this.setState({edit: false});
        }
    },

    handleCancelEdit() {
        if (this.props.inline) {
            this.setState({edit: false});
        }
    },

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
            showRequired: this.props.inline ? true : attr.showRequired,
            onErrorCountChange: attr.errorCountCallback,
            onMissingCountChange: (a, v) => this.handleMissingCountChange(attr, a, v),
            onChange: (a, v) => this.handleValueChange(attr, a, v),
            validator: this.props.validator,
            autofocus: this.props.inline && this.state.edit,
            onCancel: this.props.inline ? this.handleCancelEdit : null
        };

        const child = React.Children.only(this.props.children);
        const childControl = React.cloneElement(child, props);

        //
        // Edit for inlines
        //

        let editAction = null;
        if (this.props.inline && !this.state.edit) {
            editAction = (
                <span
                    style={{paddingLeft: 10}}
                    className="glyphicon glyphicon-pencil"
                    onClick={this.handleEdit}>
                </span>
            );
        }

        //
        // Control or view
        //


        const controlStyle = {
            justifyContent: "flex-start"
        };

        let control;
        if (this.state.edit) {
            control = (
                <FlexBox row style={controlStyle}>
                    <FlexBox column width={1}>
                        {childControl}
                    </FlexBox>
                </FlexBox>
            );
        } else {
            control = (
                <FlexBox row style={controlStyle}>
                    <FlexBox column width={0}>
                        <span style={{paddingLeft: 10}}>
                            {
                                this.props.display ?
                                this.props.display : attr.value
                            }
                        </span>
                    </FlexBox>
                    <FlexBox column width="20px">
                        {editAction}
                    </FlexBox>
                </FlexBox>
            );
        }

        //
        // Required state for non-inlines
        //

        let required;
        if ((!this.props.inline || this.state.edit) && attr.required) {
            const className = this.state.missing ?
                "group-required" : "group-required fulfilled";
            required = (
                <span className={className} style={{paddingLeft: 3}}>*</span>
            );
        } else {
            required = (
                <span>&nbsp;</span>
            );
        }

        //
        // Label
        //

        const labelStyle = {
            justifyContent: "flex-start",
            textAlign: "right",
            paddingRight: 0,
            paddingTop: 3,
            paddingBottom: 3,
            textTransform: "uppercase",
            fontSize: "smaller"
        };

        const label = (
            <FlexBox row style={labelStyle}>
                <FlexBox column width={0}>
                    <label
                        muted={attr.disabled}
                        htmlFor={attr.key}>
                        {attr.name}
                    </label>
                </FlexBox>
                <FlexBox column width="20px">
                    {required}
                </FlexBox>
            </FlexBox>
        );

        // Group
        return (
            <FlexBox row>
                <FlexBox column width="160px">{label}</FlexBox>
                <FlexBox column width={1}>{control}</FlexBox>
            </FlexBox>
        );
    }
});

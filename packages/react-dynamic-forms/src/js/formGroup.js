/**
 *  Copyright (c) 2015 - present, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import React from "react";
import Flexbox from "flexbox-react";
import classNames from "classnames";

import { FormGroupLayout } from "../js/constants";

import "../css/group.css";
import "../css/icon.css";

/**
 * Groups are intended to be used within the `Form` and provide a shorthand
 * method of adding a widget and its label to a form, including support for
 * managing missing and error fields automatically and inline editing.
 *
 * A group has two main purposes:
 *
 *  * Wrap a form widget such that it is shown with a label and arranged
 *    within a flexbox horizontal layout.
 *  * Expect standard props that are added to each of the wrapped form
 *    components (attrName, placeholder, validation etc) as a 'attr' object.
 *
 * Within ESDB we display the same form layout for each form element over and over.
 * This component is used to reduce all that boiler plate code. As such this
 * component is pretty hard coded in terms of its layout. The Group is also meant
 * to be used with a `Form`. This provides a `getAttrProps()` call that extracts
 * data such as existing formValues, meta info such as label name, placeholder
 * name, etc. In addition it also supplies callbacks for missing and error counts
 * as well as value changed that are attached to functions that callback into the
 * users code.
 */

export default function formGroup(Widget, hideEdit) {
    return class Group extends React.Component {
        constructor(props) {
            super(props);
            this.state = { over: false };
        }

        selectItem(attrName) {
            if (this.props.onSelectItem) {
                this.props.onSelectItem(attrName);
            }
        }

        handleMouseEnter() {
            this.setState({ over: true });
        }

        handleMouseLeave() {
            this.setState({ over: false });
        }

        render() {
            const { hidden = false, width, allowEdit, ...props } = this.props;
            const {
                name,
                label,
                key,
                edit,
                disabled,
                required,
                showRequired,
                onSelectItem
            } = props;

            const selectStyle = {};

            //
            // Hidden
            //
            if (hidden) {
                return <div />;
            }

            //
            // Widget
            //

            const widgetWidth = width ? `${width}px` : "100%";
            const widget = (
                <div
                    style={{
                        width: widgetWidth
                    }}
                >
                    <Widget {...props} />
                </div>
            );

            //
            // Required
            //
            let requiredMarker;
            if (required && showRequired) {
                requiredMarker = (
                    <span className="group-required" style={{ paddingLeft: 3 }}>*</span>
                );
            } else {
                requiredMarker = <span />;
            }

            //
            // Label
            //
            const labelClasses = classNames({
                "group-label": true,
                required
            });
            let marginLeft = "auto";
            if (this.props.layout === FormGroupLayout.COLUMN) {
                marginLeft = null;
            }
            const fieldLabel = (
                <div
                    className={labelClasses}
                    style={{
                        whiteSpace: "nowrap",
                        marginLeft,
                        paddingTop: 3,
                        color: this.state.error ? "b94a48" : "inherit"
                    }}
                >
                    <label muted={disabled} htmlFor={key}>{label}</label>
                </div>
            );
            const labelWidth = this.props.labelWidth ? `${this.props.labelWidth}px` : "300px";

            //
            // Edit
            //

            const isBeingEdited = edit;

            const flip = {
                transform: "scaleX(-1)",
                fontSize: 11
            };

            let editIcon = <span />;
            if (this.state.over && allowEdit && !hideEdit) {
                editIcon = (
                    <i
                        style={flip}
                        className={
                            isBeingEdited
                                ? "glyphicon glyphicon-pencil icon edit-action active"
                                : "glyphicon glyphicon-pencil icon edit-action"
                        }
                        onClick={() => onSelectItem ? onSelectItem(name) : null}
                    />
                );
            }

            // Group
            if (this.props.layout === FormGroupLayout.INLINE) {
                return (
                    <Flexbox
                        flexDirection="column"
                        width={widgetWidth}
                        onMouseEnter={() => this.handleMouseEnter()}
                        onMouseLeave={() => this.handleMouseLeave()}
                    >
                        {widget}
                    </Flexbox>
                );
            } else if (this.props.layout === FormGroupLayout.COLUMN) {
                return (
                    <Flexbox
                        flexDirection="column"
                        onMouseEnter={() => this.handleMouseEnter()}
                        onMouseLeave={() => this.handleMouseLeave()}
                    >
                        <Flexbox
                            flexDirection="row"
                            onMouseEnter={() => this.handleMouseEnter()}
                            onMouseLeave={() => this.handleMouseLeave()}
                        >
                            <Flexbox>
                                {fieldLabel}
                            </Flexbox>
                            <Flexbox minWidth="14px" width="14px">
                                {requiredMarker}
                            </Flexbox>
                            <Flexbox minWidth="18px" width="18px" style={selectStyle}>
                                {editIcon}
                            </Flexbox>
                        </Flexbox>
                        <Flexbox
                            flexDirection="row"
                            onMouseEnter={() => this.handleMouseEnter()}
                            onMouseLeave={() => this.handleMouseLeave()}
                        >
                            <Flexbox flexGrow={1} style={selectStyle}>
                                {widget}
                            </Flexbox>
                        </Flexbox>
                    </Flexbox>
                );
            } else {
                return (
                    <Flexbox
                        flexDirection="row"
                        onMouseEnter={() => this.handleMouseEnter()}
                        onMouseLeave={() => this.handleMouseLeave()}
                    >
                        <Flexbox minWidth={labelWidth} width={labelWidth}>
                            {fieldLabel}
                        </Flexbox>
                        <Flexbox minWidth="14px" width="14px">
                            {requiredMarker}
                        </Flexbox>
                        <Flexbox minWidth="18px" width="18px" style={selectStyle}>
                            {editIcon}
                        </Flexbox>
                        <Flexbox
                            width={widgetWidth}
                            style={selectStyle}
                            onDoubleClick={() =>
                                onSelectItem && !isBeingEdited ? onSelectItem(name) : null}
                        >
                            {widget}
                        </Flexbox>
                        <Flexbox flexGrow={1} />
                    </Flexbox>
                );
            }
        }
    };
}

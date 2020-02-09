/**
 *  Copyright (c) 2015 - present, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import classNames from "classnames";
import Immutable from "immutable";
import _ from "lodash";
import React, { useState } from "react";
import "../style/group.css";
import "../style/icon.css";
import { FormGroupLayout } from "../util/constants";

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

// TODO: hover mouse events couldn't be added onto flexbox elements
// TODO: disabled muted label before but types don't match there

export interface FormGroupProps {
    field: string;
    hidden?: boolean;
    width?: number;
    name?: string;
    label?: string;
    labelWidth?: number;
    key?: string;
    edit?: boolean;
    disabled?: boolean;
    required?: boolean;
    error?: boolean;
    showRequired?: boolean;
    onSelectItem?: (name: string | undefined) => any;
    value?: string | number;
    initialValue?: string | number;
    layout?: string; // enum?
}

export interface FormGroupState {
    error: boolean;
    over: boolean;
}

export function formGroup(Control: any) {
    return (props: FormGroupProps) => {
        const handleMouseEnter = () => setOver(true);
        const handleMouseLeave = () => setOver(false);

        const [, setOver] = useState<boolean>(false);
        const [error] = useState<boolean>(false);

        const {
            name,
            label,
            key,
            edit,
            // disabled,
            required,
            showRequired,
            onSelectItem,
            value,
            initialValue,
            layout,
            labelWidth,
            width,
            hidden = false
        } = props;

        const isBeingEdited = edit;
        const hasChanged = _.isNull(initialValue) ? false : !Immutable.is(value, initialValue);

        const selectStyle = {};

        //
        // Hidden
        //
        if (hidden) {
            return <div />;
        }

        //
        // Control
        //

        const controlWidth = width ? width : "100%";
        const control = (
            <div
                style={{
                    width: controlWidth,
                    margin: 2,
                    cursor: "pointer"
                }}
            >
                <Control {...props} onEditItem={onSelectItem} />
            </div>
        );

        //
        // Required
        //
        let requiredMarker;
        if (required && showRequired) {
            requiredMarker = (
                <span className="group-required" style={{ paddingLeft: 3 }}>
                    *
                </span>
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
        let marginLeft: string | undefined = "auto";
        if (layout === FormGroupLayout.COLUMN) {
            marginLeft = undefined;
        }

        let labelColor = "inherit";
        if (error) {
            labelColor = "b94a48";
        } else if (hasChanged) {
            labelColor = "steelblue";
        }

        const fieldLabel = (
            <div
                className={labelClasses}
                style={{
                    color: labelColor,
                    marginLeft,
                    paddingTop: 5,
                    whiteSpace: "nowrap"
                }}
            >
                <label htmlFor={key}>{label}</label>
            </div>
        );

        const labelSize = labelWidth ? `${labelWidth}px` : "300px";

        // Group
        switch (props.layout) {
            case FormGroupLayout.INLINE:
                return (
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            width: controlWidth
                        }}
                        onMouseEnter={() => handleMouseEnter()}
                        onMouseLeave={() => handleMouseLeave()}
                    >
                        {control}
                    </div>
                );
            case FormGroupLayout.COLUMN:
                return (
                    <div
                        style={{ display: "flex", flexDirection: "column" }}
                        onMouseEnter={() => handleMouseEnter()}
                        onMouseLeave={() => handleMouseLeave()}
                    >
                        <div
                            style={{ display: "flex" }}
                            onMouseEnter={() => handleMouseEnter()}
                            onMouseLeave={() => handleMouseLeave()}
                        >
                            <div style={{ display: "flex" }}>{fieldLabel}</div>
                            <div style={{ display: "flex", minWidth: 14, width: 14 }}>
                                {requiredMarker}
                            </div>
                        </div>
                        <div
                            style={{ display: "flex" }}
                            onMouseEnter={() => handleMouseEnter()}
                            onMouseLeave={() => handleMouseLeave()}
                        >
                            <div style={{ display: "flex", flexGrow: 1, ...selectStyle }}>
                                {control}
                            </div>
                        </div>
                    </div>
                );
            case FormGroupLayout.ROW:
                return (
                    <div
                        style={{ display: "flex", flexDirection: "row" }}
                        onMouseEnter={() => handleMouseEnter()}
                        onMouseLeave={() => handleMouseLeave()}
                    >
                        <div style={{ display: "flex", minWidth: labelSize, width: labelSize }}>
                            {fieldLabel}
                        </div>
                        <div style={{ display: "flex", minWidth: 14, width: 14 }}>
                            {requiredMarker}
                        </div>
                        <div style={{ display: "flex", width: controlWidth, ...selectStyle }}>
                            <div
                                onDoubleClick={() =>
                                    onSelectItem && !isBeingEdited ? onSelectItem(name) : null
                                }
                            >
                                {control}
                            </div>
                        </div>
                        <div style={{ display: "flex", flexGrow: 1 }} />
                    </div>
                );
            default:
                return <div />;
        }
    };
}

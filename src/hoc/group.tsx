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
import { OverlayTrigger, Popover } from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import { FieldValue } from "../components/Form";
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
    name?: string; // Name assigned to this field, which should be
    width?: number;
    field?: string;

    // Group props, required to show the decoration surrounding the control itself
    label?: string;
    labelWidth?: number;

    isBeingEdited?: boolean; // Is the control currently being edited
    isRequired?: boolean; // Is the control required to be filled out
    showRequired?: boolean; // Should we show and enforce isRequired here
    isDisabled?: boolean; // Is the control currently disabled

    // Values supplied directly to the group
    value?: FieldValue;
    initialValue?: FieldValue;

    // Controls the display of the value when form control is not in edit mode (for example
    // before a value is inline editted). This can either be a string, or a function that
    // receives the current `value` and returns a React Element
    displayView?: string | ((value: FieldValue) => React.ReactElement<any>);

    // Injected props that are extracted from the Schema and injected by the form
    placeholder?: string; // Placeholder text displayed in some controls before the user types into them
    help?: string; // Help text for using the field control
    validation?: any; // From the field rules in the Schema

    // Injected props that come from the form
    isHidden?: boolean; // Is the control currently hidden
    isSelected?: boolean; // Is the control currently selected
    allowEdit?: boolean; // Can this item actually be editted right now
    layout?: string; // enum?

    // Callbacks that hook the editor up to the Form
    onSelectItem?: (fieldName: string | undefined) => void;
    onErrorCountChange?: (fieldName: string | undefined, count: number) => void;
    onMissingCountChange?: (fieldName: string | undefined, count: number) => void;
    onChange?: (fieldName: string | undefined, d: any) => void;
    onBlur?: (fieldName: string | undefined) => void;
    onEditItem?: (fieldName: string | undefined) => void;
}

export interface FormGroupState {
    error: boolean;
    over: boolean;
}

export function formGroup<ControlProps>(Control: any) {
    return (props: FormGroupProps & ControlProps) => {
        const handleMouseEnter = () => setOver(true);
        const handleMouseLeave = () => setOver(false);

        const [, setOver] = useState<boolean>(false);
        const [error] = useState<boolean>(false);

        const {
            name,
            label,
            isBeingEdited,
            isRequired,
            showRequired,
            onSelectItem,
            value,
            initialValue,
            layout,
            labelWidth,
            width,
            help,
            isHidden = false
        } = props;

        const hasChanged = _.isNull(initialValue) ? false : !Immutable.is(value, initialValue);
        const selectStyle = {};

        //
        // Hidden
        //
        if (isHidden) {
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
        // Required *
        //
        let requiredMarker;
        if (isRequired && showRequired) {
            requiredMarker = (
                <span className="group-required" style={{ paddingLeft: 3 }}>
                    *
                </span>
            );
        } else {
            requiredMarker = <span />;
        }

        //
        // Help
        //

        let helpMarker;
        if (_.isString(help) && help !== "") {
            const popover = (
                <Popover id="popover-basic">
                    <Popover.Content>
                        <ReactMarkdown source={help} />
                    </Popover.Content>
                </Popover>
            );

            helpMarker = (
                <OverlayTrigger
                    delay={{ show: 250, hide: 400 }}
                    placement="bottom"
                    overlay={popover}
                >
                    <span
                        className="group-help"
                        style={{
                            paddingLeft: 3,
                            color: "blue",
                            fontSize: 12,
                            paddingTop: 5,
                            cursor: "pointer"
                        }}
                    >
                        ⓘ
                    </span>
                </OverlayTrigger>
            );
        } else {
            helpMarker = <span />;
        }

        //
        // Label
        //

        const labelClasses = classNames({
            "group-label": true,
            isRequired
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
                <label>{label}</label>
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
                            <div style={{ display: "flex", minWidth: 18, width: 14 }}>
                                {requiredMarker}
                            </div>
                            <div style={{ display: "flex", minWidth: 18, width: 14 }}>
                                {helpMarker}
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
                        <div style={{ display: "flex", minWidth: 18, width: 18 }}>{helpMarker}</div>
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

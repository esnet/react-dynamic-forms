/**
 *  Copyright (c) 2015 - present, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import Flexbox from "@g07cha/flexbox-react";
import classNames from "classnames";
import Immutable from "immutable";
import _ from "lodash";
import React from "react";
import { FormGroupLayout } from "./constants";
import "./style/group.css";
import "./style/icon.css";

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
    const wrapped = class Group extends React.Component<FormGroupProps, FormGroupState> {
        constructor(props: any) {
            super(props);
            this.state = { over: false, error: false };
        }

        public render() {
            console.log("Render group", this.props.hidden);
            const { hidden = false, width, ...props } = this.props;
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
                labelWidth
            } = props;

            const isBeingEdited = edit;
            const hasChanged = _.isNull(initialValue) ? false : !Immutable.is(value, initialValue);

            const selectStyle = {};

            //
            // Hidden
            //
            if (hidden) {
                console.log("Hiddens");
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
                        margin: 2
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
            if (this.state.error) {
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
                        paddingTop: 8,
                        whiteSpace: "nowrap"
                    }}
                >
                    <label htmlFor={key}>{label}</label>
                </div>
            );
            const labelSize = labelWidth ? `${labelWidth}px` : "300px";

            // Group
            console.log("Switch layout", this.props.layout);
            switch (this.props.layout) {
                case FormGroupLayout.INLINE:
                    return (
                        <Flexbox
                            flexDirection="column"
                            width={`${controlWidth}`}
                            // onMouseEnter={() => this.handleMouseEnter()}
                            // onMouseLeave={() => this.handleMouseLeave()}
                        >
                            {control}
                        </Flexbox>
                    );
                case FormGroupLayout.COLUMN:
                    return (
                        <Flexbox
                            flexDirection="column"
                            // onMouseEnter={() => this.handleMouseEnter()}
                            // onMouseLeave={() => this.handleMouseLeave()}
                        >
                            <Flexbox
                                flexDirection="row"
                                // onMouseEnter={() => this.handleMouseEnter()}
                                // onMouseLeave={() => this.handleMouseLeave()}
                            >
                                <Flexbox>{fieldLabel}</Flexbox>
                                <Flexbox minWidth="14px" width="14px">
                                    {requiredMarker}
                                </Flexbox>
                            </Flexbox>
                            <Flexbox
                                flexDirection="row"
                                // onMouseEnter={() => this.handleMouseEnter()}
                                // onMouseLeave={() => this.handleMouseLeave()}
                            >
                                <Flexbox flexGrow={1} style={selectStyle}>
                                    {control}
                                </Flexbox>
                            </Flexbox>
                        </Flexbox>
                    );
                case FormGroupLayout.ROW:
                    console.log("Rendering row...");
                    return (
                        <Flexbox
                            flexDirection="row"
                            // onMouseEnter={() => this.handleMouseEnter()}
                            // onMouseLeave={() => this.handleMouseLeave()}
                        >
                            <Flexbox minWidth={labelSize} width={labelSize}>
                                {fieldLabel}
                            </Flexbox>
                            <Flexbox minWidth="14px" width="14px">
                                {requiredMarker}
                            </Flexbox>
                            <Flexbox width={`${controlWidth}`} style={selectStyle}>
                                <div
                                    onDoubleClick={() =>
                                        onSelectItem && !isBeingEdited ? onSelectItem(name) : null
                                    }
                                >
                                    {control}
                                </div>
                            </Flexbox>
                            <Flexbox flexGrow={1} />
                        </Flexbox>
                    );
                default:
                    return <div />;
            }
        }

        // private selectItem(attrName) {
        //     if (this.props.onSelectItem) {
        //         this.props.onSelectItem(attrName);
        //     }
        // }

        // public handleMouseEnter() {
        //     this.setState({ over: true });
        // }

        // public handleMouseLeave() {
        //     this.setState({ over: false });
        // }
    };

    return wrapped;
}

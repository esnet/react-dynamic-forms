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
 * Groups are intended to be used with the `formMixin` and provide a shorthand
 * method of adding a control and its label to a form, including support for
 * managing missing and error fields automatically.
 *
 * A group has two main purposes:
 *
 *  * Wrap a form component such that it is shown with a label and arranged
 *    within a bootstrap grid layout.
 *  * Expect standard props that are added to each of the wrapped form
 *    components (attrName, placeholder, validation etc) as a 'attr' object.
 *
 * Within ESDB we display the same form layout for each form element over and over.
 * This component is used to reduce all that boiler plate code. As such this
 * component is pretty hard coded in terms of its layout: 2 columns for the label
 * and 10 for the control. The Group is also meant to be used with the `formMixin`.
 * The `formMixin` provides a `getAttr()` call that extracts data such as existing
 * formValues, meta info such as label name, placeholder name, etc. In addition
 * it also supplies callbacks for missing and error counts as well as value changed
 * that are attached to functions that alter the mixin state.
 *
 * Example:
 *
 * ```
 *  <Group attr={this.getAttr("contact_type")} >
 *      <Chooser initialChoice={contactType} initialChoiceList={contactTypes} disableSearch={true}/>
 *  </Group>
 * ```
 *
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
      return <div />;
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
        <span className="group-required" style={{ paddingLeft: 3 }}>*</span>
      );
    } else {
      required = <span></span>;
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
      <div className={labelClasses} style={{ whiteSpace: "nowrap" }}>
        <label muted={attr.disabled} htmlFor={attr.key}>{labelText}</label>
        {required}
      </div>
    );

    // Group
    return (
      <div className="form-group row">
        {label}{control}
      </div>
    );
  }
})


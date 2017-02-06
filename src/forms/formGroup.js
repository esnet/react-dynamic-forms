/**
 *  Copyright (c) 2015, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import classNames from "classnames";
import Flexbox from "flexbox-react";
import React from "react";
import Immutable from "immutable";

import "./components/css/group.css";
import "./components/css/icon.css";

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

export default function formGroup(Widget) {
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
      //background: this.state.over ? "#FAFAFA" : "inherit"

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
      const fieldLabel = (
        <div
          className={labelClasses}
          style={{
            whiteSpace: "nowrap",
            marginLeft: "auto",
            paddingTop: 3,
            color: this.state.error ? "b94a48" : "inherit"
          }}
        >
          <label muted={disabled} htmlFor={key}>{label}</label>
        </div>
      );
      const labelWidth = this.props.labelWidth
        ? `${this.props.labelWidth}px`
        : "300px";

      //
      // Edit
      //
      const isList = Immutable.List.isList(props.value);
      let editIcon = <span />;
      if (allowEdit && this.state.over && !isList) {
        const isBeingEdited = edit;
        editIcon = (
          <i
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
      if (this.props.inline) {
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
      } else {
        return (
          <Flexbox
            flexDirection="row"
            onMouseEnter={() => this.handleMouseEnter()}
            onMouseLeave={() => this.handleMouseLeave()}
          >
            <Flexbox width={labelWidth}>
              {fieldLabel}
            </Flexbox>
            <Flexbox width="25px">
              {requiredMarker}
            </Flexbox>
            <Flexbox flexGrow={1} style={selectStyle}>
              {widget}
            </Flexbox>
            <Flexbox width="28px" style={selectStyle}>
              {editIcon}
            </Flexbox>
          </Flexbox>
        );
      }
    }
  };
}

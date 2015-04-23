/** @jsx React.DOM */

"use strict";

var React = require("react/addons");
var _ = require("underscore");

require("./group.css");

/**
 * Example:
 *  <Group attr={this.getAttr("contact_type")} >
 *      <Chooser initialChoice={contactType} initialChoiceList={contactTypes} disableSearch={true}/>
 *  </Group>
 */
var Group = React.createClass({

    displayName: "Group",

    render: function() {
        var attr = this.props.attr;

        if (!attr) {
            console.error("Attr not found");
        }

        var hidden = attr.hidden || false;

        if (hidden) {
            return (
                <div />
            );
        }

        //Control
        var props = {
            "attr": attr.attr,
            "key": attr.key,
            "ref": attr.attr,
            "disabled": attr.disabled,
            "placeholder": attr.placeholder,
            "rules": attr.validation,
            "required": attr.required,
            "showRequired": attr.showRequired,
            "onErrorCountChange": attr.errorCountCallback,
            "onMissingCountChange": attr.missingCountCallback,
            "onChange": attr.changeCallback,
            "validator": this.props.validator
        };

        var child = React.Children.only(this.props.children);
        var childControl = React.addons.cloneWithProps(child, props);

        var control = (
            <div className="col-sm-9">
                {childControl}
            </div>
        );

        //
        // Required
        //

        var required;
        if (attr.required) {
            required = (
                <span className="group-required" style={{paddingLeft: 3}}>*</span>
            );
        } else {
            required = (
                <span>&nbsp;</span>
            )
        }

        //
        // Label
        //

        var labelText = attr.name;
        var ClassSet = React.addons.classSet;
        var labelClasses = ClassSet({
            "group-label": true,
            "col-sm-3": true,
            "required": attr.required
        });
        var label = (
            <div className={labelClasses} style={{whiteSpace: "nowrap"}}>
                <label muted={attr.disabled} htmlFor={attr.key}>{labelText}</label>
                {required}
            </div>
        );

        //Group
        return (
            <div className="form-group row">
                {label} {control}
            </div>
        );
    }
});

module.exports = Group;
/** @jsx React.DOM */

"use strict";

var React = require("react/addons");
var _ = require("underscore");

class SchemaClass {
    constructor(properties, children) {
        this.properties = properties;
        this.children = children;
    }

    toObject() {
        return this.properties;
    }

    //Return a list of formAttrs
    attrs() {
        var formAttrs = {};
        _.each(this.children, function(attr) {
            formAttrs[attr.properties.name] = attr.properties;
        });
        return formAttrs;
    }

    rules() {
        var formRules = {};
        _.each(this.children, function(attr) {
            var required = attr.properties.required || false;
            var validation = attr.properties.validation;
            formRules[attr.properties.name] = {"required": required, "validation": validation};
        });
        return formRules;        
    }
}

function Schema(properties, ...children) {
    return new SchemaClass(properties, children);
}

module.exports = Schema;
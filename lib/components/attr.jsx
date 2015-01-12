/** @jsx React.DOM */

"use strict";

var React = require("react/addons");
var _ = require("underscore");

class AttrClass {
    constructor(properties) {
        this.properties = properties;
    }

    toObject() {
        return this.properties;
    }
}


function Attr(properties) {
    return new AttrClass(properties);
}

module.exports = Attr;
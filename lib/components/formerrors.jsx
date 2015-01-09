/** @jsx React.DOM */

"use strict";

var React = require("react/addons");
var _ = require("underscore");

/**
 * Display errors for a form
 */
var FormErrors = React.createClass({

    displayName: "FormErrors",

    render: function() {
        if (this.props.numErrors === 0) {
            if (this.props.showRequired && this.props.missingCount > 0) {
                return (
                    <div>
                        <span><i className="glyphicon esdb-error-icon glyphicon-exclamation-sign"></i></span>
                        <span className="esdb-error-text">Form incomplete</span>
                    </div>
                );
            } else {
                if (this.props.missingCount > 0) {
                    if (this.props.missingCount > 1) {
                        return (
                            <div>
                                <span className="esdb-error-text">{this.props.missingCount} fields to complete</span>
                            </div>
                        );
                    } else {
                        return (
                            <div>
                                <span className="esdb-error-text">{this.props.missingCount} field to complete</span>
                            </div>
                        );
                    }
                } else {
                    return null;
                }
            }
        } else if (this.props.numErrors === 1) {
            return (
                <div>
                    <span><i className="glyphicon esdb-error-icon glyphicon-exclamation-sign"></i></span>
                    <span className="esdb-error-text">{this.props.numErrors} Error</span>
                </div>
            );
        } else if (this.props.numErrors > 1) {
            return (
                <div>
                    <span><i className="glyphicon esdb-error-icon glyphicon-exclamation-sign"></i></span>
                    <span className="esdb-error-text">{this.props.numErrors} Errors</span>
                </div>
            );
        }
    }
});

module.exports = FormErrors;
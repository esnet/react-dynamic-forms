"use strict";

var React = require("react");

var Intro = React.createClass({

    render: function() {
        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <h3>Introduction</h3>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12">
                    The internal ESDB website (ESnet database) allows ESnet staff to maintain a database of
                    ESnet information that serves as a source of truth for ESnet operations. It covers things
                    such as ESnet HUB and site locations, organizations, contacts and circuits. Much of this
                    information is added via forms, which is where this library comes in.

                    <p />

                    This library contains four main pieces:

                    <ul>
                        <li>Low level forms widgets such as textedit or pulldown type controls</li>
                        <li>A forms mixin (FormMixin) to help you assemble controls together and track errors and missing values</li>
                        <li>Helper wrappings (Group and friends) for the low level widget to use within the form mixin</li>
                        <li>A mixin (ListEditorMixin) to help build lists, each item of which can be another form</li>
                    </ul>

                    </div>
                </div>
            </div>
        );
    }
});

module.exports = Intro;
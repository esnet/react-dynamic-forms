/** @jsx React.DOM */

var React = require('react');

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
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = Intro;
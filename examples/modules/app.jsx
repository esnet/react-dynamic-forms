/** @jsx React.DOM */

var React = require('react');

var {Link} = require('react-router');

require('./app.css');

var App = React.createClass({
  render: function() {
    return (
      <div>
          <div className="row">
              <div className="col-md-12">
                  <h2>ESnet React Forms Library</h2>
              </div>
          </div>

          <hr />

          <div className="row">

            <div className="col-md-2">
              <div className="docs-sidebar">
                  <ul className="docs-sidenav nav">
                    <li><Link to="intro">Introduction</Link></li>
                    <li><Link to="textedit">TextEdit</Link></li>
                    <li><Link to="textarea">TextArea</Link></li>
                    <li><Link to="chooser">Chooser</Link></li>
                    <li><Link to="tagging">Tagging</Link></li>
                    <li><Link to="optionbuttons">OptionButtons</Link></li>
                    <li><Link to="listoptions">OptionList</Link></li>
                    <li><Link to="filtering">TextFilter</Link></li>
                    <hr />
                    <li><Link to="group">Groups</Link></li>
                  </ul>
              </div>
            </div>

            <div className="col-md-10">
              <this.props.activeRouteHandler />
            </div>

          </div>
      </div>
    );
  }
});

module.exports = App;

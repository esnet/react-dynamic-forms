"use strict";

var React = require("react/addons");
var Router = require("react-router");
var {RouteHandler,
     Link} = Router;

require('./app.css');
var logo = document.createElement('img');
logo.src = require('../img/logo.png');

var App = React.createClass({
  render: function() {
    return (
      <div>

          <div className="row">
              <div className="col-md-2">
                  <img style={{float: "right"}} className="main-image" src={logo.src} width={80}/>
              </div>
              <div className="col-md-10">
                  <h2>ESnet React Forms Library</h2>
              </div>
          </div>

          <hr />

          <div className="row">

            <div className="col-md-2">
              <div className="docs-sidebar">
                  <ul className="docs-sidenav nav">
                    <li><Link to="intro">Introduction</Link></li>
                    <hr />
                    <li><Link to="textedit">TextEdit</Link></li>
                    <li><Link to="textarea">TextArea</Link></li>
                    <li><Link to="chooser">Chooser</Link></li>
                    <li><Link to="tagging">Tagging</Link></li>
                    <li><Link to="optionbuttons">OptionButtons</Link></li>
                    <li><Link to="listoptions">OptionList</Link></li>
                    <li><Link to="filtering">TextFilter</Link></li>
                    <hr />
                    <li><Link to="group">Groups</Link></li>
                    <hr />
                    <li><Link to="forms">Contact form</Link></li>
                    <li><Link to="errors">Form errors</Link></li>
                    <li><Link to="dynamic">Dynamic forms</Link></li>
                    <hr />
                    <li><Link to="lists">Lists</Link></li>
                    <hr />
                    <li><Link to="keyvalue">Key-Value</Link></li>
                  </ul>
              </div>
            </div>

            <div className="col-md-10">
              <RouteHandler />
            </div>

          </div>
      </div>
    );
  }
});

module.exports = App;

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
import Router from "react-router";
const {RouteHandler, Link} = Router;

import "./app.css";

const logo = document.createElement("img");
logo.src = require("../img/logo.png");

const github = document.createElement("img");
github.src = require("../img/github.png");

export default React.createClass({

  render() {
    return (
      <div>

          <div className="row">
              <div className="col-md-2">
                  <img style={{float: "right"}} className="main-image" src={logo.src} width={80}/>
              </div>
              <div className="col-md-10">
                  <h2>React Forms Library</h2>
              </div>
          </div>

          <hr />

          <div className="row">

            <div className="col-md-2">
              <div className="docs-sidebar">

                  <ul className="docs-sidenav nav">

                    <li style={{height: 64}}>
                      <a href="https://github.com/esnet/esnet-react-forms">
                        <img style={{float: "left"}} className="main-image" src={github.src} width={32} height={32}/>
                      </a>
                    </li>

                    <hr />

                    <li><Link to="intro">Introduction</Link></li>
                    
                    <hr />
                    
                    Low level:
                    <li><Link to="textedit">TextEdit</Link></li>
                    <li><Link to="textarea">TextArea</Link></li>
                    <li><Link to="chooser">Chooser</Link></li>
                    <li><Link to="tagging">Tagging</Link></li>
                    <li><Link to="optionbuttons">OptionButtons</Link></li>
                    <li><Link to="navitems">NavItems</Link></li>
                    <li><Link to="listoptions">OptionList</Link></li>
                    <li><Link to="filtering">TextFilter</Link></li>
                    <hr />
                    Helpers:
                    <li><Link to="group">Groups</Link></li>
                    <hr />
                    Compound:
                    <li><Link to="lists">Lists</Link></li>
                    <li><Link to="keyvalue">Key-Value</Link></li>
                    Examples:
                    <li><Link to="forms">Contact form</Link></li>
                    <li><Link to="errors">Form errors</Link></li>
                    <li><Link to="dynamic">Dynamic forms</Link></li>


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

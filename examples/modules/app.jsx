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
import { Link } from "react-router";

const logo = document.createElement("img");
logo.src = require("../img/logo.png");

export default React.createClass({

    render() {
        return (
            <div className="row">

                <div className="col-sm-3 col-md-2 sidebar">
                    <p />
                    <ul className="nav nav-sidebar">
                        <li><Link to="/">Introduction</Link></li>
                    </ul>

                    <div className="sidebar-heading">Low level API</div>

                    <ul className="nav nav-sidebar">
                      <li><Link to="textedit">TextEdit</Link></li>
                      <li><Link to="textarea">TextArea</Link></li>
                      <li><Link to="chooser">Chooser</Link></li>
                      <li><Link to="tagging">Tagging</Link></li>
                      <li><Link to="optionbuttons">OptionButtons</Link></li>
                      <li><Link to="navitems">NavItems</Link></li>
                      <li><Link to="listoptions">OptionList</Link></li>
                      <li><Link to="filtering">TextFilter</Link></li>
                    </ul>

                    <div className="sidebar-heading">Helpers</div>
                    <ul className="nav nav-sidebar">
                        <li><Link to="group">Groups</Link></li>
                    </ul>

                    <div className="sidebar-heading">Compound</div>
                    <ul className="nav nav-sidebar">
                        <li><Link to="lists">Lists</Link></li>
                        <li><Link to="keyvalue">Key-Value</Link></li>
                    </ul>

                    <div className="sidebar-heading">Examples</div>
                    <ul className="nav nav-sidebar">
                      <li><Link to="forms">Contact form</Link></li>
                      <li><Link to="errors">Form errors</Link></li>
                      <li><Link to="dynamic">Dynamic forms</Link></li>
                    </ul>

                    <div className="sidebar-heading">Links</div>

                    <ul className="nav nav-sidebar">
                        <li><a href="https://github.com/esnet/esnet-react-forms">GitHub</a></li>
                        <li><a href="https://www.es.net/">ESnet</a></li>
                        <li><a href="http://software.es.net/">Open Source</a></li>
                    </ul>

                    <div className="sidebar-heading">Related Projects</div>

                    <ul className="nav nav-sidebar">
                        <li><a href="http://software.es.net/react-network-diagrams/">React Network Diagrams</a></li>
                        <li><a href="http://software.es.net/react-timeseries-charts/">React Timeseries Charts</a></li>
                        <li><a href="http://software.es.net/pond/">Pond - Timeseries abstraction</a></li>
                    </ul>
                </div>

                <div className="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
                    {this.props.children}
                </div>

            </div>
        );
    }
});

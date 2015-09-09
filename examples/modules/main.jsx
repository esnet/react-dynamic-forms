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

const {Route,
       DefaultRoute,
       RouteHandler,
       Link} = Router;

import App from "./app.jsx";
import Intro from "./intro.jsx";
import TextEditExamples from "./textedit_examples.jsx";
import TextAreaExamples from "./textarea_examples.jsx";
import ChooserExamples from "./chooser_examples.jsx";
import OptionButtonsExamples from "./optionbuttons_examples.jsx";
import OptionsListExamples from "./optionlist_examples.jsx";
import TaggingExamples from "./tagging_examples.jsx";
import FilterExamples from "./filter_examples.jsx";
import GroupExamples from "./group_examples.jsx";
import FormExamples from "./form_examples.jsx";
import ErrorExamples from "./error_examples.jsx";
import DynamicExamples from "./dynamic_examples.jsx";
import ListExamples from "./list_examples.jsx";
import KeyValueExamples from "./keyvalue_examples.jsx";
import NavItemsExamples from "./navitems_examples.jsx";

var routes = (
    <Route path="/" handler={App}>
        <DefaultRoute name="intro" handler={Intro} />
        <Route name="textedit" handler={TextEditExamples} />
        <Route name="textarea" handler={TextAreaExamples} />
        <Route name="chooser" handler={ChooserExamples} />
        <Route name="optionbuttons" handler={OptionButtonsExamples} />
        <Route name="navitems" handler={NavItemsExamples} />
        <Route name="listoptions" handler={OptionsListExamples} />
        <Route name="tagging" handler={TaggingExamples} />
        <Route name="filtering" handler={FilterExamples} />
        <Route name="group" handler={GroupExamples} />
        <Route name="forms" handler={FormExamples} />
        <Route name="errors" handler={ErrorExamples} />
        <Route name="dynamic" handler={DynamicExamples} />
        <Route name="lists" handler={ListExamples} />
        <Route name="keyvalue" handler={KeyValueExamples} />
    </Route>
);

Router.run(routes, function (Handler) {
    React.render(<Handler/>, document.getElementById("content"));
});

/**
 *  Copyright (c) 2015, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

/* eslint max-len:0 */

import React from "react";
import { render } from "react-dom";
import { Router, Route, IndexRoute } from "react-router";

import App from "./app.jsx";
import Intro from "./intro.jsx";
import TextEditExamples from "./textedit_examples.jsx";
import TextAreaExamples from "./textarea_examples.jsx";
import ChooserExamples from "./chooser_examples.jsx";
import OptionButtonsExamples from "./optionbuttons_examples.jsx";
import TaggingExamples from "./tagging_examples.jsx";
import GroupExamples from "./group_examples.jsx";
import FormExamples from "./form_examples.jsx";
import ErrorExamples from "./error_examples.jsx";
import DynamicExamples from "./dynamic_examples.jsx";
import ListExamples from "./list_examples.jsx";
import KeyValueExamples from "./keyvalue_examples.jsx";

render((
    <Router>
        <Route path="/" component={App}>
            <IndexRoute component={Intro}/>
            <Route path="textedit" component={TextEditExamples} />
            <Route path="textarea" component={TextAreaExamples} />
            <Route path="chooser" component={ChooserExamples} />
            <Route path="optionbuttons" component={OptionButtonsExamples} />
            <Route path="tagging" component={TaggingExamples} />
            <Route path="group" component={GroupExamples} />
            <Route path="forms" component={FormExamples} />
            <Route path="errors" component={ErrorExamples} />
            <Route path="dynamic" component={DynamicExamples} />
            <Route path="lists" component={ListExamples} />
            <Route path="keyvalue" component={KeyValueExamples} />
        </Route>
    </Router>
), document.getElementById("content"));

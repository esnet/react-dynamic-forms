import React from "react";
import ReactDOM from "react-dom";
import { Router, IndexRoute, Route, hashHistory } from "react-router";

import "./website/index.css";
import "react-select/dist/react-select.css";

import App from "./website/App";
import Intro from "./website/intro/Intro";

// Examples
import FormExample from "./website/examples/FormExample";
import DynamicExample from "./website/examples/DynamicExample";
import ListExample from "./website/examples/ListExample";

ReactDOM.render(
    <Router history={hashHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={Intro} />
            <Route path="example/contact" component={FormExample} />
            <Route path="example/list" component={ListExample} />
            <Route path="example/dynamic" component={DynamicExample} />
        </Route>
    </Router>,
    document.getElementById("root")
);

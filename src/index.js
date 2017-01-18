import React from 'react';
import ReactDOM from 'react-dom';
import { Router, IndexRoute, Route, hashHistory } from "react-router";

import './website/index.css';
import 'react-select/dist/react-select.css';

import App from './website/App';
import Intro from "./website/intro/Intro";
import Form from "./website/examples/FormExample";
//import API from "./website/api/API";

ReactDOM.render((
    <Router history={hashHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={Intro}/>
            <Route path="example/contact" component={Form} />
            {/*<Route path="api/:component" component={API} />*/}
        </Route>
    </Router>
), document.getElementById("root"));

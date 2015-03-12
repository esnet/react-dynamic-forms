/** @jsx React.DOM */

var React = require("react");
var App = require("./app.jsx");

var Intro = require("./intro.jsx");
var TextEditExamples = require("./textedit_examples.jsx");
var TextAreaExamples = require("./textarea_examples.jsx");
var ChooserExamples = require("./chooser_examples.jsx");
var OptionButtonsExamples = require("./optionbuttons_examples.jsx");
var OptionsListExamples = require("./optionlist_examples.jsx");
var TaggingExamples = require("./tagging_examples.jsx");
var FilterExamples = require("./filter_examples.jsx");
var GroupExamples = require("./group_examples.jsx");
var FormExamples = require("./form_examples.jsx");
var ErrorExamples = require("./error_examples.jsx");
var DynamicExamples = require("./dynamic_examples.jsx");
var ListExamples = require("./list_examples.jsx");

var {DefaultRoute, Route, Routes} = require("react-router");

React.renderComponent((
	<Routes>
    	<Route path="/" handler={App}>
            <DefaultRoute name="intro" handler={Intro} />
      		  <Route name="textedit" handler={TextEditExamples} />
            <Route name="textarea" handler={TextAreaExamples} />
            <Route name="chooser" handler={ChooserExamples} />
            <Route name="optionbuttons" handler={OptionButtonsExamples} />
            <Route name="listoptions" handler={OptionsListExamples} />
            <Route name="tagging" handler={TaggingExamples} />
            <Route name="filtering" handler={FilterExamples} />
            <Route name="group" handler={GroupExamples} />
            <Route name="forms" handler={FormExamples} />
            <Route name="errors" handler={ErrorExamples} />
            <Route name="dynamic" handler={DynamicExamples} />
            <Route name="lists" handler={ListExamples} />
    	</Route>
  	</Routes>
), document.getElementById("content"));

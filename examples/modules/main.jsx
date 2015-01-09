/** @jsx React.DOM */

var React = require('react');
var App = require('./app.jsx');

var Intro = require('./intro.jsx');
var TextEditExamples = require('./textedit_examples.jsx');
var TextAreaExamples = require('./textarea_examples.jsx');
var ChooserExamples = require('./chooser_examples.jsx');
var OptionButtonsExamples = require('./optionbuttons_examples.jsx');
var OptionsListExamples = require('./optionlist_examples.jsx');
var TaggingExamples = require('./tagging_examples.jsx');

var {DefaultRoute, Route, Routes} = require('react-router');

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
    	</Route>
  	</Routes>
), document.getElementById("content"));

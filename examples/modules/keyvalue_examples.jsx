var React = require("react/addons");
var _ = require("underscore");
var Markdown = require("react-markdown-el");
var {Alert} = require("react-bootstrap");

var {KeyValue} = require("../../entry");

var text        = require("raw!../markdown/list_examples.md");
var description = "This shows an example form with a list of keys and values that can be added or removed.";


var keyValues = {"Arbor ID":"12345678","Site Wiki":"https://eng-wiki.es.net/foswiki/Site/CHIC-HUB"}

var constraints = [{"keyname":"Arbor ID","datatype":"integer","content_type":"organization"},
				  {"keyname":"Site Wiki","datatype":"url","content_type":"location"},
				  {"keyname":"Web Portal","datatype":"url","content_type":"organization"},
				  {"keyname":"Google Folder","datatype":"url","content_type":"location"}]

var KeyValueExamples = React.createClass({

	render: function() {
		return (
			<div>
				<KeyValue keyValues={keyValues} constraints={constraints}/>
			</div>
			);
	}
});

module.exports = KeyValueExamples;

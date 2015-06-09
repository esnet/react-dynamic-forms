var React = require("react/addons");
var _ = require("underscore");
var Markdown = require("react-markdown-el");
var {Alert} = require("react-bootstrap");

var {KeyValueEdit} = require("../../entry");

var text        = require("raw!../markdown/list_examples.md");
var description = "This shows an example form with a list of keys and values that can be added or removed.";


var keyValues = {"Arbor ID":"12345678","Site Wiki":"https://eng-wiki.es.net/foswiki/Site/CHIC-HUB"}

var constraints = [
					{"keyname":"Arbor ID","datatype":"integer","content_type":"organization"},
					{"keyname":"Site Wiki","datatype":"url","content_type":"location"},
					{"keyname":"Web Portal","datatype":"url","content_type":"organization"},
					{"keyname":"Google Folder","datatype":"url","content_type":"location"},
					{"keyname":"Special Email","datatype":"email","content_type":"location"},
					{"keyname":"Site Router Name","datatype":"string","content_type":"location"},
					{"keyname":"Stub Address","datatype":"ip-address","content_type":"location"},
				  ]

var KeyValueExamples = React.createClass({

	render: function() {
		return (
			<div>
				<div className="row">
					<div className="col-md-12">
						<h3>Key-Value Example</h3>
						The Key-Value widget converts an object of key value pairs to an array which it passes 
						to the list editor for formatting.<br />
						<br />
						The Key-Value editor also takes a list of constraints which it uses to populate the 
						chooser.  This list is filtered each time a constraint is used until the list of possible
						constraints is exhausted.<br />
						<br />
						Each contraint also has a datatype which is used for validation by the textedit.<br />
						<br />
					</div>
				</div>

				<div className="row">
					<div className="col-md-12">
					<h4>Key-Value Editor</h4>

					<p />
						<KeyValueEdit keyValues={keyValues} constraints={constraints}/>
					</div>
				</div>
			</div>
			);
	}
});

module.exports = KeyValueExamples;

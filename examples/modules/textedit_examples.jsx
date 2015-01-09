/** @jsx React.DOM */

var React = require('react');

var {TextEdit} = require("../../entry");

var TextEditExamples = React.createClass({

	getInitialState: function() {
		return {
			errorCount: 0,
			missingCount: 0
		};
	},

	handleErrorCountChange: function(attr, count) {
		this.setState({"errorCount": count});
	},

	handleMissingCountChange: function(attr, count) {
		this.setState({"missingCount": count});
	},

  	render: function() {

	    return (
	    	<div>
	          	<div className="row">
	              	<div className="col-md-12">
	                  	<h3>TextEdit Examples</h3>
	              	</div>
	          	</div>

	          	<div className="row">
	              	<div className="col-md-12">

	              	<hr />
	              	<h4>Basic examples</h4>

	              	Simple single line text input, with default value:
	              	<p />
	              	<TextEdit initialValue="Bob"/>

	              	Disabled:
	              	<p />
	              	<TextEdit initialValue="Bob" disabled={true}/>

	              	Placeholder:
	              	<p />
	              	<TextEdit placeholder="Enter first name"/>

	              	<hr />
	              	<h4>Errors and missing values</h4>

	              	Required field (with showRequired turned ON):
	              	<p />
	              	<TextEdit required={true} showRequired={true}/>

	              	Required field (with showRequired turned OFF):
	              	<p />
	              	<TextEdit required={true} showRequired={false}/>

	              	Required field (with showRequired turned ON and initial value):
	              	<p />
	              	<TextEdit initialValue="Bob" required={true} showRequired={true}/>

	              	Validated field (email address):
	              	<p />
	              	<TextEdit initialValue="bob.at.gmail.com" rules={{ "format": "email"}}/>

	              	<hr />
	              	<h4>Callbacks</h4>

	              	Validated field (email address) with error callback:
	              	<p />
	              	<TextEdit initialValue="bob.at.gmail.com" onErrorCountChange={this.handleErrorCountChange} rules={{ "format": "email"}}/>
	              	Error count: {this.state.errorCount}
	              	<p />

	              	Required field (with showRequired turned on) with missing count callback:
	              	<p />
	              	<TextEdit required={true} showRequired={true} onMissingCountChange={this.handleMissingCountChange}/>
	              	Missing count: {this.state.missingCount}
	              	<p />

	              	</div>
	          	</div>
		    </div>
	    );
  	}
});

module.exports = TextEditExamples;
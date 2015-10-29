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
import TextEdit from "../../src/textedit";

export default React.createClass({

	getInitialState() {
		return {
			errorCount: 0,
			missingCount: 0
		};
	},

	handleErrorCountChange(attr, count) {
		this.setState({"errorCount": count});
	},

	handleMissingCountChange(attr, count) {
		this.setState({"missingCount": count});
	},

	handleIntegerValidate(attr, value) {
		this.setState({"typeofInt": typeof value})
	},

	handleEmailValidate(attr, value) {
		this.setState({"typeofEmail": typeof value})
	},

  	render() {
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
	              	<TextEdit initialValue="Bob" width={300}/>

	              	Disabled:
	              	<p />
	              	<TextEdit initialValue="Bob" disabled={true} width={300}/>

	              	Placeholder:
	              	<p />
	              	<TextEdit placeholder="Enter first name" width={300}/>

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
	              	<TextEdit initialValue="bob.at.gmail.com" rules={{ "format": "email"}} onChange={this.handleEmailValidate}/>
	              	<br />
	              	Type of value: {this.state.typeofEmail}

	              	<p />
	              	Validated field (integer):
	              	<p />
	              	<TextEdit initialValue="42" rules={{ "type": "integer"}}/>

	              	<TextEdit initialValue="bob" rules={{ "type": "integer"}} onChange={this.handleIntegerValidate}/>
	              	Type of value: {this.state.typeofInt}

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

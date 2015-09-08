var React = require("react");
var _ = require("underscore");
var Markdown = require("react-markdown-el");
var {Alert} = require("react-bootstrap");

var {KeyValueEdit,
     Form,
     FormMixin,
     Group,
     Schema,
     Attr} = require("../../index");

var text        = require("raw!../markdown/list_examples.md");
var description = "This shows an example form with a list of keys and values that can be added or removed.";


var keyValues = {"Arbor ID":"12345678","Site Wiki":"https://eng-wiki.es.net/foswiki/Site/CHIC-HUB"};

var constraints = [
                    {"keyname":"Arbor ID","datatype":"integer","content_type":"organization"},
                    {"keyname":"Site Wiki","datatype":"url","content_type":"location"},
                    {"keyname":"Web Portal","datatype":"url","content_type":"organization"},
                    {"keyname":"Google Folder","datatype":"url","content_type":"location"},
                    {"keyname":"Special Email","datatype":"email","content_type":"location"},
                    {"keyname":"Site Router Name","datatype":"string","content_type":"location"},
                    {"keyname":"Stub Address","datatype":"ip-address","content_type":"location"},
                  ];

var keyValueEditSchema = (
    <Schema>
        <Attr name="keyValues" label="Key Values" />
    </Schema>
);

var KeyValueForm = React.createClass({

    displayName: "KeyValueForm",

    mixins: [FormMixin],

    handleSubmit: function(e) {
        e.preventDefault();

        //Example of checking if the form has missing values and turning required On
        if (this.hasMissing()) {
            this.showRequiredOn();
            return;
        }

        //Example of fetching current and initial values
        console.log("values:", this.getValues());

        this.props.onSubmit && this.props.onSubmit(this.getValues());
    },

    renderForm: function() {
        var formStyle = {background: "#FDFDFD", padding: 10, borderRadius:5};
        var disableSubmit = this.hasErrors();
        var keyValues = this.props.keyValues;
        var constraints = this.props.constraints;

        console.log("Values", this.state.formValues)

        return(
            <Form style={formStyle} attr="keyvalue-form">
                <Group attr="keyValues">
                    <KeyValueEdit keyValues={keyValues} constraints={constraints} />
                </Group>

                <hr />

                <input className="btn btn-default" type="submit" value="Submit" disabled={disableSubmit}/>
            </Form>
        );
    }
});

var KeyValueExamples = React.createClass({

    displayName: "KeyValueExamples",

    getInitialState: function(){
        return {
            "data": undefined,
            "loaded": false,
        };
    },

    componentDidMount: function() {
        var self = this;

        //Simulate ASYNC state update
        setTimeout(function() {
            self.setState({
                "loaded": true
            });
        }, 1500);
    },

    handleChange: function(a, b) {
        console.log("Form changed", a, b)
    },

    handleSubmit: function(value) {
        console.log("value",value)
        this.setState({"data": value})
    },

    handleAlertDismiss: function() {
        this.setState({"data": undefined})
    },

    renderAlert: function() {
        if (this.state && this.state.data) {
            return (
                <Alert bsStyle="success" onDismiss={this.handleAlertDismiss} style={{margin: 5}}>
                    <strong>Success!</strong>
                </Alert>
            );
        } else {
            return null;
        }
    },

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
                        Each constraint also has a datatype which is used for validation by the textedit.<br />
                        <br />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12">
                        <KeyValueForm schema={keyValueEditSchema}
                                      keyValues={keyValues} constraints={constraints}
                                      onSubmit={this.handleSubmit}
                                      onChange={this.handleChange} />
                    </div>
                </div>
                
                <div className="row">
                    <div className="col-md-12">
                        {this.renderAlert()}
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = KeyValueExamples;


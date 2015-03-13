###Dynamic form example###

The forms library allows you to create forms that dynamically change depending on other filled out attrs. An example of this is a form which has a type field and that field controls several other fields that only apply to that type. In this case we want to:

 * Hide and show fields in reaction to a change in the type
 * Have hidden fields not be required, i.e. support conditional requires

#### Render ####

The above example begins with a pretty simple `renderForm()` implementation. In fact there's not much to see here. Regardless of the visibility that we'll control in a minute, we can just render all the fields and the forms code will take care of selectively hiding fields for us. Here is the main part of the renderForm() function, excluding a little code to get out bookmarks map for the Bookmark chooser choice list.

    return (
        <Form style={formStyle}>
            <ChooserGroup attr="bookmarked" width={300} initialChoiceList={bookmarks}/>
                <hr />
            <TextEditGroup attr="name" width={300} />
            <TextAreaGroup attr="description" />
                <hr />
            <ChooserGroup attr="type" width={200} initialChoice={this.value("type")}
                          initialChoiceList={endpointTypes} disableSearch={true} />
            <TextEditGroup attr="device_name" />
            <TextEditGroup attr="interface" />
            <TextEditGroup attr="foreign_description" />
            <TextEditGroup attr="organization" />
            <TextEditGroup attr="panel_name" />
            <TextEditGroup attr="port_id" />
            <TextEditGroup attr="port_side" />
            <TextEditGroup attr="port_location" />
                <hr />
            <input className="btn btn-default" type="submit" value="Submit" disabled={disableSubmit}/>
        </Form>
    );


#### Tags ####

The forms library schema supports visibility tags, which can be used to quickly control which set of fields show be visible and which should not, rather than setting each one. The schema for our example looks like this

    <Schema>
        <Attr name="bookmarked" label=""  tags={["all"]} />
        <Attr name="name" label="Name"  tags={["all"]} required={true} />
        <Attr name="description" label="Description"  tags={["all"]} required={true} />
        <Attr name="type" label="Type"  tags={["all"]} required={true} />
        <Attr name="device_name" label="Device name"  tags={["Equipment Port"]} required={true} />
        <Attr name="interface" label="Interface" tags={["Equipment Port"]} required={true} />
        <Attr name="foreign_description" label="Foreign description" tags={["Foreign"]} required={true} />
        <Attr name="organization" label="Organization" tags={["Foreign"]} required={true} />
        <Attr name="panel_name" label="Panel name" tags={["Patch Panel"]} required={true}  />
        <Attr name="port_id" label="Port Id" tags={["Patch Panel"]} required={true} />
        <Attr name="port_side" label="Port side" tags={["Patch Panel"]} required={true} />
        <Attr name="port_location" label="Port location" tags={["Patch Panel"]} required={true} />
    </Schema>

You can see that for each attr we've defined a tags prop. This is a list of visibility tags. Here we've named our tags based on our type values ("Equipment Port", "Patch Panel" and "Foreign"). A special tag `all` can also be added meaning that the attr will always be visible.

To turn on visibility we use the `setVisibility()` method on the FormMixin. This method takes as its argument the tag to match against the schema to control the visibility of the attrs. For example, if we passed in "Equipment Port" then all the attrs with a tag of "all" would be shown, as would those with a tag of "Equipment Port" ("device_name" and "interface"). All others would be hidden.

#### willHandleChange() ####

Next we need a place to respond to the change in attribute. The FormsMixin code provides for this with a hook function called `willHandleChange` that is called when a value is changed (either by the user or programmatically). It is possible to use this function to change other form state (as we'll do here), or if you return a value, actually modify the value before it is stored in the form. Here is our implementation of willHandleChange:

    willHandleChange: function(attrName, value) {
        switch (attrName) {
            case "type":
                this.setVisibility(endpointTypes[value]);
                break;
            case "bookmarked":
                if (value) {
                    //Id was changed so transfer existing endpoint values onto the form
                    var endpoint = bookmarked[value];
                    this.setValue("name", endpoint.name);
                    this.setValue("description", endpoint.description);
                    this.setValue("type", endpoint.type);
                    this.setValue("device_name", endpoint.device_name);
                    this.setValue("interface", endpoint.interface);
                    this.setValue("foreign_description", endpoint.foreign_description);
                    this.setValue("organization", endpoint.organization);
                    this.setValue("panel_name", endpoint.panel_name);
                    this.setValue("port_id", endpoint.port_id);
                    this.setValue("port_side", endpoint.port_side);
                    this.setValue("port_location", endpoint.port_location);
                }
                break;
        }
    },

For our example we allow the user to switch between different pre-set bookmarked endpoints. In response willHandleChange will be called with the attrName being "bookmarked", which we handle in the second part of the switch statement. In response we set the bookmarked endpoint's values on the form itself.

The subtle thing here to note is that one of the attrs we are setting is `type`. This is also a handled attr in willHandleChange and will be taken care of in the first part of the switch statement. This is what controls the visibility based on the type as it calls `setVisibility()` with the set type (converted from id to string).

In the UI it is also possible to just change the type directly, in which case the first part of the switch statement handles this directly and fields are shown and hidden based on the setVisibility() call.

#### getInitialVisibility() ####

The final thing to note in this example is how you control the initial visibility state. This is done with a hook function called `getInitialVisibility()`. You implement this to return the tag you want to show.

    getInitialVisibility: function() {
        return endpointTypes[this.props.values["type"]];
    },



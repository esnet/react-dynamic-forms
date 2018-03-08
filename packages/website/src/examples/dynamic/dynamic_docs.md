### Description

The forms library allows you to create forms that dynamically change
depending on other filled out fields. An example of this is a form which
has a type field and that field controls several other fields that only
apply to that type. In this case we want to:

 * Hide and show fields in reaction to a change in the type
 * Have hidden fields not be required, i.e. support conditional requires

#### Render

The above example begins with a pretty simple `renderForm()`
implementation. In fact there's not much to see here. Regardless of the
visibility that we'll control in a minute, we can just render all the
fields and the forms code will take care of selectively hiding fields
for us. Here is the main part of the renderForm() function, excluding
    a little code to get out bookmarks map for the Bookmark chooser
choice list.

```js
return (
    <Form style={formStyle}>
        <Chooser field="bookmarked" width={300} initialChoiceList={bookmarks} />
        <hr />
        <TextEdit field="name" width={300} />
        <TextArea field="description" />
        <hr />
        <Chooser field="type" width={200} initialChoice={this.value("type")}
                 initialChoiceList={endpointTypes} disableSearch={true} 
        />
        <TextEdit field="device_name" />
        <TextEdit field="interface" />
        <TextEdit field="foreign_description" />
        <TextEdit field="organization" />
        <TextEdit field="panel_name" />
        <TextEdit field="port_id" />
        <TextEdit field="port_side" />
        <TextEdit field="port_location" />
        <hr />
        <input className="btn btn-default" type="submit" value="Submit" disabled={disableSubmit} />
    </Form>
);
```

#### Tags

The forms library schema supports visibility tags, which can be used
to quickly control which set of fields show be visible and which should
not, rather than setting each one. The schema for our example looks like
this

```js
<Schema>
    <Field name="bookmarked" label=""  tags={["all"]} />
    <Field name="name" label="Name"  tags={["all"]} required={true} />
    <Field name="description" label="Description"  tags={["all"]} required={true} />
    <Field name="type" label="Type"  tags={["all"]} required={true} />
    <Field name="device_name" label="Device name"  tags={["Equipment Port"]} required={true} />
    <Field name="interface" label="Interface" tags={["Equipment Port"]} required={true} />
    <Field name="foreign_description" label="Foreign description" tags={["Foreign"]} required={true} />
    <Field name="organization" label="Organization" tags={["Foreign"]} required={true} />
    <Field name="panel_name" label="Panel name" tags={["Patch Panel"]} required={true} />
    <Field name="port_id" label="Port Id" tags={["Patch Panel"]} required={true} />
    <Field name="port_side" label="Port side" tags={["Patch Panel"]} required={true} />
    <Field name="port_location" label="Port location" tags={["Patch Panel"]} required={true} />
</Schema>
```

You can see that for each Field we've defined a tags prop. This is a list
of visibility tags. Here we've named our tags based on our type values
("Equipment Port", "Patch Panel" and "Foreign"). A special tag "all"
can also be added meaning that the attr will always be visible.

To turn on visibility we use the `visibility` prop on the `Form`.
This method takes as its argument the tag to match against the schema
to control the visibility of the fields. For example, if we passed in
"Equipment Port" then all the attrs with a tag of "all" would be shown,
as would those with a tag of "Equipment Port" ("device_name" and
"interface"). All others would be hidden.

## Dynamic changing the form

In this form we have a bookmark chooser. When the user selects a preset
from this chooser it will fill the form with values. The subtle thing here
is that this also sets the type chooser further down the form, which itself
controls what fields will be shown. It's this kind of behavior that the
forms code is designed to handle.

Let's think this through:

 1. The first thing that happens is that the user selects a bookmark
    from the top chooser.
 2. We know when the user changes something by handling onChange in
    handleChange(), so we can compare the previous and next version
    of the form value.
 3. If the bookmark has indeed changed then we can merge in some
    pre-baked data for that bookmark into the form value before setting
    it as our source of truth. In this way the change of a single item
    can be applied to many items.

    ```js
    if (value.get("bookmarked") !== this.state.value.get("bookmarked")) {
        const bookmark = bookmarked[value.get("bookmarked")];
        const merged = value.merge(bookmark);
        this.setState({ value: merged });
    } else {
        this.setState({ value });
    }
    ```

 4. The form will then re-render and update to show the new values. However
    we need to handle the visibility state of the form. The visibility
    of the form is a function of the data in the form (at least in this case),
    meaning that if the form data is in a particular state, we only show
    certain fields. In this case when we set the "type" between three possible
    values we show different fields that only apply to that "type". Therefore,
    in our render function we get the "type" out of our form state and then
    set our visibility based on that:

    ```js
    render() {

        // Current type
        const currentType = values.get("type");

        // Find the visibility tag given our current type
        const visiblityTag = getVisibilityTag(currentType);

        ...
    }
    ```

    As mentioned above, we encode the tags within the Schema, so here we are
    simply mapping between those tags and the type.

 5. Finally, to complete the dynamically updating form, we simply render
    the form but set the visibility prop to our `visibilityTag`.

    ```js
    render() {
        ...
        return (
            <Form
                ...
                visible={visiblityTag}
                ...
            >
                ...
            </Form>
        );
    }
    ```

---
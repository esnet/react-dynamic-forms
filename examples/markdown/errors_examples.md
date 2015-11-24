### Error example

The forms library has several facilities to help with tracking of errors and missing values on the form.

#### Widgets

At the lowest level, each widget, such as a TextEdit widget, has been adapted to keep track of its status with respect to the validation rules that were passed to it, either directly or using a form schema. These rules specifiy both what kind of data or format is valid for a field as well as if the field is required or not. As the status of the form widget changes with user input (on blur and focus) the field will pass this information up to the creater of the widget via callbacks.

#### Forms

At the next level up, a form contains many widgets. Using the Group wrappers such as TextEditGroup within a FormMixin `renderForm` method will add tracking of its widgets by adding callbacks to those widgets and keeping track of the result. The result will be a mapping of widgets to if they are currently displaying a error as well as a mapping of widget to if they are required to be filled but aren't. From these two mappings we can sum the totals and so a form knowns how many errors and missing fields exist within its widgets. To access these totals you can call `errorCount()` (or `hasErrors()`) and `missingCount()` (or `hasMissing()`) on the FormMixin component. You can also get notifications from outside of the FormMixin component by adding callbacks as props, such as in this example:

    <ContactForm attr="contacts"
                 schema={schema}
                 values={values}
                 onMissingCountChange={this.handleMissingCountChange}
                 onErrorCountChange={this.handleErrorCountChange}/>

An example error handler would then look like this (where attr will be the name supplied as the `attr` prop to the form ("contacts" in the above example) and `count` will be the number of errors in the form:

    handleErrorCountChange: function(attr, count) {
        this.setState({"errorCount": count});
    },

Missing values can be similarly handled.

Note that all of this applied to list editors as well. Total counts of the list editors within a form will be correctly reported back up to the form.

#### Show Required

Showing the user which forms are required is a tricky user experience dance. On one hand you don't want to throw up all missing fields as errors from the beginning. That would be kind of hostile. On the other hand it needs to be clear which form fields must be filled out.

The way we approach this is to display each field label that is required in bold with a * next to it. This is a fairly common convention in form layouts. Secondly will can display the number of missing fields using the above described callbacks or with the Form Error widget described below. If the user has not filled out all the fields and still presses submit we place the form into a "showRequired" mode. In this mode all required fields will be shown in their error state (outlined in red).

The way this works is to call `showRequired()` on the `FormMixin`, or pass `showRequired={true}` to form. It will handle passing that down to each widget where each widget knows how to render based on that prop as well as its current required state (i.e. if it is required and not filled out, it will render in the error state).

In this example, showRequired is simply a state which is turned on by hitting the submit button (instead of actually submitting). We simply pass that state down to the `<ContactForm ...>` on render and the rest happens automatically.

**Note**: The way we handle required fields may be refined over time.

#### Form Error Component

Above all this the forms library also has a component called `FormErrors` for displaying these errors and warnings in a consistent way across our applications. This is shown in the example to the right of the form. You can, of course, just listen to the callbacks and display the totals in whatever way you want, as well as implement any other logic you need to based on them.

Here is an example of using the FormErrors:

    <FormErrors showRequired={this.state.showRequired}
                missingCount={this.state.missingCount}
                numErrors={this.state.errorCount} />

In this form we use the callbacks to hold our own state as to what the error and missing counts are, as well as the showRequired field. These are passed into the FormErrors component and the result is nicely displayed.

This manages three types of error/warning infomation that is displayed to the user:

  - A hard error, which will display in preference to other messages. A hard error
    might be something like "The form could not be saved". This type of error, passed
    in as the `error` prop, is an object with two parts:
       `msg`     - The main error message
       `details` - Further information about the message, like "Unable to make internet connection", or perhaps a raw server message.

  - error count, passed in as `numErrors` prop. If this is passed in then this
    component will display the number of errors on the form. This is used with the
    Form code so that the user can see live how many validation errors are left on
    the page

  - missing count, passed in as `missingCount` prop. If there is not an error on the
    page but `missingCount > 0` then this component will display a n fields to complete
    message. If the prop 'showRequired' is passed in as true, then the form is in the
    mode of actually displaying as an error all missing fields. The message in this
    case will be simply "Form incomplete".

As mentioned above you can also pass in a direct error message to the `FormErrors` component. We use this in the case of a server error where we want that information displayed to the user.



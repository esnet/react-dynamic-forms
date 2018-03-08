## Introduction

---

**NOTE: v1.0 adds support for React 15, but since the way Mixins work in React 15, this is a fairly substantial rewrite to provide an API that doesn't use Mixins at all.**

This repository contains a set of React based forms components which are used within ESnet for our network database application (ESDB), but could be used by any React based project needing to build complex forms.

Our approach is to treat a form as a controlled input, essentially an input with many inputs (which may have many inputs, and so on...) You maintain your form's state however you want, you pass that state down into the form as its value prop. If the form is edited, a callback is called and you can update your form state. When it comes time to save the form, that's up to you, you always have your form's state. On top of this the form has a schema defining rules. Therefore, you can also listen to changes in the count of either missing values or errors. With this information it is simple to control if the user can submit the form as well.

The library is built on Immutable.js, so form state should be passed into the form as an Immutable.Map. This allows efficient operations on your form data, minimizing copying while ensuring safety as the form state is mutated.

While part of defining a form is to specify a schema for your form, you still maintain complete control over the layout in the form in your \`render()\` method, just like any other react app. The schema and presentation are entirely separate.  This React friendly approach makes it easy to build forms which dynamically change values or structure based on the current state of the form.

This library contains:

 * Low level forms control wrappers that communicate errors and missing values to parent components and style themselves appropriately for errors and missing value state. You can write your own in the same way. Supplied standard form controls:
    - Textedit
    - TextArea
    - Checkboxes
    - RadioButtons
    - Chooser (internally we use react-select)
    - TagsEdit (again using react-select)
    - DateEdit (react-datepicker)
 * A <Schema> component that lets you define the rules for each field. Each field is specified in a <Field> component
 * A <Forms> component that acts as a top level controlled input for all of the form state, to assemble controls together and track state change, errors and missing values and enabling dynamic forms with via a declarative schema
 * Higher Order Components:
    - for grouping of controls with their labels, required state and editing control
    - building lists of forms
 * Inline editing
 * List editing

The library is build on several other open source libraries, especially:
 * react
 * immutable.js
 * revalidator
 * react-bootstrap
 * react-select
 * react-virtualized
 * react-datepicker

Please browse the examples for a feel for the library, or read on to get started.

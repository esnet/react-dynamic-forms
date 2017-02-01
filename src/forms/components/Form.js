/**
 *  deepCopyright (c) 2015, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import _ from "underscore";
import deepCopy from "deepcopy";
import React from "react";
import Attr from "./Attr";
import Schema from "./Schema";
import { FormEditStates } from "../constants";

// Pass in the <Schema> element and will return all the <Attrs> under it.
function getAttrsFromSchema(schema) {
  if (!React.isValidElement(schema)) {
    return {};
  }

  let attrs = {};
  if (schema.type === Schema) {
    React.Children.forEach(schema.props.children, child => {
      if (child.type === Attr) {
        attrs[child.props.name] = deepCopy(child.props);
      }
    });
  }
  return attrs;
}

function getRulesFromSchema(schema) {
  if (!React.isValidElement(schema)) {
    return {};
  }

  let rules = {};
  if (schema.type === Schema) {
    React.Children.forEach(schema.props.children, child => {
      if (child.type === Attr) {
        const required = child.props.required || false;
        const validation = deepCopy(child.props.validation);
        rules[child.props.name] = { required, validation };
      }
    });
  }
  return rules;
}

/**
 * Designed to be mixed into your top level forms.
 *
 *   The user of this form should pass as a prop the schema and values (if editing):
 *
 *   schema     - The attributes to be tracked by this form, specifying
 *                meta data associated with each of those attributes
 *
 * To set initial values for the form, use the setValues() method.
 * Internally the state formValues will contain the Initial and current value
 * as the form is edited by the user.
 *
 * Note: You can not currently pass values in as a prop.
 *
 * When building the initial state, the schema will be
 * converted to an internal state representation containing:
 *
 *   formAttrs  - General meta data about each attribute
 *   formRules  - Required state and validation rules
 *
 * The getAttrProps() call:
 *
 *   The getAttrProps() call is supplied with an attrName and collects
 *   together meta data, rules and values associated with that attr
 *   from formAttrs, formRules and formValues. It also attaches callbacks
 *   for missing count, error count, and attr value changes. The
 *   resulting structure can be passed to any of the Group wrapper components
 *   directly so that the display of the control has all the correct
 *   meta data and so that changes to the value and resulting errors
 *   etc, are bubbled up to the formMixin for counting.
 *
 * Missing and Error counts:
 *
 *   The state variables errorCounts and missingCounts hold the current counts
 *   of missing values or errors within the form, keyed by their attrName.
 *   These are maintained via the callbacks added to the form widgets with
 *   the use of the getAttrProps() helper function. Total errorCounts on the form
 *   can be found with the errorCount() function. Similarly, total missing
 *   counts can be found with the missingCount() function.
 *
 * Showing required values:
 *
 *   The current version of ESDB forms will only show an error outline around
 *   unfilled required fields when the user tries and fails to submit the form.
 *   Until then it shows the number of unfilled form items as a more gentle
 *   approach. We may revisit this in the future. To support this, the form
 *   uses the showRequired state value to specify if each widget in the form
 *   should actually show the error state if the field is required but not
 *   filled. You can use the two fuctions on the mixin: showRequiredOn() and
 *   showRequiredOff() to control this state, while showRequired() will return
 *   that state.
 *
 * Dynamic forms:
 *
 *   Sometimes a form will show and hide controls based on the value of another
 *   control. The way to control many fields coming and going from the form is to
 *   tag them (in the schema) and then use setVisible(tag) to update the mixin
 *   internal state to just take those into consideration.
 */
class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = { missingCounts: {}, errorCounts: {}, selection: null };
  }
  /**
     * Collect together props for the given attrName which can
     * be applied to any of the Group wrapped form widgets. These
     * props contain info extracted from our schema and current
     * values, namely from:
     *   - formAttrs
     *   - formRules
     *   - formValues
     *
     * In addition, the props contain callbacks for:
     *   - valueChanged
     *   - missingCountChanged
     *   - errorCountChanged
     *   - edit selection
     */
  getAttrProps({ formAttrs, formRules, formValues, formHiddenList }, attrName) {
    let props = {};

    props.labelWidth = this.props.labelWidth || 300;

    if (_.has(formAttrs, attrName)) {
      props.key = attrName;
      props.attr = attrName;
      props.name = formAttrs[attrName].label;
      props.placeholder = formAttrs[attrName].placeholder;
      props.help = formAttrs[attrName].help;
      props.hidden = false;
      props.disabled = false;

      props.edit = false;
      props.allowEdit = false;
      props.showRequired = true;

      if (this.props.edit === FormEditStates.SELECTED) {
        props.edit = this.state.selection === attrName;
        //console.log("   -", attrName, props.edit);
        props.showRequired = props.edit;
        props.allowEdit = true;
      } else if (this.props.edit === FormEditStates.ALWAYS) {
        props.edit = true;
      } else if (this.props.edit === FormEditStates.NEVER) {
        props.showRequired = false;
      }

      if (formAttrs[attrName].disabled) {
        props.disabled = true;
      }

      if (_.contains(formHiddenList, attrName)) {
        props.disabled = true;
        props.hidden = true;
      }
    } else {
      throw new Error(`Attr '${attrName}' is not a part of the form schema`);
    }

    if (_.has(formRules, attrName)) {
      props.required = formRules[attrName].required;
      props.validation = formRules[attrName].validation;
    }

    if (_.has(formValues, attrName)) {
      props.value = formValues[attrName];
    }

    // Callbacks
    props.onSelectItem = attr => this.handleSelectItem(attr);
    props.onErrorCountChange = (attr, count) =>
      this.handleErrorCountChange(attr, count);
    props.onMissingCountChange = (attr, count) =>
      this.handleMissingCountChange(attr, count);
    props.onChange = (attr, d) => this.handleChange(attr, d);

    return props;
  }

  /**
     * Queue state pushes pending values of state to our parent's callback. The important
     * thing here is that the action is deferred, meaning it will be called only
     * after the callstack is unwound. The deferred action also blocks other deferred
     * actions until it is run.
     *
     * When the deferred action takes place, the following happens:
     *
     *     1 A user action occurs
     *     2 queueChange is called one or many times
     *     3 stack unwinds...
     *     --
     *     4 A state structure is constructed out of the pending structures
     *     5 setState is actually called, which will cause React to re-render
     *         5a rendering may mount new form elements, which may themselves
     *            result in calls to queueChange() (for example: mounted components
     *            will report their missing/error states via supplied callbacks)
     *         5b those changes will also be added to the pending structures, but will
     *            not be flushed until the outer queueChange deferred action is complete
     *     6 callbacks registered with us are called with updated values, missing counts
     *       and error counts
     *     7 stack unwinds...
     *     --
     *     8 stack unwinds again and the deferred action will be called again if another was created
     *       as a side effect of step (5) above
     */
  queueChange() {
    if (!this._deferSet) {
      _.defer(() => {
        this._deferSet = false;

        // Write in missingCounts and errorCounts into our state
        let state = {};
        if (this._pendingMissing) {
          state.missingCounts = this._pendingMissing;
        }
        if (this._pendingErrors) {
          state.errorCounts = this._pendingErrors;
        }
        this.setState(state);

        let missingCount = 0;
        let errorCount = 0;
        if (this._pendingMissing) {
          _.each(this._pendingMissing, c => {
            missingCount += c;
          });
          if (this.props.onMissingCountChange) {
            if (_.isUndefined(this.props.index)) {
              this.props.onMissingCountChange(this.props.attr, missingCount);
            } else {
              this.props.onMissingCountChange(this.props.index, missingCount);
            }
          }
          this._pendingMissing = null;
        }
        if (this._pendingErrors) {
          _.each(this._pendingErrors, c => {
            errorCount += c;
          });
          if (this.props.onErrorCountChange) {
            if (_.isUndefined(this.props.index)) {
              this.props.onErrorCountChange(this.props.attr, errorCount);
            } else {
              this.props.onErrorCountChange(this.props.index, errorCount);
            }
          }
        }

        // Handle registered onChange callback.
        if (this._pendingFormValues) {
          if (this.props.onChange) {
            if (_.isUndefined(this.props.index)) {
              this.props.onChange(this.props.attr, this._pendingFormValues);
            } else {
              this.props.onChange(this.props.index, this._pendingFormValues);
            }

            if (this.state.selection) {
              this.setState({ selection: null });
            }
          }
          this._pendingFormValues = null;
        }

        if (this._pendingHiddenList) {
          this._pendingHiddenList = null;
        }
      });
      this._deferSet = true;
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.props.onSubmit) {
      this.props.onSubmit();
    }
  }

  /**
     * This is the handler for changes to the error state of this form's fields.
     *
     * If a field is complex, such as another form or a list view, then errorCount
     * will be the telly all the errors within that form or list. If it is a simple
     * field such as a textedit then the errorCount will be either 0 or 1.
     *
     * The mapping of field names (passed in as the key) and the count is updated
     * in _pendingErrors until built up state is flushed.
     */
  handleErrorCountChange(key, errorCount) {
    console.log("handleErrorCountChange");
    this._pendingErrors = this._pendingErrors ||
      deepCopy(this.state.errorCounts) ||
      {};
    this._pendingErrors[key] = errorCount;
    this.queueChange(`error change ${key} ${errorCount}`);
  }

  /**
     * This is the handler for changes to the missing state of this form's fields.
     *
     * If a field is complex, such as another form or a list view, then missingCount
     * will be the telly all the missing values (for required fields) within that
     * form or list.
     * If it is a simple field such as a textedit then the missingCount will be
     * either 0 or 1.
     *
     * The mapping of field names (passed in as the key) and the missing count is
     * updated in _pendingMissing until built up state is flushed.
     */
  handleMissingCountChange(key, missingCount) {
    console.log("handleMissingCountChange");

    this._pendingMissing = this._pendingMissing ||
      deepCopy(this.state.missingCounts) ||
      {};
    this._pendingMissing[key] = missingCount;
    this.queueChange(`missing change ${key} ${missingCount}`);
  }

  /**
     * This is the main handler for value change notifications from
     * this form's widgets.
     *
     * As part of this handler we call this.props.willHandleChange()
     * if it is supplied. This hook enables either the value to be modified.
     *
     * Changes to the formValues are queued in _pendingFormValues
     * until built up change is flushed.
     */
  handleChange(attrName, newValue) {
    console.log("handleChange");
    // Hook to allow the component to alter the value before it is set.
    // However, you should be careful with side effects to state here.
    let v = newValue;
    if (this.props.onPendingChange) {
      v = this.props.onPendingChange(attrName, newValue) || v;
    }

    console.log("^^^ HANDLECHANGE ON FORM", attrName, newValue);

    // If we don't have pending form values then we build a
    // base set (from this.props.values and defaults) and then
    // mix in our change
    if (!this._pendingFormValues) {
      this._pendingFormValues = this.getFormValues();
    }
    this._pendingFormValues[attrName] = v;

    // Update the state with the current pendingFormValues
    this.queueChange(`value change ${attrName}`);
  }

  handleSelectItem(attrName) {
    console.log("SELECT", attrName);
    if (this.state.selection !== attrName) {
      this.setState({ selection: attrName });
    } else {
      this.setState({ selection: null });
    }
  }

  /**
   * Returns the current formValues, merging in the current set
   * of values with the default values from the schema and expressing
   * them as a map from attrName -> value || defaultValue
   */
  getFormValues() {
    let result = {};
    const formAttrs = getAttrsFromSchema(this.props.schema);
    _.each(formAttrs, (attr, attrName) => {
      const { defaultValue } = attr;
      const v = _.has(this.props.values, attrName)
        ? this.props.values[attrName]
        : defaultValue;
      result[attrName] = _.isUndefined(v) ? null : v;
    });
    return result;
  }

  /**
   * Returns the current list of hidden form attrs using the visible prop
   * That prop is either a tag or list of tags, that is compared to tags
   * within the schema to determine a visibility set.
   */
  getFormHiddenList(formAttrs) {
    let result = [];
    if (this.props.visible) {
      _.each(formAttrs, (attr, attrName) => {
        let makeHidden;
        const tags = attr.tags || [];
        if (_.isArray(this.props.visible)) {
          makeHidden = !(_.intersection(tags, this.props.visible).length > 0 ||
            _.contains(tags, "all"));
        } else {
          makeHidden = !(_.contains(tags, this.props.visible) ||
            _.contains(tags, "all"));
        }
        if (makeHidden) {
          result.push(attrName);
        }
      });
    }
    return result;
  }

  /**
   * @private
   *
   * Traverses all the children and adds new props to each element.
   * This is what takes the prop attr="someid", looks up someid on the schema
   * and applies all the needed props from the schema, along with callbacks
   * onto the widget itself.
   */
  renderChildren(formState, childList) {
    const childCount = React.Children.count(childList);

    let children = [];
    React.Children.forEach(childList, (child, i) => {
      if (child) {
        let newChild;
        const key = child.key || `key-${i}`;
        let props = { key };
        if (typeof child.props.children !== "string") {
          if (_.has(child.props, "attr")) {
            const attrName = child.props.attr;
            props = { ...props, ...this.getAttrProps(formState, attrName) };
            console.log("props of", attrName, props);
          }
          if (React.Children.count(child.props.children) > 0) {
            props = {
              ...props,
              children: this.renderChildren(formState, child.props.children)
            };
          }
        }
        newChild = React.cloneElement(child, props);
        if (childCount > 1) {
          children.push(newChild);
        } else {
          children = newChild;
        }
      } else {
        children = null;
      }
    });
    return children;
  }

  render() {
    const schema = this.props.schema;
    const formAttrs = getAttrsFromSchema(schema);
    const formRules = getRulesFromSchema(schema);
    const formValues = this.getFormValues();
    const formHiddenList = this.getFormHiddenList(formAttrs);
    const formState = { formAttrs, formRules, formValues, formHiddenList };
    return (
      <form
        className={this.props.formClassName}
        style={this.props.formStyle}
        key={this.props.formKey}
        onSubmit={e => this.handleSubmit(e)}
        noValidate
      >
        {this.renderChildren(formState, this.props.children)}
      </form>
    );
  }
}

Form.defaultProps = {
  formStyle: {},
  formClass: "form-horizontal",
  formKey: "form"
};

export default Form;

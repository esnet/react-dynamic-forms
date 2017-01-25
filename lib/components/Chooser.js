"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactVirtualizedSelect = require("react-virtualized-select");

var _reactVirtualizedSelect2 = _interopRequireDefault(_reactVirtualizedSelect);

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var _stringHash = require("string-hash");

var _stringHash2 = _interopRequireDefault(_stringHash);

require("react-select/dist/react-select.css");

require("react-virtualized/styles.css");

require("react-virtualized-select/styles.css");

require("./chooser.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * React Form control to select an item from a list.
 *
 * Wraps the react-select library
 *
 * ### Example
 *
 * ```
 *     const animalMap = {1: "dog", 2: "duck", 3: "cat", ...};
 *     const animalList = animalMap.map((value, key) => ({id: key, label: value}));
 *
 *     ...
 *
 *     <Chooser
 *         initialChoiceList={animalList}
 *         placeholder="Select an Animal..."
 *         width={300}
 *     />
 * ```
 *
 * Generally you would use the Chooser as part of a `ChooserGroup`:
 *
 * ```
 *    <ChooserGroup
 *        attr="contact_type"
          initialChoice={contactType}
          initialChoiceList={contactTypes}
          disableSearch={true}
          width={200}
      />
 * ```
 *
 * ### Props
 *
 *  * *initialChoice* - Pass in the initial value as an id
 *
 *  * *initialChoiceList* - Pass in the available list of options as a list of
 *    objects. For example:
 *
 *    ```
 *    [{id: 1: label: "cat"},
 *     {id: 2: label: "dog"},
 *     ... ]
 *    ```
 *  * *disableSearch* - If true the chooser becomes a simple pulldown menu
 *    rather than allowing the user to type into it.
 *
 *  * *width* - Customize the horizontal size of the Chooser.
 *
 *  * *attr* - The identifier of the property being editted
 *
 *  * *onChange* - Callback for when value changes. Will be passed the attr and
 *    new value as a string.
 *
 *  * *allowSingleDeselect* - Add a [x] icon to the chooser allowing the user to
 *    clear the selected value
 *
 *  * *searchContains* - Can be "any" or "start", indicating how the search is
 *    matched within the items (anywhere, or starting with).
 */
/**
 *  Copyright (c) 2015, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

exports.default = _react2.default.createClass({
  displayName: "Chooser",
  getDefaultProps: function getDefaultProps() {
    return {
      disabled: false,
      disableSearch: false,
      searchContains: true,
      allowSingleDeselect: false,
      width: 300
    };
  },
  getInitialState: function getInitialState() {
    return {
      initialChoice: this.props.initialChoice,
      value: this.props.initialChoice,
      missing: false
    };
  },
  _isEmpty: function _isEmpty(value) {
    return _underscore2.default.isNull(value) || _underscore2.default.isUndefined(value) || value === "";
  },
  _isMissing: function _isMissing() {
    return this.props.required && !this.props.disabled && this._isEmpty(this.state.value);
  },
  _generateKey: function _generateKey(choice, choiceList) {
    var key = (0, _stringHash2.default)(_underscore2.default.map(choiceList, function (label) {
      return label;
    }).join("-"));
    key += "-" + choice;
    return key;
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    if (this.state.initialChoice !== nextProps.initialChoice) {
      var key = this._generateKey(nextProps.initialChoice, this.props.initialChoiceList);
      this.setState({
        key: key,
        initialChoice: nextProps.initialChoice,
        value: nextProps.initialChoice
      });

      // The value might have been missing and is now set explicitly
      // with a prop
      var missing = this.props.required && !this.props.disabled && (_underscore2.default.isNull(nextProps.initialChoice) || _underscore2.default.isUndefined(nextProps.initialChoice) || nextProps.initialChoice === "");
      var missingCount = missing ? 1 : 0;

      if (this.props.onMissingCountChange) {
        this.props.onMissingCountChange(this.props.attr, missingCount);
      }
    }
  },

  /**
     * If there's no initialValue for the chooser and this field is required
     * then report the missing count up to the parent.
     */
  componentDidMount: function componentDidMount() {
    var missing = this.props.required && !this.props.disabled && (_underscore2.default.isNull(this.props.initialChoice) || _underscore2.default.isUndefined(this.props.initialChoice) || this.props.initialChoice === "");
    var missingCount = missing ? 1 : 0;

    if (this.props.onMissingCountChange) {
      this.props.onMissingCountChange(this.props.attr, missingCount);
    }

    // The key needs to change if the initialChoiceList changes, so we set
    // the key to be the hash of the choice list
    this.setState({
      missing: missing,
      key: this._generateKey(this.props.initialChoice, this.props.initialChoiceList)
    });
  },
  handleChange: function handleChange(v) {
    var _ref = v || {},
        value = _ref.value;

    var missing = this.props.required && this._isEmpty(v);

    // If the chosen id is a number, cast it to a number
    if (!this._isEmpty(v) && !_underscore2.default.isNaN(Number(v))) {
      value = +v;
    }

    // State changes
    this.setState({ value: value, missing: missing });

    // Callbacks
    if (this.props.onChange) {
      this.props.onChange(this.props.attr, value);
    }
    if (this.props.onMissingCountChange) {
      this.props.onMissingCountChange(this.props.attr, missing ? 1 : 0);
    }
  },
  getOptionList: function getOptionList() {
    var _this = this;

    return _underscore2.default.map(this.props.initialChoiceList, function (c) {
      var disabled = false;
      var isDisabled = _underscore2.default.has(c, "disabled") && c.disabled === true;
      if (_underscore2.default.contains(_this.props.disableList, c.id) || isDisabled) {
        disabled = true;
      }
      return { value: c.id, label: c.label, disabled: disabled };
    });
  },
  getFilteredOptionList: function getFilteredOptionList(input) {
    var items = this.props.initialChoiceList;
    var filteredItems = input ? _underscore2.default.filter(items, function (item) {
      return item.label.toLowerCase().indexOf(("" + input).toLowerCase()) !== -1;
    }) : items;
    return _underscore2.default.map(filteredItems, function (c) {
      return {
        value: "" + c.id,
        label: c.label,
        disabled: _underscore2.default.has(c, "disabled") ? c.disabled : false
      };
    });
  },
  getOptions: function getOptions(input, cb) {
    var options = this.getFilteredOptionList(input);
    if (options) {
      cb(null, { options: options, complete: true });
    }
  },
  getCurrentChoice: function getCurrentChoice() {
    var _this2 = this;

    var choiceItem = _underscore2.default.find(this.props.initialChoiceList, function (item) {
      return item.id === _this2.state.value;
    });

    return choiceItem ? choiceItem.id : undefined;
  },
  render: function render() {
    var className = "";

    var width = this.props.width ? this.props.width + "px" : "100%";

    var chooserStyle = { width: width, marginBottom: 10 };

    if (!this.props.initialChoiceList) {
      throw new Error("No initial choice list supplied for attr '" + this.props.attr + "'");
    }

    if (this.props.showRequired && this._isMissing()) {
      className = "has-error";
    }

    var choice = this.getCurrentChoice();
    var clearable = this.props.allowSingleDeselect;
    var searchable = !this.props.disableSearch;
    var matchPos = this.props.searchContains ? "any" : "start";

    if (searchable) {
      var options = this.getFilteredOptionList(null);
      var labelList = _underscore2.default.map(options, function (item) {
        return item.label;
      });
      var key = labelList + "--" + choice;
      return _react2.default.createElement(
        "div",
        { className: className, style: chooserStyle },
        _react2.default.createElement(_reactVirtualizedSelect2.default, {
          className: "sectionTest",
          key: key,
          name: "form-field-name",
          value: choice,
          options: options,
          disabled: this.props.disabled,
          searchable: true,
          matchPos: matchPos,
          onChange: this.handleChange,
          placeholder: this.props.placeholder
        })
      );
    } else {
      var _options = this.getOptionList();
      var _labelList = _underscore2.default.map(_options, function (item) {
        return item.label;
      });
      var _key = _labelList + "--" + choice;
      return _react2.default.createElement(
        "div",
        { className: className, style: chooserStyle },
        _react2.default.createElement(_reactVirtualizedSelect2.default, {
          className: "sectionTest",
          key: _key,
          name: "form-field-name",
          value: choice,
          options: _options,
          disabled: this.props.disabled,
          searchable: false,
          clearable: clearable,
          matchPos: matchPos,
          onChange: this.handleChange,
          placeholder: this.props.placeholder
        })
      );
    }
  }
});
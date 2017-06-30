"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactVirtualizedSelect = require("react-virtualized-select");

var _reactVirtualizedSelect2 = _interopRequireDefault(_reactVirtualizedSelect);

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var _formGroup = require("../formGroup");

var _formGroup2 = _interopRequireDefault(_formGroup);

require("react-select/dist/react-select.css");

require("react-virtualized/styles.css");

require("react-virtualized-select/styles.css");

require("./css/chooser.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  Copyright (c) 2015-2017, The Regents of the University of California,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  through Lawrence Berkeley National Laboratory (subject to receipt
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  of any required approvals from the U.S. Dept. of Energy).
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  All rights reserved.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  This source code is licensed under the BSD-style license found in the
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  LICENSE file in the root directory of this source tree.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

/**
 * React Form control to select an item from a list.
 *
 *
 * ### Props
 *
 *  * *choiceList* - Pass in the available list of options as a list of
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
 *  * *width* - Customize the horizontal size of the Chooser
 *
 *  * *field* - The identifier of the field being edited
 *
 *  * *onChange* - Callback for when value changes
 *
 *  * *allowSingleDeselect* - Add a [x] icon to the chooser allowing the user to
 *    clear the selected value
 *
 *  * *searchContains* - Can be "any" or "start", indicating how the search is
 *    matched within the items (anywhere, or starting with)
 */
var Chooser = function (_React$Component) {
  _inherits(Chooser, _React$Component);

  function Chooser() {
    _classCallCheck(this, Chooser);

    return _possibleConstructorReturn(this, (Chooser.__proto__ || Object.getPrototypeOf(Chooser)).apply(this, arguments));
  }

  _createClass(Chooser, [{
    key: "isEmpty",
    value: function isEmpty(value) {
      return _underscore2.default.isNull(value) || _underscore2.default.isUndefined(value) || value === "";
    }
  }, {
    key: "isMissing",
    value: function isMissing() {
      var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props.value;

      return this.props.required && !this.props.disabled && this.isEmpty(value);
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      if (this.props.value !== nextProps.value) {
        // The value might have been missing and is now set explicitly
        // with a prop
        var missing = this.props.required && !this.props.disabled && (_underscore2.default.isNull(nextProps.value) || _underscore2.default.isUndefined(nextProps.value) || nextProps.value === "");
        var missingCount = missing ? 1 : 0;

        if (this.props.onMissingCountChange) {
          this.props.onMissingCountChange(this.props.name, missingCount);
        }
      }
    }
  }, {
    key: "handleChange",
    value: function handleChange(v) {
      var _ref = v || {},
          value = _ref.value;

      var missing = this.props.required && this.isEmpty(v);

      // If the chosen id is a number, cast it to a number
      if (!this.isEmpty(v) && !_underscore2.default.isNaN(Number(v))) {
        value = +v;
      }

      // Callbacks
      if (this.props.onChange) {
        this.props.onChange(this.props.name, value);
      }
      if (this.props.onMissingCountChange) {
        this.props.onMissingCountChange(this.props.name, missing ? 1 : 0);
      }
    }
  }, {
    key: "getOptionList",
    value: function getOptionList() {
      var _this2 = this;

      return this.props.choiceList.map(function (item) {
        var disabled = false;
        var isDisabled = item.has("disabled") && item.get("disabled") === true;
        if (_underscore2.default.contains(_this2.props.disableList, item.get("id")) || isDisabled) {
          disabled = true;
        }
        return { value: item.get("id"), label: item.get("label"), disabled: disabled };
      }).toJS();
    }
  }, {
    key: "getFilteredOptionList",
    value: function getFilteredOptionList(input) {
      var items = this.props.choiceList;
      var filteredItems = input ? items.filter(function (item) {
        return item.label.toLowerCase().indexOf(("" + input).toLowerCase()) !== -1;
      }) : items;
      var result = [];
      filteredItems.forEach(function (item) {
        return result.push({
          value: "" + item.get("id"),
          label: item.get("label"),
          disabled: item.has("disabled") ? item.get("disabled") : false
        });
      });
      return result;
    }
  }, {
    key: "getOptions",
    value: function getOptions(input, cb) {
      var options = this.getFilteredOptionList(input);
      if (options) {
        cb(null, { options: options, complete: true });
      }
    }
  }, {
    key: "getCurrentChoice",
    value: function getCurrentChoice() {
      var _this3 = this;

      var choiceItem = this.props.choiceList.find(function (item) {
        return item.get("id") === _this3.props.value;
      });
      return choiceItem ? choiceItem.get("id") : undefined;
    }
  }, {
    key: "getCurrentChoiceLabel",
    value: function getCurrentChoiceLabel() {
      var _this4 = this;

      var choiceItem = this.props.choiceList.find(function (item) {
        return item.get("id") === _this4.props.value;
      });
      return choiceItem ? choiceItem.get("label") : "";
    }
  }, {
    key: "render",
    value: function render() {
      var _this5 = this;

      var choice = this.getCurrentChoice();
      var isMissing = this.isMissing(this.props.value);

      if (this.props.edit) {
        var className = "";
        var chooserStyle = { marginBottom: 10 };
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
              className: isMissing ? "is-missing" : "",
              key: key,
              name: "form-field-name",
              value: choice,
              options: options,
              disabled: this.props.disabled,
              searchable: true,
              matchPos: matchPos,
              placeholder: this.props.placeholder,
              onChange: function onChange(v) {
                return _this5.handleChange(v);
              }
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
              className: isMissing ? "is-missing" : "",
              key: _key,
              name: "form-field-name",
              value: choice,
              options: _options,
              disabled: this.props.disabled,
              searchable: false,
              clearable: clearable,
              matchPos: matchPos,
              placeholder: this.props.placeholder,
              onChange: function onChange(v) {
                return _this5.handleChange(v);
              }
            })
          );
        }
      } else {
        var view = this.props.view;
        var text = this.getCurrentChoiceLabel();
        var color = "inherited";
        var background = "inherited";
        if (isMissing) {
          text = " ";
          background = "floralwhite";
        }

        var viewStyle = {
          color: color,
          background: background,
          width: "100%",
          paddingLeft: 3
        };

        var style = {
          color: color,
          background: background,
          height: 23,
          width: "100%",
          paddingLeft: 3
        };

        if (!view) {
          return _react2.default.createElement(
            "div",
            { style: style },
            text
          );
        } else {
          return _react2.default.createElement(
            "div",
            { style: viewStyle },
            view(text, choice)
          );
        }
      }
    }
  }]);

  return Chooser;
}(_react2.default.Component);

Chooser.defaultProps = {
  disabled: false,
  disableSearch: false,
  searchContains: true,
  allowSingleDeselect: false,
  width: 300
};

exports.default = (0, _formGroup2.default)(Chooser);
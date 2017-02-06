"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var _reactDatepicker = require("react-datepicker");

var _reactDatepicker2 = _interopRequireDefault(_reactDatepicker);

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _formGroup = require("../formGroup");

var _formGroup2 = _interopRequireDefault(_formGroup);

require("react-datepicker/dist/react-datepicker.css");

require("./css/dateedit.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  Copyright (c) 2015, The Regents of the University of California,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  through Lawrence Berkeley National Laboratory (subject to receipt
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  of any required approvals from the U.S. Dept. of Energy).
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  All rights reserved.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  This source code is licensed under the BSD-style license found in the
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  LICENSE file in the root directory of this source tree.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

/**
 * Form control to edit a date text field.
 *
 * Set the initial value with 'initialValue' and set a callback for
 * value changed with 'onChange'.
 */
var DateEdit = function (_React$Component) {
  _inherits(DateEdit, _React$Component);

  function DateEdit(props) {
    _classCallCheck(this, DateEdit);

    var _this = _possibleConstructorReturn(this, (DateEdit.__proto__ || Object.getPrototypeOf(DateEdit)).call(this, props));

    _this.state = {
      initialValue: props.initialValue,
      value: props.initialValue,
      missing: false,
      showPicker: false
    };
    return _this;
  }

  _createClass(DateEdit, [{
    key: "isEmpty",
    value: function isEmpty(value) {
      return _underscore2.default.isNull(value) || _underscore2.default.isUndefined(value);
    }
  }, {
    key: "isMissing",
    value: function isMissing(v) {
      console.log("date", v);
      return this.props.required && !this.props.disabled && this.isEmpty(v);
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      var previousValue = this.state.initialValue ? this.state.initialValue.getTime() : null;
      var nextValue = nextProps.initialValue ? nextProps.initialValue.getTime() : null;
      if (previousValue !== nextValue) {
        this.setState({
          initialValue: nextProps.initialValue,
          value: nextProps.initialValue
        });

        var missing = this.isMissing(nextProps.initialValue);

        // Re-broadcast missing state up to the owner
        if (this.props.onMissingCountChange) {
          this.props.onMissingCountChange(this.props.name, missing ? 1 : 0);
        }
      }
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var missing = this.isMissing(this.props.initialValue);
      var value = this.props.initialValue;

      this.setState({ value: value, missing: missing });

      if (this.props.onMissingCountChange) {
        this.props.onMissingCountChange(this.props.name, missing ? 1 : 0);
      }
    }
  }, {
    key: "handleDateChange",
    value: function handleDateChange(v) {
      var value = v ? v.toDate() : null;
      var missing = this.props.required && this.isEmpty(value);

      console.log("handleDateChange", value);

      this.setState({ value: value, missing: missing });

      // Callbacks
      if (this.props.onChange) {
        this.props.onChange(this.props.name, value);
      }
      if (this.props.onMissingCountChange) {
        this.props.onMissingCountChange(this.props.name, missing ? 1 : 0);
      }
    }
  }, {
    key: "inlineStyle",
    value: function inlineStyle(hasError, isMissing) {
      var color = "inherited";
      var background = "inherited";
      var borderLeftStyle = "inherited";
      var borderLeftColor = "inherited";
      var borderLeftWidth = 2;
      if (this.state.error) {
        color = "#b94a48";
        background = "#fff0f3";
        borderLeftStyle = "solid";
        borderLeftColor = "#b94a48";
      } else if (isMissing) {
        background = "floralwhite";
        borderLeftStyle = "solid";
        borderLeftColor = "orange";
      }
      return {
        color: color,
        background: background,
        borderLeftStyle: borderLeftStyle,
        borderLeftColor: borderLeftColor,
        borderLeftWidth: borderLeftWidth,
        height: 23,
        width: "100%",
        paddingLeft: 3
      };
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var selected = this.state.value ? (0, _moment2.default)(this.state.value) : null;
      var className = "datepicker__input rdf";
      var isMissing = this.isMissing(this.state.value);
      if (this.state.error) {
        className = "datepicker__input rdf has-error";
      }
      if (isMissing) {
        className += " is-missing";
      }

      if (this.props.edit) {
        return _react2.default.createElement(
          "div",
          null,
          _react2.default.createElement(
            "div",
            null,
            _react2.default.createElement(_reactDatepicker2.default, {
              key: "date",
              ref: "input",
              className: className,
              disabled: this.props.disabled,
              placeholderText: this.props.placeholder,
              selected: selected,
              onBlur: function onBlur() {
                return _this2.handleOnBlur();
              },
              onChange: function onChange(v) {
                return _this2.handleDateChange(v);
              }
            })
          )
        );
      } else {
        var _isMissing = this.isMissing(this.state.value);
        var hasError = this.state.error;
        var text = selected ? selected.format("MM/DD/YYYY") : "";
        if (_isMissing) {
          text = " ";
        }
        var style = this.inlineStyle(hasError, _isMissing);
        return _react2.default.createElement(
          "div",
          { style: style },
          text
        );
      }
    }
  }]);

  return DateEdit;
}(_react2.default.Component);

DateEdit.defaultProps = {
  width: "100%"
};

exports.default = (0, _formGroup2.default)(DateEdit);
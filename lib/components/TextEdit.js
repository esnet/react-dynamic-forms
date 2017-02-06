"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _revalidator = require("revalidator");

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var _stringHash = require("string-hash");

var _stringHash2 = _interopRequireDefault(_stringHash);

var _formGroup = require("../formGroup");

var _formGroup2 = _interopRequireDefault(_formGroup);

require("./css/textedit.css");

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
 * Form control to edit a text field.
 * Set the initial value with 'initialValue' and set a callback for
 * value changed with 'onChange'.
 */
var TextEdit = function (_React$Component) {
  _inherits(TextEdit, _React$Component);

  function TextEdit(props) {
    _classCallCheck(this, TextEdit);

    var _this = _possibleConstructorReturn(this, (TextEdit.__proto__ || Object.getPrototypeOf(TextEdit)).call(this, props));

    _this.state = {
      value: props.value,
      error: null,
      errorMsg: "",
      missing: false,
      type: "text"
    };
    return _this;
  }

  _createClass(TextEdit, [{
    key: "isEmpty",
    value: function isEmpty(value) {
      return _underscore2.default.isNull(value) || _underscore2.default.isUndefined(value) || value === "";
    }
  }, {
    key: "isMissing",
    value: function isMissing(v) {
      return this.props.required && !this.props.disabled && this.isEmpty(v);
    }
  }, {
    key: "getError",
    value: function getError(value) {
      var result = { validationError: false, validationErrorMessage: null };

      // If the user has a field blank then that is never an error. Likewise if the field
      // is disabled then that is never an error.
      if (this.isEmpty(value) || this.props.disabled) {
        return result;
      }

      // Validate the value with Revalidator, given the rules in this.props.rules
      var obj = {};
      obj[this.props.name] = value;

      var properties = {};
      properties[this.props.name] = this.props.validation;

      var rules = this.props.validation ? { properties: properties } : null;
      if (obj && rules) {
        var validation = (0, _revalidator.validate)(obj, rules, { cast: true });
        var name = this.props.name || "Value";

        var msg = void 0;
        if (!validation.valid) {
          msg = name + " " + validation.errors[0].message;
          result.validationError = true;
          result.validationErrorMessage = msg;
        }
      }
      return result;
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      if (this.state.value !== nextProps.value) {
        this.setState({ value: nextProps.value });
        var missing = this.isMissing(nextProps.value);
        var error = this.getError(nextProps.value);

        // Re-broadcast error and missing states up to the owner
        if (this.props.onErrorCountChange) {
          this.props.onErrorCountChange(this.props.name, error.validationError ? 1 : 0);
        }

        if (this.props.onMissingCountChange) {
          this.props.onMissingCountChange(this.props.name, missing ? 1 : 0);
        }
      }
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var missing = this.isMissing(this.props.value);
      var error = this.getError(this.props.value);
      var value = this.props.value;

      this.setState({
        value: value,
        missing: missing,
        error: error.validationError,
        errorMsg: error.validationErrorMessage
      });

      // Initial error and missing states are fed up to the owner
      if (this.props.onErrorCountChange) {
        this.props.onErrorCountChange(this.props.name, error.validationError ? 1 : 0);
      }

      if (this.props.onMissingCountChange) {
        this.props.onMissingCountChange(this.props.name, missing ? 1 : 0);
      }
    }
  }, {
    key: "onBlur",
    value: function onBlur() {
      var value = this.refs.input.value;
      var missing = this.props.required && this.isEmpty(value);
      var error = this.getError(value);

      var cast = value;

      // State changes
      this.setState({
        value: value,
        missing: missing,
        error: error.validationError,
        errorMsg: error.validationErrorMessage
      });

      // Callbacks
      if (this.props.onChange) {
        if (_underscore2.default.has(this.props.rules, "type")) {
          switch (this.props.rules.type) {
            case "integer":
              cast = value === "" ? null : parseInt(value, 10);
              break;
            case "number":
              cast = value === "" ? null : parseFloat(value, 10);
              break;
            //pass
            default:
          }
        }
        this.props.onChange(this.props.name, cast);
      }
      if (this.props.onErrorCountChange) {
        this.props.onErrorCountChange(this.props.name, error.validationError ? 1 : 0);
      }
      if (this.props.onMissingCountChange) {
        this.props.onMissingCountChange(this.props.name, missing ? 1 : 0);
      }
    }
  }, {
    key: "onFocus",
    value: function onFocus() {
      this.setState({ error: false, errorMsg: "" });
    }
  }, {
    key: "inlineStyle",
    value: function inlineStyle(hasError, isMissing) {
      var color = "inherited";
      var background = "inherited";
      var borderLeftStyle = "inherited";
      var borderLeftColor = "inherited";
      var borderLeftWidth = 2;
      if (hasError) {
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

      if (this.props.edit) {
        // Error text
        var msg = this.state.error ? this.state.errorMsg : "";
        var helpClassName = "help-block";
        if (this.state.error) {
          helpClassName += " has-error";
        }

        // Warning style
        var style = this.isMissing(this.state.value) ? { background: "floralwhite" } : {};

        var key = (0, _stringHash2.default)(this.props.value || "");

        return _react2.default.createElement(
          "div",
          null,
          _react2.default.createElement("input", {
            required: true,
            key: key,
            ref: "input",
            className: "form-control input-sm",
            style: style,
            type: this.props.type,
            disabled: this.props.disabled,
            placeholder: this.props.placeholder,
            defaultValue: this.props.value,
            onBlur: function onBlur() {
              return _this2.onBlur();
            },
            onFocus: function onFocus() {
              return _this2.onFocus();
            }
          }),
          _react2.default.createElement(
            "div",
            { className: helpClassName },
            msg
          )
        );
      } else {
        var isMissing = this.isMissing(this.state.value);
        var hasError = this.state.error;
        var text = this.props.value;
        if (isMissing) {
          text = " ";
        }
        var _style = this.inlineStyle(hasError, isMissing);
        return _react2.default.createElement(
          "div",
          { style: _style },
          text
        );
      }
    }
  }]);

  return TextEdit;
}(_react2.default.Component);

exports.default = (0, _formGroup2.default)(TextEdit);
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var _deepcopy = require("deepcopy");

var _deepcopy2 = _interopRequireDefault(_deepcopy);

var _flexboxReact = require("flexbox-react");

var _flexboxReact2 = _interopRequireDefault(_flexboxReact);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Field = require("./Field");

var _Field2 = _interopRequireDefault(_Field);

var _Schema = require("./Schema");

var _Schema2 = _interopRequireDefault(_Schema);

var _constants = require("../js/constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  Copyright (c) 2015 - present, The Regents of the University of California,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  through Lawrence Berkeley National Laboratory (subject to receipt
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  of any required approvals from the U.S. Dept. of Energy).
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  All rights reserved.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  This source code is licensed under the BSD-style license found in the
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  LICENSE file in the root directory of this source tree.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

// Pass in the <Schema> element and will return all the <Fields> under it.
function getFieldsFromSchema(schema) {
    if (!_react2.default.isValidElement(schema)) {
        return {};
    }

    var fields = {};
    if (schema.type === _Schema2.default) {
        _react2.default.Children.forEach(schema.props.children, function (child) {
            if (child.type === _Field2.default) {
                fields[child.props.name] = (0, _deepcopy2.default)(child.props);
            }
        });
    }
    return fields;
}

function getRulesFromSchema(schema) {
    if (!_react2.default.isValidElement(schema)) {
        return {};
    }

    var rules = {};
    if (schema.type === _Schema2.default) {
        _react2.default.Children.forEach(schema.props.children, function (child) {
            if (child.type === _Field2.default) {
                var required = child.props.required || false;
                var validation = (0, _deepcopy2.default)(child.props.validation);
                // the conform is a function that can not be copied properly
                if (child.props.validation && "conform" in child.props.validation) {
                    validation["conform"] = child.props.validation["conform"];
                }
                rules[child.props.name] = { required: required, validation: validation };
            }
        });
    }
    return rules;
}

var Form = function (_React$Component) {
    _inherits(Form, _React$Component);

    function Form(props) {
        _classCallCheck(this, Form);

        var _this = _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).call(this, props));

        _this.state = {
            missingCounts: {},
            errorCounts: {},
            selection: null
        };
        return _this;
    }

    /**
     * Collect together props for the given fieldName which can
     * be applied to any of the formGroup wrapped form widgets. These
     * props contain info extracted from our schema and current
     * values, namely from:
     *   - formFields
     *   - formRules
     *   - formValues
     *
     * In addition, the props contain callbacks for:
     *   - value changed
     *   - missing count changed
     *   - error counts changed
     *   - edit selection
     */


    _createClass(Form, [{
        key: "getFieldProps",
        value: function getFieldProps(_ref, fieldName) {
            var _this2 = this;

            var formFields = _ref.formFields,
                formRules = _ref.formRules,
                formHiddenList = _ref.formHiddenList;

            var props = {};
            props.labelWidth = this.props.labelWidth || 300;

            if (_underscore2.default.has(formFields, fieldName)) {
                props.key = fieldName;
                props.name = fieldName;
                props.label = formFields[fieldName].label;
                props.placeholder = formFields[fieldName].placeholder;
                props.help = formFields[fieldName].help;
                props.hidden = false;
                props.disabled = false;

                props.edit = false;
                props.showRequired = true;

                if (this.props.edit === _constants.FormEditStates.SELECTED) {
                    props.edit = this.state.selection === fieldName;
                    props.showRequired = props.edit;
                    props.allowEdit = true;
                } else if (this.props.edit === _constants.FormEditStates.ALWAYS) {
                    props.edit = true;
                } else if (this.props.edit === _constants.FormEditStates.NEVER) {
                    props.showRequired = false;
                }

                if (this.props.edit === _constants.FormEditStates.TABLE) {
                    props.layout = _constants.FormGroupLayout.INLINE;
                } else {
                    props.layout = this.props.groupLayout;
                }

                if (formFields[fieldName].disabled) {
                    props.disabled = true;
                }

                if (_underscore2.default.contains(formHiddenList, fieldName)) {
                    props.disabled = true;
                    props.hidden = true;
                }
            } else {
                throw new Error("Attr '" + fieldName + "' is not a part of the form schema");
            }

            // If the field is required and validation rules
            if (_underscore2.default.has(formRules, fieldName)) {
                props.required = formRules[fieldName].required;
                props.validation = formRules[fieldName].validation;
            }

            // Field value
            if (this.props.value.has(fieldName)) {
                props.value = this.props.value.get(fieldName);
            }

            // Callbacks
            props.onSelectItem = function (fieldName) {
                return _this2.handleSelectItem(fieldName);
            };
            props.onErrorCountChange = function (fieldName, count) {
                return _this2.handleErrorCountChange(fieldName, count);
            };
            props.onMissingCountChange = function (fieldName, count) {
                return _this2.handleMissingCountChange(fieldName, count);
            };
            props.onChange = function (fieldName, d) {
                return _this2.handleChange(fieldName, d);
            };
            props.onBlur = function (fieldName) {
                return _this2.handleBlur(fieldName);
            };

            return props;
        }

        /**
         * Queue state pushes pending value of state to our parent's callback. The important
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

    }, {
        key: "queueChange",
        value: function queueChange() {
            var _this3 = this;

            if (!this._deferSet) {
                _underscore2.default.defer(function () {
                    _this3._deferSet = false;

                    // Write in missingCounts and errorCounts into our state
                    var state = {};
                    if (_this3._pendingMissing) {
                        state.missingCounts = _this3._pendingMissing;
                    }
                    if (_this3._pendingErrors) {
                        state.errorCounts = _this3._pendingErrors;
                    }
                    _this3.setState(state);

                    var missingCount = 0;
                    var errorCount = 0;

                    var schema = _this3.props.schema;
                    var formFields = getFieldsFromSchema(schema);
                    var ignoreList = _this3.getHiddenFields(formFields);

                    // Missing count callback
                    if (_this3._pendingMissing) {
                        var missingFields = [];
                        _underscore2.default.each(_this3._pendingMissing, function (c, fieldName) {
                            if (!_underscore2.default.contains(ignoreList, fieldName)) {
                                missingCount += c;
                                missingFields.push(fieldName);
                            }
                        });
                        if (_this3.props.onMissingCountChange) {
                            _this3.props.onMissingCountChange(_this3.props.name, missingCount, missingFields);
                        }
                        _this3._pendingMissing = null;
                    }

                    // Error callback
                    if (_this3._pendingErrors) {
                        var errorFields = [];
                        _underscore2.default.each(_this3._pendingErrors, function (c, fieldName) {
                            if (!_underscore2.default.contains(ignoreList, fieldName)) {
                                missingCount += c;
                                errorFields.push(fieldName);
                            }
                            errorCount += c;
                        });
                        if (_this3.props.onErrorCountChange) {
                            _this3.props.onErrorCountChange(_this3.props.name, errorCount, errorFields);
                        }
                    }

                    // On change callback
                    if (_this3._pendingValues) {
                        if (_this3.props.onChange) {
                            _this3.props.onChange(_this3.props.name, _this3._pendingValues);
                        }
                        _this3._pendingValues = null;
                    }
                });
                this._deferSet = true;
            }
        }

        /**
         * If the form has a submit input and that fires then this will catch that
         * and pass it up to the forms onSubmit callback.
         */

    }, {
        key: "handleSubmit",
        value: function handleSubmit(e) {
            e.preventDefault();
        }

        /**
         * This is the handler for changes to the error state of this form's fields.
         *
         * If a field is complex, such as another form or a list view, then errorCount
         * will be the telly all the errors within that form or list. If it is a simple
         * field control, such as a textedit then the errorCount will be either 0 or 1.
         *
         * The mapping of field names (passed in as the fieldName) and the count is updated
         * in _pendingErrors until built up state is flushed to the related callback.
         */

    }, {
        key: "handleErrorCountChange",
        value: function handleErrorCountChange(fieldName, errorCount) {
            this._pendingErrors = this._pendingErrors || (0, _deepcopy2.default)(this.state.errorCounts) || {};
            this._pendingErrors[fieldName] = errorCount;
            this.queueChange();
        }

        /**
         * This is the handler for changes to the missing state of this form controls.
         *
         * If a field is complex, such as another form or a list view, then missingCount
         * will be the telly all the missing values (for required fields) within that
         * form or list. If it is a simple control such as a textedit then the
         * missingCount will be either 0 or 1.
         *
         * The mapping of field names (passed in as the fieldName) and the missing count is
         * updated in _pendingMissing until built up state is flushed to the related callback.
         */

    }, {
        key: "handleMissingCountChange",
        value: function handleMissingCountChange(fieldName, missingCount) {
            this._pendingMissing = this._pendingMissing || (0, _deepcopy2.default)(this.state.missingCounts) || {};
            this._pendingMissing[fieldName] = missingCount;
            this.queueChange();
        }

        /**
         * This is the main handler for value change notifications from
         * this form's controls.
         *
         * As part of this handler we call this.props.onPendingChange()
         * if it is supplied. This hook enables either the value to be modified
         * before it is included in the updated state.
         *
         * Changes to the formValues are queued in _pendingValues
         * until built up change is flushed to the onChange callback.
         */

    }, {
        key: "handleChange",
        value: function handleChange(fieldName, newValue) {
            // Hook to allow the component to alter the value before it is set.
            // However, you should be careful with side effects to state here.
            var v = newValue;
            if (this.props.onPendingChange) {
                v = this.props.onPendingChange(fieldName, newValue) || v;
            }

            // If we don't have pending values then we build initialize them
            // out of the current values, then build on top of that with any
            // change notifications we get. We deliver those batched together
            // in queueChange after we've accumulated missing and error counts.

            this._pendingValues = this._pendingValues || this.props.value;
            this._pendingValues = this._pendingValues.set(fieldName, v);
            this.queueChange();
        }
    }, {
        key: "handleBlur",
        value: function handleBlur(fieldName) {
            if (this.state.selection) {
                this.setState({ selection: null });
            }
        }

        /**
         * Handle the selection change. This is when you have an inline form
         * and the user clicks on the pencil icon to activate editing of
         * that item. That item is the selection. Only one item can be selected
         * at once. If the same item is selected again it is deselected.
         */

    }, {
        key: "handleSelectItem",
        value: function handleSelectItem(fieldName) {
            if (this.state.selection !== fieldName) {
                this.setState({ selection: fieldName });
            } else {
                this.setState({ selection: null });
            }
        }

        /**
         * @private
         *
         * Returns the current list of hidden form fields using the `visible` prop
         * That prop is either a tag or list of tags. Those are compared to tags
         * for each field within the schema to determine a visibility set of fields.
         * This is called every render.
         */

    }, {
        key: "getHiddenFields",
        value: function getHiddenFields(formFields) {
            var _this4 = this;

            var result = [];
            if (this.props.visible) {
                _underscore2.default.each(formFields, function (field, fieldName) {
                    var makeHidden = void 0;
                    var tags = field.tags || [];
                    if (_underscore2.default.isArray(_this4.props.visible)) {
                        makeHidden = !(_underscore2.default.intersection(tags, _this4.props.visible).length > 0 || _underscore2.default.contains(tags, "all"));
                    } else {
                        makeHidden = !(_underscore2.default.contains(tags, _this4.props.visible) || _underscore2.default.contains(tags, "all"));
                    }
                    if (makeHidden) {
                        result.push(fieldName);
                    }
                });
            }
            return result;
        }

        /**
         * @private
         *
         * Traverses all the children and builds the set of props for each element.
         * This is what takes the prop `field="field_id"`, looks up "field_id" on the schema
         * then applies all the needed props from the schema, along with callbacks to
         * track state.
         */

    }, {
        key: "renderChildren",
        value: function renderChildren(formState, childList) {
            var _this5 = this;

            var childCount = _react2.default.Children.count(childList);
            var children = [];
            _react2.default.Children.forEach(childList, function (child, i) {
                if (child) {
                    var newChild = void 0;
                    var key = child.key || "key-" + i;
                    var props = { key: key };
                    if (typeof child.props.children !== "string") {
                        if (_underscore2.default.has(child.props, "field")) {
                            var fieldName = child.props.field;
                            props = _extends({}, props, _this5.getFieldProps(formState, fieldName));
                        }
                        if (_react2.default.Children.count(child.props.children) > 0) {
                            props = _extends({}, props, {
                                children: _this5.renderChildren(formState, child.props.children)
                            });
                        }
                    }
                    newChild = _react2.default.cloneElement(child, props);
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

        /**
         * Restrict how often we render the form. It's likely that the container
         * for the form is keeping track of other state such as missing counts, so
         * here we make sure something we care about actually changed before doing
         * the whole form render.
         */

    }, {
        key: "shouldComponentUpdate",
        value: function shouldComponentUpdate(nextProps, nextState) {
            var update = nextProps.value !== this.props.value || nextProps.edit !== this.props.edit || nextProps.schema !== this.props.schema || nextProps.visibility !== this.props.visibility || nextState.selection !== this.state.selection;
            return update;
        }

        /**
         * Render the form and all its children.
         */

    }, {
        key: "render",
        value: function render() {
            var _this6 = this;

            var inner = this.props.inner;
            var schema = this.props.schema;
            var formFields = getFieldsFromSchema(schema);
            var formRules = getRulesFromSchema(schema);
            var formHiddenList = this.getHiddenFields(formFields);
            var formState = { formFields: formFields, formRules: formRules, formHiddenList: formHiddenList };

            /*
                <form class="form-inline">
                <div class="form-group">
                    <label class="sr-only" for="exampleInputEmail3">Email address</label>
                    <input type="email" class="form-control" id="exampleInputEmail3" placeholder="Email">
                </div>
                <div class="form-group">
                    <label class="sr-only" for="exampleInputPassword3">Password</label>
                    <input type="password" class="form-control" id="exampleInputPassword3" placeholder="Password">
                </div>
                <div class="checkbox">
                    <label>
                    <input type="checkbox"> Remember me
                    </label>
                </div>
                <button type="submit" class="btn btn-default">Sign in</button>
                </form>
            */

            var formClass = this.props.formClassName;
            if (this.props.inline) {
                formClass += "form-inline";
            }

            if (this.props.edit === _constants.FormEditStates.TABLE) {
                return _react2.default.createElement(
                    _flexboxReact2.default,
                    {
                        flexDirection: "row",
                        className: this.props.formClassName,
                        key: this.props.formKey
                    },
                    this.renderChildren(formState, this.props.children)
                );
            } else {
                if (inner) {
                    return _react2.default.createElement(
                        "form",
                        {
                            className: formClass,
                            style: this.props.formStyle,
                            key: this.props.formKey,
                            onSubmit: function onSubmit(e) {
                                _this6.handleSubmit(e);
                            },
                            noValidate: true
                        },
                        this.renderChildren(formState, this.props.children)
                    );
                } else {
                    return _react2.default.createElement(
                        "div",
                        {
                            className: this.props.formClassName,
                            style: this.props.formStyle,
                            key: this.props.formKey
                        },
                        this.renderChildren(formState, this.props.children)
                    );
                }
            }
        }
    }]);

    return Form;
}(_react2.default.Component);

exports.default = Form;


Form.propTypes = {
    value: _propTypes2.default.object
};

Form.defaultProps = {
    formStyle: {},
    formClass: "form-horizontal",
    formKey: "form",
    groupLayout: _constants.FormGroupLayout.ROW
};
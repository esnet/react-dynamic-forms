"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = list;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var _immutable = require("immutable");

var _immutable2 = _interopRequireDefault(_immutable);

var _List = require("../components/List");

var _List2 = _interopRequireDefault(_List);

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

/**
 * A Higher-order component -- a function that takes the item
 * Component class and returns a new Component that manages a
 * list of that class.
 */
function list(ItemComponent, hideEditRemove) {
    return function (_React$Component) {
        _inherits(HOC, _React$Component);

        function HOC(props) {
            _classCallCheck(this, HOC);

            var _this = _possibleConstructorReturn(this, (HOC.__proto__ || Object.getPrototypeOf(HOC)).call(this, props));

            _this.state = { errors: [], missing: [], selected: null };
            return _this;
        }

        _createClass(HOC, [{
            key: "handleSelectItem",
            value: function handleSelectItem(i) {
                if (this.state.selected !== i) {
                    this.setState({ selected: i });
                } else {
                    this.setState({ selected: null });
                }
            }

            //Handle an item at i changing to a new value.

        }, {
            key: "handleChangeItem",
            value: function handleChangeItem(i, value) {
                var newValue = this.props.value.set(i, value);
                if (this.props.onChange) {
                    this.props.onChange(this.props.name, newValue);
                }
            }
        }, {
            key: "handleMissingCountChange",
            value: function handleMissingCountChange(i, missingCount) {
                var totalMissingCount = void 0;
                var missingList = this.state.missing;
                missingList[i] = missingCount;
                totalMissingCount = _underscore2.default.reduce(missingList, function (memo, num) {
                    return memo + num;
                }, 0);

                // Callback
                if (this.props.onMissingCountChange) {
                    this.props.onMissingCountChange(this.props.name, totalMissingCount);
                }
            }

            /**
             * Handler for if a child changes its error count
             */

        }, {
            key: "handleErrorCountChange",
            value: function handleErrorCountChange(i, errorCount) {
                var totalErrorCount = void 0;
                var errorList = this.state.errors;
                errorList[i] = errorCount;
                totalErrorCount = _underscore2.default.reduce(errorList, function (memo, num) {
                    return memo + num;
                }, 0);

                // Callback
                if (this.props.onErrorCountChange) {
                    this.props.onErrorCountChange(this.props.name, totalErrorCount);
                }
            }

            // Handle removing an item. Here it splices out the item
            // at the supplied index and updates the list of items on the state.
            //
            // Also updates the error and missing lists to match.

        }, {
            key: "handleRemovedItem",
            value: function handleRemovedItem(i) {
                var value = this.props.value;

                var n = 1;
                var errors = this.state.errors;
                var missing = this.state.missing;
                errors.splice(i - n + 1, n);
                missing.splice(i - n + 1, n);
                this.setState({ errors: errors, missing: missing });

                // Callbacks
                if (this.props.onChange) {
                    this.props.onChange(this.props.name, value.splice(i - n + 1, n));
                }
                if (this.props.onErrorCountChange) {
                    this.props.onErrorCountChange(this.props.name, this.numErrors(errors));
                }
                if (this.props.onMissingCountChange) {
                    this.props.onMissingCountChange(this.props.name, this.numMissing(missing));
                }
            }
        }, {
            key: "handleAddItem",
            value: function handleAddItem() {
                var value = this.props.value;

                var errors = this.state.errors;
                var missing = this.state.missing;
                var created = _immutable2.default.fromJS(ItemComponent.defaultValues);
                errors.push(0);
                missing.push(0);

                // Callbacks
                if (this.props.onChange) {
                    this.props.onChange(this.props.name, value.push(created));
                }
                if (this.props.onErrorCountChange) {
                    this.props.onErrorCountChange(this.props.name, this.numErrors(errors));
                }
                if (this.props.onMissingCountChange) {
                    this.props.onMissingCountChange(this.props.name, this.numMissing(missing));
                }

                this.setState({ selected: this.props.value.size });
            }

            //Determine the total count of missing fields in the entire list

        }, {
            key: "numMissing",
            value: function numMissing(missing) {
                var total = 0;
                _underscore2.default.each(missing, function (c) {
                    total += c;
                });
                return total;
            }

            //Determine the total count of error fields in the entire list

        }, {
            key: "numErrors",
            value: function numErrors(errors) {
                var total = 0;
                _underscore2.default.each(errors, function (c) {
                    total += c;
                });
                return total;
            }
        }, {
            key: "componentWillReceiveProps",
            value: function componentWillReceiveProps(nextProps) {
                if (nextProps.edit === false) {
                    this.setState({ selected: null });
                }
            }
        }, {
            key: "render",
            value: function render() {
                var _this2 = this;

                var itemComponents = [];
                this.props.value.forEach(function (item, index) {
                    var _item$key = item.key,
                        key = _item$key === undefined ? index : _item$key;

                    var props = {
                        key: key,
                        name: index,
                        edit: _this2.props.edit,
                        innerForm: true,
                        hideMinus: hideEditRemove && index < _this2.props.value.size - 1,
                        types: _this2.props.types,
                        options: _this2.props.options,
                        actions: _this2.props.actions,
                        onErrorCountChange: function onErrorCountChange(name, errorCount) {
                            return _this2.handleErrorCountChange(name, errorCount);
                        },
                        onMissingCountChange: function onMissingCountChange(name, missingCount) {
                            return _this2.handleMissingCountChange(name, missingCount);
                        },
                        onChange: function onChange(name, value) {
                            _this2.handleChangeItem(name, value);
                        }
                    };
                    itemComponents.push(_react2.default.createElement(ItemComponent, _extends({}, props, {
                        value: item,
                        editable: _this2.props.edit,
                        edit: _this2.state.selected === index && _this2.props.edit
                    })));
                });

                var errors = _underscore2.default.find(this.state.errors, function (item) {
                    return item >= 1;
                });
                var missing = _underscore2.default.find(this.state.missing, function (item) {
                    return item >= 1;
                });

                var plusElement = (errors || missing) && hideEditRemove ? _react2.default.createElement("div", null) : null;
                var _props = this.props,
                    _props$canAddItems = _props.canAddItems,
                    canAddItems = _props$canAddItems === undefined ? true : _props$canAddItems,
                    _props$canRemoveItems = _props.canRemoveItems,
                    canRemoveItems = _props$canRemoveItems === undefined ? true : _props$canRemoveItems;


                return _react2.default.createElement(_List2.default, {
                    items: itemComponents,
                    canAddItems: canAddItems && this.props.edit,
                    canRemoveItems: canRemoveItems && this.props.edit,
                    canEditItems: this.props.edit,
                    hideEditRemove: hideEditRemove,
                    plusWidth: 400,
                    plusElement: plusElement,
                    onAddItem: function onAddItem() {
                        return _this2.handleAddItem();
                    },
                    onRemoveItem: function onRemoveItem(index) {
                        return _this2.handleRemovedItem(index);
                    },
                    onSelectItem: function onSelectItem(index) {
                        return _this2.handleSelectItem(index);
                    }
                });
            }
        }]);

        return HOC;
    }(_react2.default.Component);
}
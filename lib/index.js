"use strict";

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactDom = require("react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactRouter = require("react-router");

require("./website/index.css");

require("react-select/dist/react-select.css");

var _App = require("./website/App");

var _App2 = _interopRequireDefault(_App);

var _Intro = require("./website/intro/Intro");

var _Intro2 = _interopRequireDefault(_Intro);

var _FormExample = require("./website/examples/FormExample");

var _FormExample2 = _interopRequireDefault(_FormExample);

var _DynamicExample = require("./website/examples/DynamicExample");

var _DynamicExample2 = _interopRequireDefault(_DynamicExample);

var _ListExample = require("./website/examples/ListExample");

var _ListExample2 = _interopRequireDefault(_ListExample);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_reactDom2.default.render(_react2.default.createElement(
    _reactRouter.Router,
    { history: _reactRouter.hashHistory },
    _react2.default.createElement(
        _reactRouter.Route,
        { path: "/", component: _App2.default },
        _react2.default.createElement(_reactRouter.IndexRoute, { component: _Intro2.default }),
        _react2.default.createElement(_reactRouter.Route, { path: "example/contact", component: _FormExample2.default }),
        _react2.default.createElement(_reactRouter.Route, { path: "example/list", component: _ListExample2.default }),
        _react2.default.createElement(_reactRouter.Route, { path: "example/dynamic", component: _DynamicExample2.default })
    )
), document.getElementById("root"));

// Examples

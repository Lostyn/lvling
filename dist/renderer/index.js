"use strict";

var _react = _interopRequireDefault(require("react"));

var _dom = require("./browser/dom");

var _reactDom = require("react-dom");

var _workbench = _interopRequireDefault(require("./containers/workbench"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function startup() {
  var container = (0, _dom.append)(document.body, (0, _dom.$)("div#workbench"));
  (0, _reactDom.render)( /*#__PURE__*/_react["default"].createElement(_workbench["default"], null), container);
}

startup();
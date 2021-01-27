"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.$ = $;
exports.append = append;
var SELECTOR_REGEX = /([\w\-]+)?(#([\w\-]+))?((.([\w\-]+))*)/;

function $(descriptor) {
  var match = SELECTOR_REGEX.exec(descriptor);
  var result = document.createElement(match[1] || 'div');
  if (match[3]) result.id = match[3];
  if (match[4]) result.className = match[4].replace(/\./g, ' ').trim();
  return result;
}

function append(parent) {
  for (var _len = arguments.length, children = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    children[_key - 1] = arguments[_key];
  }

  children.forEach(function (child) {
    return parent.appendChild(child);
  });
  return children[children.length - 1];
}
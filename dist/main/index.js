"use strict";

var _path = _interopRequireDefault(require("path"));

var _url = _interopRequireDefault(require("url"));

var _electron = require("electron");

var _window = _interopRequireDefault(require("./helpers/window"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_electron.app.whenReady().then(function () {
  var mainWindow = (0, _window["default"])('main', {
    width: 1000,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    },
    frame: false,
    resizable: true
  });
  mainWindow.loadURL(_url["default"].format({
    pathname: _path["default"].join(__dirname, '../renderer/index.html'),
    protocol: 'file:',
    slashes: true
  }));

  if (process.env.NODE_ENV === 'development') {
    var _require = require('electron-connect'),
        client = _require.client;

    client.create(mainWindow);
  }
});

_electron.app.on('window-all-closed', function () {
  _electron.app.quit();
});
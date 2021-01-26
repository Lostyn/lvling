"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var url_1 = __importDefault(require("url"));
var electron_1 = require("electron");
var window_1 = __importDefault(require("./helpers/window"));
electron_1.app.on('ready', function () {
    var mainWindow = window_1.default('main', {
        width: 100,
        height: 600
    });
    mainWindow.loadURL(url_1.default.format({
        pathname: path_1.default.join(__dirname, 'app.html'),
        protocol: 'file:',
        slashes: true
    }));
    if (process.env.NODE_ENV === 'development') {
    }
});
electron_1.app.on('window-all-closed', function () {
    electron_1.app.quit();
});

var api =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./noeval.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "../../node_modules/node-fetch/browser.js":
/*!**********************************************************************!*\
  !*** /home/sbrian/github6/JSxCAD/node_modules/node-fetch/browser.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\n// ref: https://github.com/tc39/proposal-global\nvar getGlobal = function () {\n\t// the only reliable means to get the global object is\n\t// `Function('return this')()`\n\t// However, this causes CSP violations in Chrome apps.\n\tif (typeof self !== 'undefined') { return self; }\n\tif (typeof window !== 'undefined') { return window; }\n\tif (typeof global !== 'undefined') { return global; }\n\tthrow new Error('unable to locate global object');\n}\n\nvar global = getGlobal();\n\nmodule.exports = exports = global.fetch;\n\n// Needed for TypeScript and Webpack.\nexports.default = global.fetch.bind(global);\n\nexports.Headers = global.Headers;\nexports.Request = global.Request;\nexports.Response = global.Response;\n\n//# sourceURL=webpack://api//home/sbrian/github6/JSxCAD/node_modules/node-fetch/browser.js?");

/***/ }),

/***/ "../../node_modules/node-libs-browser/mock/empty.js":
/*!********************************************************************************!*\
  !*** /home/sbrian/github6/JSxCAD/node_modules/node-libs-browser/mock/empty.js ***!
  \********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("\n\n//# sourceURL=webpack://api//home/sbrian/github6/JSxCAD/node_modules/node-libs-browser/mock/empty.js?");

/***/ }),

/***/ "../../sys/files.js":
/*!************************************************!*\
  !*** /home/sbrian/github6/JSxCAD/sys/files.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("const files = {};\nconst fileCreationWatchers = [];\n\nconst getFile = (path) => {\n  let file = files[path];\n  if (file === undefined) {\n    file = { path: path, watchers: [] };\n    files[path] = file;\n    for (const watcher of fileCreationWatchers) {\n      watcher(file);\n    }\n  }\n  return file;\n};\n\nconst watchFileCreation = (thunk) => fileCreationWatchers.push(thunk);\n\nmodule.exports.getFile = getFile;\nmodule.exports.watchFileCreation = watchFileCreation;\n\n\n//# sourceURL=webpack://api//home/sbrian/github6/JSxCAD/sys/files.js?");

/***/ }),

/***/ "../../sys/main.js":
/*!***********************************************!*\
  !*** /home/sbrian/github6/JSxCAD/sys/main.js ***!
  \***********************************************/
/*! exports provided: readFile, readFileSync, watchFile, watchFileCreation, writeFileSync */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _readFile__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./readFile */ \"../../sys/readFile.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"readFile\", function() { return _readFile__WEBPACK_IMPORTED_MODULE_0__[\"readFile\"]; });\n\n/* harmony import */ var _readFileSync__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./readFileSync */ \"../../sys/readFileSync.js\");\n/* harmony import */ var _readFileSync__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_readFileSync__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"readFileSync\", function() { return _readFileSync__WEBPACK_IMPORTED_MODULE_1__[\"readFileSync\"]; });\n\n/* harmony import */ var _watchFile__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./watchFile */ \"../../sys/watchFile.js\");\n/* harmony import */ var _watchFile__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_watchFile__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"watchFile\", function() { return _watchFile__WEBPACK_IMPORTED_MODULE_2__[\"watchFile\"]; });\n\n/* harmony import */ var _files__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./files */ \"../../sys/files.js\");\n/* harmony import */ var _files__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_files__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"watchFileCreation\", function() { return _files__WEBPACK_IMPORTED_MODULE_3__[\"watchFileCreation\"]; });\n\n/* harmony import */ var _writeFileSync__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./writeFileSync */ \"../../sys/writeFileSync.js\");\n/* harmony import */ var _writeFileSync__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_writeFileSync__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"writeFileSync\", function() { return _writeFileSync__WEBPACK_IMPORTED_MODULE_4__[\"writeFileSync\"]; });\n\n\n\n\n\n\n\n\n\n\n//# sourceURL=webpack://api//home/sbrian/github6/JSxCAD/sys/main.js?");

/***/ }),

/***/ "../../sys/readFile.js":
/*!***************************************************!*\
  !*** /home/sbrian/github6/JSxCAD/sys/readFile.js ***!
  \***************************************************/
/*! exports provided: readFile */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"readFile\", function() { return readFile; });\nconst fs = __webpack_require__(/*! fs */ \"../../node_modules/node-libs-browser/mock/empty.js\");\nconst readFileSyncBrowser = __webpack_require__(/*! ./readFileSyncBrowser */ \"../../sys/readFileSyncBrowser.js\");\nconst fetch = __webpack_require__(/*! node-fetch */ \"../../node_modules/node-fetch/browser.js\");\n\nconst readFile = (path, options) => {\n  if (path.startsWith('http://') || path.startsWith('https://')) {\n    if (fetch) {\n      return fetch(path).then(result => result.text());\n    } else {\n      return window.fetch(path).then(result => result.text());\n    }\n  }\n  if (fs.promises.readFile) {\n    return fs.promises.readFile(path, options);\n  } else {\n    return Promise.resolve(readFileSyncBrowser(path, options));\n  }\n};\n\n\n//# sourceURL=webpack://api//home/sbrian/github6/JSxCAD/sys/readFile.js?");

/***/ }),

/***/ "../../sys/readFileSync.js":
/*!*******************************************************!*\
  !*** /home/sbrian/github6/JSxCAD/sys/readFileSync.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const fs = __webpack_require__(/*! fs */ \"../../node_modules/node-libs-browser/mock/empty.js\");\nconst readFileSyncBrowser = __webpack_require__(/*! ./readFileSyncBrowser */ \"../../sys/readFileSyncBrowser.js\");\n\nconst readFileSync = (path, options = {}) => {\n  if (fs.readFileSync) {\n    return fs.readFileSync(path, options);\n  } else {\n    return readFileSyncBrowser.readFileSync(path, options);\n  }\n};\n\nmodule.exports.readFileSync = readFileSync;\n\n\n//# sourceURL=webpack://api//home/sbrian/github6/JSxCAD/sys/readFileSync.js?");

/***/ }),

/***/ "../../sys/readFileSyncBrowser.js":
/*!**************************************************************!*\
  !*** /home/sbrian/github6/JSxCAD/sys/readFileSyncBrowser.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const { getFile } = __webpack_require__(/*! ./files */ \"../../sys/files.js\");\n\nconst readFileSync = (path, options) => {\n  const file = getFile(path);\n  if (typeof file.data === 'function') {\n    // Force lazy evaluation.\n    file.data = file.data();\n  }\n  return file.data;\n};\n\nmodule.exports.readFileSync = readFileSync;\n\n\n//# sourceURL=webpack://api//home/sbrian/github6/JSxCAD/sys/readFileSyncBrowser.js?");

/***/ }),

/***/ "../../sys/watchFile.js":
/*!****************************************************!*\
  !*** /home/sbrian/github6/JSxCAD/sys/watchFile.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const fs = __webpack_require__(/*! fs */ \"../../node_modules/node-libs-browser/mock/empty.js\");\nconst watchFileBrowser = __webpack_require__(/*! ./watchFileBrowser */ \"../../sys/watchFileBrowser.js\");\n\nconst watchFile = (path, thunk) => {\n  if (fs.writeFileSync) {\n  } else {\n    watchFileBrowser.watchFile(path, thunk);\n  }\n};\n\nmodule.exports.watchFile = watchFile;\n\n\n//# sourceURL=webpack://api//home/sbrian/github6/JSxCAD/sys/watchFile.js?");

/***/ }),

/***/ "../../sys/watchFileBrowser.js":
/*!***********************************************************!*\
  !*** /home/sbrian/github6/JSxCAD/sys/watchFileBrowser.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const { getFile } = __webpack_require__(/*! ./files */ \"../../sys/files.js\");\n\nconst watchFile = (path, thunk) => getFile(path).watchers.push(thunk);\n\nmodule.exports.watchFile = watchFile;\n\n\n//# sourceURL=webpack://api//home/sbrian/github6/JSxCAD/sys/watchFileBrowser.js?");

/***/ }),

/***/ "../../sys/writeFileSync.js":
/*!********************************************************!*\
  !*** /home/sbrian/github6/JSxCAD/sys/writeFileSync.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const fs = __webpack_require__(/*! fs */ \"../../node_modules/node-libs-browser/mock/empty.js\");\nconst writeFileSyncBrowser = __webpack_require__(/*! ./writeFileSyncBrowser */ \"../../sys/writeFileSyncBrowser.js\");\n\nconst writeFileSync = async (path, data, options = {}) => {\nconsole.log(`QQ/writeFileSync/path: ${path}`);\nconsole.log(`QQ/writeFileSync/options: ${JSON.stringify(options)}`);\n  if (fs.writeFileSync) {\n    if (typeof data === 'function') {\n      data = data();\n    }\n    return fs.writeFileSync(path, await Promise.resolve(data), options);\n  } else {\n    return writeFileSyncBrowser.writeFileSync(path, data, options);\n  }\n};\n\nmodule.exports.writeFileSync = writeFileSync;\n\n\n//# sourceURL=webpack://api//home/sbrian/github6/JSxCAD/sys/writeFileSync.js?");

/***/ }),

/***/ "../../sys/writeFileSyncBrowser.js":
/*!***************************************************************!*\
  !*** /home/sbrian/github6/JSxCAD/sys/writeFileSyncBrowser.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const { getFile } = __webpack_require__(/*! ./files */ \"../../sys/files.js\");\n\nconst writeFileSync = (path, data, options = {}) => {\n  const file = getFile(path);\n  file.data = data;\n  for (const watcher of file.watchers) {\n    watcher(file, options);\n  }\n};\n\nmodule.exports.writeFileSync = writeFileSync;\n\n\n//# sourceURL=webpack://api//home/sbrian/github6/JSxCAD/sys/writeFileSyncBrowser.js?");

/***/ }),

/***/ "./noeval.js":
/*!*******************!*\
  !*** ./noeval.js ***!
  \*******************/
/*! exports provided: readFile, readFileSync, watchFile, watchFileCreation, writeFileSync */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _jsxcad_sys__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jsxcad/sys */ \"../../sys/main.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"readFile\", function() { return _jsxcad_sys__WEBPACK_IMPORTED_MODULE_0__[\"readFile\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"readFileSync\", function() { return _jsxcad_sys__WEBPACK_IMPORTED_MODULE_0__[\"readFileSync\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"watchFile\", function() { return _jsxcad_sys__WEBPACK_IMPORTED_MODULE_0__[\"watchFile\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"watchFileCreation\", function() { return _jsxcad_sys__WEBPACK_IMPORTED_MODULE_0__[\"watchFileCreation\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"writeFileSync\", function() { return _jsxcad_sys__WEBPACK_IMPORTED_MODULE_0__[\"writeFileSync\"]; });\n\n\n\n\n//# sourceURL=webpack://api/./noeval.js?");

/***/ })

/******/ });
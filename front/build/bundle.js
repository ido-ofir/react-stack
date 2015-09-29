webpackJsonp([0],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	eval("module.exports = __webpack_require__(1);\n\n\n/*****************\n ** WEBPACK FOOTER\n ** multi app\n ** module id = 0\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///multi_app?");

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	eval("/* WEBPACK VAR INJECTION */(function(module, React) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(213), RootInstanceProvider = __webpack_require__(178), ReactMount = __webpack_require__(72), React = __webpack_require__(180); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } (function () {\n\n'use strict';\n\nvar Connection = __webpack_require__(176);\nvar config = {\n  domain: 'http://localhost',\n  port: 4000,\n  transport: 'websocket',\n  api: {\n    path: '/api'\n  }\n};\nvar connection = window.connection = Connection(config);\nconnection.on('authorize', function () {\n  console.log('auto');\n  connection.action('me', {});\n});\nconnection.connect();\nvar App = __webpack_require__(234);\nReact.render(React.createElement(App, null), document.getElementById('app'));\n\n/* REACT HOT LOADER */ }).call(this); if (true) { (function () { module.hot.dispose(function (data) { data.makeHot = module.makeHot; }); if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(221), foundReactClasses = false; if (makeExportsHot(module, __webpack_require__(180))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error(\"Cannot not apply hot update to \" + \"init.jsx\" + \": \" + err.message); } }); } } })(); }\n/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)(module), __webpack_require__(3)))\n\n/*****************\n ** WEBPACK FOOTER\n ** ./app/init.jsx\n ** module id = 1\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./app/init.jsx?");

/***/ }
]);
"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/capital-case";
exports.ids = ["vendor-chunks/capital-case"];
exports.modules = {

/***/ "(ssr)/./node_modules/capital-case/dist/index.js":
/*!*************************************************!*\
  !*** ./node_modules/capital-case/dist/index.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.capitalCase = exports.capitalCaseTransform = void 0;\nvar tslib_1 = __webpack_require__(/*! tslib */ \"(ssr)/./node_modules/tslib/tslib.es6.mjs\");\nvar no_case_1 = __webpack_require__(/*! no-case */ \"(ssr)/./node_modules/no-case/dist/index.js\");\nvar upper_case_first_1 = __webpack_require__(/*! upper-case-first */ \"(ssr)/./node_modules/upper-case-first/dist/index.js\");\nfunction capitalCaseTransform(input) {\n    return upper_case_first_1.upperCaseFirst(input.toLowerCase());\n}\nexports.capitalCaseTransform = capitalCaseTransform;\nfunction capitalCase(input, options) {\n    if (options === void 0) { options = {}; }\n    return no_case_1.noCase(input, tslib_1.__assign({ delimiter: \" \", transform: capitalCaseTransform }, options));\n}\nexports.capitalCase = capitalCase;\n//# sourceMappingURL=index.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvY2FwaXRhbC1jYXNlL2Rpc3QvaW5kZXguanMiLCJtYXBwaW5ncyI6IkFBQWE7QUFDYiw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0QsbUJBQW1CLEdBQUcsNEJBQTRCO0FBQ2xELGNBQWMsbUJBQU8sQ0FBQyx1REFBTztBQUM3QixnQkFBZ0IsbUJBQU8sQ0FBQywyREFBUztBQUNqQyx5QkFBeUIsbUJBQU8sQ0FBQyw2RUFBa0I7QUFDbkQ7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCO0FBQzVCO0FBQ0EsOEJBQThCO0FBQzlCLHNEQUFzRCxpREFBaUQ7QUFDdkc7QUFDQSxtQkFBbUI7QUFDbkIiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90aGUtZ3JpZC0yLy4vbm9kZV9tb2R1bGVzL2NhcGl0YWwtY2FzZS9kaXN0L2luZGV4LmpzPzZlOWIiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmNhcGl0YWxDYXNlID0gZXhwb3J0cy5jYXBpdGFsQ2FzZVRyYW5zZm9ybSA9IHZvaWQgMDtcbnZhciB0c2xpYl8xID0gcmVxdWlyZShcInRzbGliXCIpO1xudmFyIG5vX2Nhc2VfMSA9IHJlcXVpcmUoXCJuby1jYXNlXCIpO1xudmFyIHVwcGVyX2Nhc2VfZmlyc3RfMSA9IHJlcXVpcmUoXCJ1cHBlci1jYXNlLWZpcnN0XCIpO1xuZnVuY3Rpb24gY2FwaXRhbENhc2VUcmFuc2Zvcm0oaW5wdXQpIHtcbiAgICByZXR1cm4gdXBwZXJfY2FzZV9maXJzdF8xLnVwcGVyQ2FzZUZpcnN0KGlucHV0LnRvTG93ZXJDYXNlKCkpO1xufVxuZXhwb3J0cy5jYXBpdGFsQ2FzZVRyYW5zZm9ybSA9IGNhcGl0YWxDYXNlVHJhbnNmb3JtO1xuZnVuY3Rpb24gY2FwaXRhbENhc2UoaW5wdXQsIG9wdGlvbnMpIHtcbiAgICBpZiAob3B0aW9ucyA9PT0gdm9pZCAwKSB7IG9wdGlvbnMgPSB7fTsgfVxuICAgIHJldHVybiBub19jYXNlXzEubm9DYXNlKGlucHV0LCB0c2xpYl8xLl9fYXNzaWduKHsgZGVsaW1pdGVyOiBcIiBcIiwgdHJhbnNmb3JtOiBjYXBpdGFsQ2FzZVRyYW5zZm9ybSB9LCBvcHRpb25zKSk7XG59XG5leHBvcnRzLmNhcGl0YWxDYXNlID0gY2FwaXRhbENhc2U7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/capital-case/dist/index.js\n");

/***/ })

};
;
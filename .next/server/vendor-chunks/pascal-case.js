"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/pascal-case";
exports.ids = ["vendor-chunks/pascal-case"];
exports.modules = {

/***/ "(ssr)/./node_modules/pascal-case/dist/index.js":
/*!************************************************!*\
  !*** ./node_modules/pascal-case/dist/index.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.pascalCase = exports.pascalCaseTransformMerge = exports.pascalCaseTransform = void 0;\nvar tslib_1 = __webpack_require__(/*! tslib */ \"(ssr)/./node_modules/tslib/tslib.es6.mjs\");\nvar no_case_1 = __webpack_require__(/*! no-case */ \"(ssr)/./node_modules/no-case/dist/index.js\");\nfunction pascalCaseTransform(input, index) {\n    var firstChar = input.charAt(0);\n    var lowerChars = input.substr(1).toLowerCase();\n    if (index > 0 && firstChar >= \"0\" && firstChar <= \"9\") {\n        return \"_\" + firstChar + lowerChars;\n    }\n    return \"\" + firstChar.toUpperCase() + lowerChars;\n}\nexports.pascalCaseTransform = pascalCaseTransform;\nfunction pascalCaseTransformMerge(input) {\n    return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();\n}\nexports.pascalCaseTransformMerge = pascalCaseTransformMerge;\nfunction pascalCase(input, options) {\n    if (options === void 0) { options = {}; }\n    return no_case_1.noCase(input, tslib_1.__assign({ delimiter: \"\", transform: pascalCaseTransform }, options));\n}\nexports.pascalCase = pascalCase;\n//# sourceMappingURL=index.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvcGFzY2FsLWNhc2UvZGlzdC9pbmRleC5qcyIsIm1hcHBpbmdzIjoiQUFBYTtBQUNiLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RCxrQkFBa0IsR0FBRyxnQ0FBZ0MsR0FBRywyQkFBMkI7QUFDbkYsY0FBYyxtQkFBTyxDQUFDLHVEQUFPO0FBQzdCLGdCQUFnQixtQkFBTyxDQUFDLDJEQUFTO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkI7QUFDM0I7QUFDQTtBQUNBO0FBQ0EsZ0NBQWdDO0FBQ2hDO0FBQ0EsOEJBQThCO0FBQzlCLHNEQUFzRCwrQ0FBK0M7QUFDckc7QUFDQSxrQkFBa0I7QUFDbEIiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90aGUtZ3JpZC0yLy4vbm9kZV9tb2R1bGVzL3Bhc2NhbC1jYXNlL2Rpc3QvaW5kZXguanM/ZGRmMCJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMucGFzY2FsQ2FzZSA9IGV4cG9ydHMucGFzY2FsQ2FzZVRyYW5zZm9ybU1lcmdlID0gZXhwb3J0cy5wYXNjYWxDYXNlVHJhbnNmb3JtID0gdm9pZCAwO1xudmFyIHRzbGliXzEgPSByZXF1aXJlKFwidHNsaWJcIik7XG52YXIgbm9fY2FzZV8xID0gcmVxdWlyZShcIm5vLWNhc2VcIik7XG5mdW5jdGlvbiBwYXNjYWxDYXNlVHJhbnNmb3JtKGlucHV0LCBpbmRleCkge1xuICAgIHZhciBmaXJzdENoYXIgPSBpbnB1dC5jaGFyQXQoMCk7XG4gICAgdmFyIGxvd2VyQ2hhcnMgPSBpbnB1dC5zdWJzdHIoMSkudG9Mb3dlckNhc2UoKTtcbiAgICBpZiAoaW5kZXggPiAwICYmIGZpcnN0Q2hhciA+PSBcIjBcIiAmJiBmaXJzdENoYXIgPD0gXCI5XCIpIHtcbiAgICAgICAgcmV0dXJuIFwiX1wiICsgZmlyc3RDaGFyICsgbG93ZXJDaGFycztcbiAgICB9XG4gICAgcmV0dXJuIFwiXCIgKyBmaXJzdENoYXIudG9VcHBlckNhc2UoKSArIGxvd2VyQ2hhcnM7XG59XG5leHBvcnRzLnBhc2NhbENhc2VUcmFuc2Zvcm0gPSBwYXNjYWxDYXNlVHJhbnNmb3JtO1xuZnVuY3Rpb24gcGFzY2FsQ2FzZVRyYW5zZm9ybU1lcmdlKGlucHV0KSB7XG4gICAgcmV0dXJuIGlucHV0LmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgaW5wdXQuc2xpY2UoMSkudG9Mb3dlckNhc2UoKTtcbn1cbmV4cG9ydHMucGFzY2FsQ2FzZVRyYW5zZm9ybU1lcmdlID0gcGFzY2FsQ2FzZVRyYW5zZm9ybU1lcmdlO1xuZnVuY3Rpb24gcGFzY2FsQ2FzZShpbnB1dCwgb3B0aW9ucykge1xuICAgIGlmIChvcHRpb25zID09PSB2b2lkIDApIHsgb3B0aW9ucyA9IHt9OyB9XG4gICAgcmV0dXJuIG5vX2Nhc2VfMS5ub0Nhc2UoaW5wdXQsIHRzbGliXzEuX19hc3NpZ24oeyBkZWxpbWl0ZXI6IFwiXCIsIHRyYW5zZm9ybTogcGFzY2FsQ2FzZVRyYW5zZm9ybSB9LCBvcHRpb25zKSk7XG59XG5leHBvcnRzLnBhc2NhbENhc2UgPSBwYXNjYWxDYXNlO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/pascal-case/dist/index.js\n");

/***/ })

};
;
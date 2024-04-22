"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/sentence-case";
exports.ids = ["vendor-chunks/sentence-case"];
exports.modules = {

/***/ "(ssr)/./node_modules/sentence-case/dist/index.js":
/*!**************************************************!*\
  !*** ./node_modules/sentence-case/dist/index.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.sentenceCase = exports.sentenceCaseTransform = void 0;\nvar tslib_1 = __webpack_require__(/*! tslib */ \"(ssr)/./node_modules/tslib/tslib.es6.mjs\");\nvar no_case_1 = __webpack_require__(/*! no-case */ \"(ssr)/./node_modules/no-case/dist/index.js\");\nvar upper_case_first_1 = __webpack_require__(/*! upper-case-first */ \"(ssr)/./node_modules/upper-case-first/dist/index.js\");\nfunction sentenceCaseTransform(input, index) {\n    var result = input.toLowerCase();\n    if (index === 0)\n        return upper_case_first_1.upperCaseFirst(result);\n    return result;\n}\nexports.sentenceCaseTransform = sentenceCaseTransform;\nfunction sentenceCase(input, options) {\n    if (options === void 0) { options = {}; }\n    return no_case_1.noCase(input, tslib_1.__assign({ delimiter: \" \", transform: sentenceCaseTransform }, options));\n}\nexports.sentenceCase = sentenceCase;\n//# sourceMappingURL=index.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvc2VudGVuY2UtY2FzZS9kaXN0L2luZGV4LmpzIiwibWFwcGluZ3MiOiJBQUFhO0FBQ2IsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELG9CQUFvQixHQUFHLDZCQUE2QjtBQUNwRCxjQUFjLG1CQUFPLENBQUMsdURBQU87QUFDN0IsZ0JBQWdCLG1CQUFPLENBQUMsMkRBQVM7QUFDakMseUJBQXlCLG1CQUFPLENBQUMsNkVBQWtCO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QjtBQUM3QjtBQUNBLDhCQUE4QjtBQUM5QixzREFBc0Qsa0RBQWtEO0FBQ3hHO0FBQ0Esb0JBQW9CO0FBQ3BCIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdGhlLWdyaWQtMi8uL25vZGVfbW9kdWxlcy9zZW50ZW5jZS1jYXNlL2Rpc3QvaW5kZXguanM/NmU5YiJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuc2VudGVuY2VDYXNlID0gZXhwb3J0cy5zZW50ZW5jZUNhc2VUcmFuc2Zvcm0gPSB2b2lkIDA7XG52YXIgdHNsaWJfMSA9IHJlcXVpcmUoXCJ0c2xpYlwiKTtcbnZhciBub19jYXNlXzEgPSByZXF1aXJlKFwibm8tY2FzZVwiKTtcbnZhciB1cHBlcl9jYXNlX2ZpcnN0XzEgPSByZXF1aXJlKFwidXBwZXItY2FzZS1maXJzdFwiKTtcbmZ1bmN0aW9uIHNlbnRlbmNlQ2FzZVRyYW5zZm9ybShpbnB1dCwgaW5kZXgpIHtcbiAgICB2YXIgcmVzdWx0ID0gaW5wdXQudG9Mb3dlckNhc2UoKTtcbiAgICBpZiAoaW5kZXggPT09IDApXG4gICAgICAgIHJldHVybiB1cHBlcl9jYXNlX2ZpcnN0XzEudXBwZXJDYXNlRmlyc3QocmVzdWx0KTtcbiAgICByZXR1cm4gcmVzdWx0O1xufVxuZXhwb3J0cy5zZW50ZW5jZUNhc2VUcmFuc2Zvcm0gPSBzZW50ZW5jZUNhc2VUcmFuc2Zvcm07XG5mdW5jdGlvbiBzZW50ZW5jZUNhc2UoaW5wdXQsIG9wdGlvbnMpIHtcbiAgICBpZiAob3B0aW9ucyA9PT0gdm9pZCAwKSB7IG9wdGlvbnMgPSB7fTsgfVxuICAgIHJldHVybiBub19jYXNlXzEubm9DYXNlKGlucHV0LCB0c2xpYl8xLl9fYXNzaWduKHsgZGVsaW1pdGVyOiBcIiBcIiwgdHJhbnNmb3JtOiBzZW50ZW5jZUNhc2VUcmFuc2Zvcm0gfSwgb3B0aW9ucykpO1xufVxuZXhwb3J0cy5zZW50ZW5jZUNhc2UgPSBzZW50ZW5jZUNhc2U7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/sentence-case/dist/index.js\n");

/***/ })

};
;
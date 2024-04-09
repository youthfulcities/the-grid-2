"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/camel-case";
exports.ids = ["vendor-chunks/camel-case"];
exports.modules = {

/***/ "(ssr)/./node_modules/camel-case/dist/index.js":
/*!***********************************************!*\
  !*** ./node_modules/camel-case/dist/index.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.camelCase = exports.camelCaseTransformMerge = exports.camelCaseTransform = void 0;\nvar tslib_1 = __webpack_require__(/*! tslib */ \"(ssr)/./node_modules/tslib/tslib.es6.mjs\");\nvar pascal_case_1 = __webpack_require__(/*! pascal-case */ \"(ssr)/./node_modules/pascal-case/dist/index.js\");\nfunction camelCaseTransform(input, index) {\n    if (index === 0)\n        return input.toLowerCase();\n    return pascal_case_1.pascalCaseTransform(input, index);\n}\nexports.camelCaseTransform = camelCaseTransform;\nfunction camelCaseTransformMerge(input, index) {\n    if (index === 0)\n        return input.toLowerCase();\n    return pascal_case_1.pascalCaseTransformMerge(input);\n}\nexports.camelCaseTransformMerge = camelCaseTransformMerge;\nfunction camelCase(input, options) {\n    if (options === void 0) { options = {}; }\n    return pascal_case_1.pascalCase(input, tslib_1.__assign({ transform: camelCaseTransform }, options));\n}\nexports.camelCase = camelCase;\n//# sourceMappingURL=index.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvY2FtZWwtY2FzZS9kaXN0L2luZGV4LmpzIiwibWFwcGluZ3MiOiJBQUFhO0FBQ2IsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELGlCQUFpQixHQUFHLCtCQUErQixHQUFHLDBCQUEwQjtBQUNoRixjQUFjLG1CQUFPLENBQUMsdURBQU87QUFDN0Isb0JBQW9CLG1CQUFPLENBQUMsbUVBQWE7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQjtBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCO0FBQy9CO0FBQ0EsOEJBQThCO0FBQzlCLDhEQUE4RCwrQkFBK0I7QUFDN0Y7QUFDQSxpQkFBaUI7QUFDakIiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90aGUtZ3JpZC0yLy4vbm9kZV9tb2R1bGVzL2NhbWVsLWNhc2UvZGlzdC9pbmRleC5qcz9jM2EwIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5jYW1lbENhc2UgPSBleHBvcnRzLmNhbWVsQ2FzZVRyYW5zZm9ybU1lcmdlID0gZXhwb3J0cy5jYW1lbENhc2VUcmFuc2Zvcm0gPSB2b2lkIDA7XG52YXIgdHNsaWJfMSA9IHJlcXVpcmUoXCJ0c2xpYlwiKTtcbnZhciBwYXNjYWxfY2FzZV8xID0gcmVxdWlyZShcInBhc2NhbC1jYXNlXCIpO1xuZnVuY3Rpb24gY2FtZWxDYXNlVHJhbnNmb3JtKGlucHV0LCBpbmRleCkge1xuICAgIGlmIChpbmRleCA9PT0gMClcbiAgICAgICAgcmV0dXJuIGlucHV0LnRvTG93ZXJDYXNlKCk7XG4gICAgcmV0dXJuIHBhc2NhbF9jYXNlXzEucGFzY2FsQ2FzZVRyYW5zZm9ybShpbnB1dCwgaW5kZXgpO1xufVxuZXhwb3J0cy5jYW1lbENhc2VUcmFuc2Zvcm0gPSBjYW1lbENhc2VUcmFuc2Zvcm07XG5mdW5jdGlvbiBjYW1lbENhc2VUcmFuc2Zvcm1NZXJnZShpbnB1dCwgaW5kZXgpIHtcbiAgICBpZiAoaW5kZXggPT09IDApXG4gICAgICAgIHJldHVybiBpbnB1dC50b0xvd2VyQ2FzZSgpO1xuICAgIHJldHVybiBwYXNjYWxfY2FzZV8xLnBhc2NhbENhc2VUcmFuc2Zvcm1NZXJnZShpbnB1dCk7XG59XG5leHBvcnRzLmNhbWVsQ2FzZVRyYW5zZm9ybU1lcmdlID0gY2FtZWxDYXNlVHJhbnNmb3JtTWVyZ2U7XG5mdW5jdGlvbiBjYW1lbENhc2UoaW5wdXQsIG9wdGlvbnMpIHtcbiAgICBpZiAob3B0aW9ucyA9PT0gdm9pZCAwKSB7IG9wdGlvbnMgPSB7fTsgfVxuICAgIHJldHVybiBwYXNjYWxfY2FzZV8xLnBhc2NhbENhc2UoaW5wdXQsIHRzbGliXzEuX19hc3NpZ24oeyB0cmFuc2Zvcm06IGNhbWVsQ2FzZVRyYW5zZm9ybSB9LCBvcHRpb25zKSk7XG59XG5leHBvcnRzLmNhbWVsQ2FzZSA9IGNhbWVsQ2FzZTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/camel-case/dist/index.js\n");

/***/ })

};
;
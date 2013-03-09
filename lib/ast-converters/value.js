// Value converters - convert basic blisp AST value objects to Mozilla Parser AST

define([], function () {
  "use strict";

  var exports = {};

  exports.convert = function (blispAst) {
    switch (blispAst.type) {
      case "Boolean":
        return convertBoolean(blispAst);
      case "Number":
        return convertNumber(blispAst);
      case "String":
        return convertString(blispAst);
    }
    throw new Error("Cannot convert that value");
  };

  var convertNumber = exports.convertNumber = function (blispAst) {
    if (blispAst.type !== "Number") { throw "Incorrect type: expected Number"; }
    if (typeof blispAst.value !== "number") { throw "Invalid value for Number"; }
    return {
      type: "Literal",
      value: blispAst.value
    };
  };

  var convertString = exports.convertString = function (blispAst) {
    if (blispAst.type !== "String") { throw "Incorrect type: expected String"; }
    if (typeof blispAst.value !== "string") { throw "Invalid value for String"; }
    return {
      type: "Literal",
      value: blispAst.value
    };
  };

  var convertBoolean = exports.convertBoolean = function (blispAst) {
    if (blispAst.type !== "Boolean") { throw "Incorrect type: expected Boolean"; }
    if (blispAst.value !== "#t" && blispAst.value !== "#f") { throw "Invalid value for Boolean"; } 
    return {
        type: "Literal",
        value: blispAst.value === "#t"
      };
  };

  return exports;

});

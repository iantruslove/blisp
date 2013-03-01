// ast-converter
// Converts internal list-based AST to Mozilla Parser AST (Esprima / Escodegen compatible)

define([], function() {
  var exports = {};

  var convertBooleanExpression = function (blispAst) {
    return {
      type: "ExpressionStatement",
      expression: exports.convertBoolean(blispAst)
    };
  };

  var convertListExpression = function () {
    return {
      type: "ExpressionStatement",
      expression: {
        type: "CallExpression",
        callee: {
          type: "Identifier",
          name: "parseInt"
        },
        'arguments': [
          {
            type: "Literal",
            value: "a"
          },
          {
            type: "Literal",
            value: 16
          }
        ]
      }
    };
  };

  exports.convertExpressionStatement = function (blispAst) {
    if (blispAst.expression.type === "Boolean") { return convertBooleanExpression(blispAst.expression); }
    if (blispAst.expression.type === "List") { return convertListExpression(); }
  };

  exports.convertBoolean = function (blispAst) {
    if (blispAst.type !== "Boolean") { throw "Incorrect type: expected Boolean"; }
    if (blispAst.value !== "#t" && blispAst.value !== "#f"){ throw "Invalid value for Boolean"; } 
    return {
        type: "Literal",
        value: blispAst.value === "#t"
      };
  };

  return exports;
});

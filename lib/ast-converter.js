// ast-converter
// Converts internal list-based AST to Mozilla Parser AST (Esprima / Escodegen compatible)

define([], function() {
  var exports = {};

  var convertBooleanExpression = function () {
    return {
      type: "ExpressionStatement",
      expression: {
        type: "Literal",
        value: true
      }
    };
  };

  var convertListExpression = function () {
    return {
        type: "ExpressionStatement",
        expression: {
          type: "SequenceExpression",
          expressions: [
            {
              type: "Literal",
              value: true
            },
            {
              type: "Literal",
              value: true
            }
          ]
        }
      };
  };

  exports.convertExpression = function (blisp_ast) {
    if (blisp_ast.expression.type === "Boolean") { return convertBooleanExpression(); }
    if (blisp_ast.expression.type === "List") { return convertListExpression(); }
  };

  return exports;
});

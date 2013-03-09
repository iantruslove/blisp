// ast-converter
// Converts internal list-based AST to Mozilla Parser AST (Esprima / Escodegen compatible)

define(
    ['./ast-converters/expression', './ast-converters/value'],
    function(expressionConverter, valueConverter) {

  var exports = {};

  var wrapAstIntoExpressionStatement = function (ast) {
    return {
      type: "ExpressionStatement",
      expression: ast
    };
  };

  exports.convertExpression = function (blispAst) {
    return expressionConverter.convert(blispAst);
  };

  exports.convertExpressionStatement = function (blispAst) {
    return wrapAstIntoExpressionStatement(exports.convertExpression(blispAst.expression));
  };

  return exports;
});

// ast-converter
// Converts internal list-based AST to Mozilla Parser AST (Esprima / Escodegen compatible)

define(
    ['./ast-converters/value', './ast-converters/list', './ast-converters/list-expression'],
    function(valueConverter, listConverter, listExpressionConverter) {

  var exports = {};

  var convertBooleanExpression = function (blispAst) {
    return {
      type: "ExpressionStatement",
      expression: valueConverter.convertBoolean(blispAst)
    };
  };


  exports.convertExpressionStatement = function (blispAst) {
    if (blispAst.expression.type === "Boolean") { return convertBooleanExpression(blispAst.expression); }
    if (blispAst.expression.type === "List") { return listExpressionConverter.convert(blispAst.expression); }
  };

  return exports;
});

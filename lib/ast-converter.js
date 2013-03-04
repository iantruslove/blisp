// ast-converter
// Converts internal list-based AST to Mozilla Parser AST (Esprima / Escodegen compatible)

define(
    ['./ast-converters/values', './ast-converters/lists'],
    function(valueConverters, listConverters) {

  var exports = {};

  var convertBooleanExpression = function (blispAst) {
    return {
      type: "ExpressionStatement",
      expression: valueConverters.convertBoolean(blispAst)
    };
  };

  var convertListExpression = function (blispAst) {
    var ast;
    ast = {
      type: "ExpressionStatement",
      expression: {
        type: "CallExpression",
        callee: {
          type: "Identifier",
          name: undefined
        },
        'arguments': []
      }
    };

    ast.expression.callee.name = blispAst.car.value;
    ast.expression['arguments'] = listConverters.convertList(blispAst.cdr).elements;

    return ast;
  };

  exports.convertExpressionStatement = function (blispAst) {
    if (blispAst.expression.type === "Boolean") { return convertBooleanExpression(blispAst.expression); }
    if (blispAst.expression.type === "List") { return convertListExpression(blispAst.expression); }
  };



  return exports;
});

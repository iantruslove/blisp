// ast-converter
// Converts internal list-based AST to Mozilla Parser AST (Esprima / Escodegen compatible)

define(
    ['./ast-converters/value', './ast-converters/list'],
    function(valueConverter, listConverter) {

  var exports = {};

  var convertBooleanExpression = function (blispAst) {
    return {
      type: "ExpressionStatement",
      expression: valueConverter.convertBoolean(blispAst)
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
    ast.expression['arguments'] = listConverter.convertList(blispAst.cdr).elements;

    return ast;
  };

  exports.convertExpressionStatement = function (blispAst) {
    if (blispAst.expression.type === "Boolean") { return convertBooleanExpression(blispAst.expression); }
    if (blispAst.expression.type === "List") { return convertListExpression(blispAst.expression); }
  };



  return exports;
});

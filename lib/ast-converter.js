// ast-converter
// Converts internal list-based AST to Mozilla Parser AST (Esprima / Escodegen compatible)

define(['./ast-converters/values'], function(valueConverters) {
  var exports = {
    listConverters: {}
    };

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
    ast.expression['arguments'] = convertList(blispAst.cdr).elements;

    return ast;
  };

  exports.convertExpressionStatement = function (blispAst) {
    if (blispAst.expression.type === "Boolean") { return convertBooleanExpression(blispAst.expression); }
    if (blispAst.expression.type === "List") { return convertListExpression(blispAst.expression); }
  };


  var convertList = exports.listConverters.convertList = function (blispAst) {
    var arrayAst, listElement = blispAst;

    arrayAst = {
      type: "ArrayExpression",
      elements: [  ]
    };

    arrayAst.elements.push(valueConverters.convert(listElement.car));
    while (listElement.cdr.type === "List") {
      listElement = listElement.cdr;

      arrayAst.elements.push(valueConverters.convert(listElement.car));
    }

    return arrayAst;
  };

  return exports;
});

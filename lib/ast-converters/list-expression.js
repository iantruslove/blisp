// List expression converter - convert blisp AST list expressions to Mozilla Parser AST

define(['./list'], function (listConverter) {
  "use strict";

  var exports = {};

  exports.convert = function (blispAst) {
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

  return exports;
});


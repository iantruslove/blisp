// List expression converter - convert blisp AST list expressions to Mozilla Parser AST

define(['./list'], function (listConverter) {
  "use strict";

  var exports = {};

  exports.convert = function (blispAst) {
    if (exports.isBinaryOperation(blispAst.car)) {
      return exports.convertBinaryExpression(blispAst);
    }

    if (exports.isCallOperation(blispAst.car)) {
      return exports.convertCallExpression(blispAst);
    }

    throw "Don't know how to execute that function";
  };

  // This function does not have a local var declaration and as such it can be
  // modified by the caller.  That's important in the case of stubbing and
  // mocking.
  exports.convertCallExpression = function(blispAst) {
    var ast = {
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

  exports.isCallOperation = function(car) {
    return (car.type === "Function" && car.value.match(/^parseInt$/) !== null);
  };

  exports.isBinaryOperation = function(car) {
    return (car.type === "Function" && car.value.match(/^[\-\+\/\*]$/) !== null);
  };

  exports.convertBinaryExpression = function(blispAst) {
    var ast = {
      type: "ExpressionStatement",
      expression: {
        type: "BinaryExpression",
        operator: undefined,
        left: {
          type: "Literal",
          value: undefined
        },
        right: {
          type: "Literal",
          value: undefined
        }
      }
    };

    ast.expression.operator = blispAst.car.value;
    ast.expression.left.value = blispAst.cdr.car.value;
    ast.expression.right.value = blispAst.cdr.cdr.car.value;

    return ast;
  };

  return exports;
});


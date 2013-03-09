// Expression converter - convert blisp AST expressions to Mozilla Parser AST

define(
    ['./value'],
    function(valueConverter) {

  "use strict";

  var exports = {};

  exports.convert = function (blispAst) {
    var ast = "NOT SET";
    if (blispAst.type === "Boolean") {
      ast = valueConverter.convertBoolean(blispAst);
    } else if (blispAst.type === "List") {
      ast = exports.convertList(blispAst);
    } else {
      throw new Error("Unable to convert expression");
    }
    return ast;
  };

  exports.flattenList = function (blispAst) {
    var arrayAst, listElement = blispAst;

    arrayAst = {
      type: "ArrayExpression",
      elements: [  ]
    };

    arrayAst.elements.push(valueConverter.convert(listElement.car));
    while (listElement.cdr.type === "List") {
      listElement = listElement.cdr;

      if (exports.isLiteralValue(listElement.car)) {
        arrayAst.elements.push(valueConverter.convert(listElement.car));
      } else {
        arrayAst.elements.push(exports.convert(listElement.car));
      }
    }

    return arrayAst;
  };


  exports.convertList = function (blispAst) {
    if (exports.isBinaryOperation(blispAst.car)) {
      return exports.convertBinaryExpression(blispAst);
    }

    if (exports.isCallOperation(blispAst.car)) {
      return exports.convertCallExpression(blispAst);
    }

    throw new Error("Don't know how to execute that function");
  };

  exports.convertCallExpression = function(blispAst) {
    var ast = {
      type: "CallExpression",
      callee: {
        type: "Identifier",
        name: undefined
      },
      'arguments': []
    };

    ast.callee.name = blispAst.car.value;
    ast['arguments'] = exports.flattenList(blispAst.cdr).elements;

    return ast;
  };

  exports.isCallOperation = function(car) {
    return (car.type === "Function" && car.value.match(/^parseInt$/) !== null);
  };

  exports.isBinaryOperation = function(car) {
    return (car.type === "Function" && car.value.match(/^[\-\+\/\*]$/) !== null);
  };

  exports.isLiteralValue = function(car) {
    return (car.type === "Number" || car.type === "Boolean" || car.type === "String");
  };

  exports.convertBinaryExpression = function(blispAst) {
    var ast = {
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
    };

    ast.operator = blispAst.car.value;

    if (exports.isLiteralValue(blispAst.cdr.car)) {
      ast.left.value = blispAst.cdr.car.value;
    } else {
      ast.left = exports.convert(blispAst.cdr.car);
    }

    if (exports.isLiteralValue(blispAst.cdr.cdr.car)) {
      ast.right.value = blispAst.cdr.cdr.car.value;
    } else {
      ast.right = exports.convert(blispAst.cdr.cdr.car);
    }

    return ast;
  };

  return exports;
});


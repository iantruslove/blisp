// List converter - convert basic blisp AST lists to Mozilla Parser AST

define(['./value'], function (valueConverter) {
  "use strict";

  var exports = {};

  exports.convertList = function (blispAst) {
    var arrayAst, listElement = blispAst;

    arrayAst = {
      type: "ArrayExpression",
      elements: [  ]
    };

    arrayAst.elements.push(valueConverter.convert(listElement.car));
    while (listElement.cdr.type === "List") {
      listElement = listElement.cdr;

      arrayAst.elements.push(valueConverter.convert(listElement.car));
    }

    return arrayAst;
  };


  return exports;
});


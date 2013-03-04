// List converter - convert basic blisp AST lists to Mozilla Parser AST

define(['./values'], function (valueConverters) {
  "use strict";

  var exports = {};

  exports.convertList = function (blispAst) {
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


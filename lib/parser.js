/*
 * blisp
 * http://iantruslove.github.com/blisp/
 *
 * Copyright (c) 2013 Ian Truslove
 * Licensed under the MIT license.
 */

define([], function() {

  var exports = {
  };

  exports.parse = function(blisp) {
    return {
      type: "ExpressionStatement",
      expression: {
        type: "List",
        car: {
          type: "Function",
          value: "+"
        },
        cdr: {
          type: "List",
          car: {
            type: "Number",
            value: 8
          },
          cdr: {
            type: "List",
            car: {
              type: "Number",
              value: 16
            },
            cdr: {
              type: "EmptyList"
            } } } } };
  };

  return exports;
});

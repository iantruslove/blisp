/*
 * blisp
 * http://iantruslove.github.com/blisp/
 *
 * Copyright (c) 2013 Ian Truslove
 * Licensed under the MIT license.
 */

define(['./generator', './ast-converter'], function(generator, converter) {

  var exports = {
    generate: function(blispCode) {
      return converter.convertExpressionStatement(generator.generate(blispCode));
    }
  };

  return exports;
});

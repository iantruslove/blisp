/*
 * blisp
 * http://iantruslove.github.com/blisp/
 *
 * Copyright (c) 2013 Ian Truslove
 * Licensed under the MIT license.
 */

define(['./generator'], function(generator) {

  var exports = {
    generate: function(blispCode) {
      return generator.generate(blispCode);
    }
  };

  return exports;
});

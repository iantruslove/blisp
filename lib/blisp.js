/*
 * blisp
 * http://iantruslove.github.com/blisp/
 *
 * Copyright (c) 2013 Ian Truslove
 * Licensed under the MIT license.
 */

(function(exports) {

  exports.compile = function(blispCode) {
    if (blispCode === "#t") { return "true"; }
    if (blispCode === "#f") { return "false"; }

    return blispCode;
  };

}(typeof exports === 'object' && exports || this));

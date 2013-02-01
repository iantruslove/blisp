/*
 * blisp
 * http://iantruslove.github.com/blisp/
 *
 * Copyright (c) 2013 Ian Truslove
 * Licensed under the MIT license.
 */

(function(exports) {
  var Tokenizer, parser;

  exports.compile = function(blispCode) {

    if (blispCode === "#t") { return "true"; }
    if (blispCode === "#f") { return "false"; }

    return blispCode;
  };

  parser = exports.parser = {
    isBoolean: function(value) {
      return (value === "#t" || value === "#f");
    },
    parseBoolean: function (value) {
      if (value === "#t") { return { type: "Literal", value: true }; }
      if (value === "#f") { return { type: "Literal", value: false }; }
    },
    isNumber: function(value) {
      return (value.match(/[^0-9]/) === null);
    },
    parseNumber: function(value) {
      return { type: "Literal", value: parseInt(value, 10) };
    },
    isBinaryOperation: function(value) {
      return (value === "+");
    },
    parseBinaryOperation: function(value) {
      return {
        type: "BinaryExpression",
        operator: value,
        left: null,
        right: null
      };
    },
    isStartParen: function(value) {
      return (value === "(");
    },
    isClosingParen: function(value) {
      return (value === ")");
    },
    parseStartParen: function(value) {
      return {
        type: "ExpressionStatement",
        expression: null
      };
    },

    parseToken: function(token) {
      if (parser.isBoolean(token)) {
        return parser.parseBoolean(token);
      } else if (parser.isNumber(token)) {
        return parser.parseNumber(token);
      } else if (parser.isBinaryOperation(token)) {
        return parser.parseBinaryOperation(token);
      } else if (parser.isStartParen(token)) {
        return parser.parseStartParen(token);
      }
    },

    generateSyntaxTree: function (blispCode) {
      var expressionStatement, value;

      value = parser.parseToken(blispCode);

      expressionStatement = {
        type: "ExpressionStatement",
        expression: value
      };


      return expressionStatement;
    }
  };

  Tokenizer = exports.Tokenizer = function (code) {
    console.log("Creating tokenizer with " + code);
    var untokenizedString = code.trimLeft(),
        matchedTerms = untokenizedString.match(/^(\(|\)|(?:[^\s()]+))(.*)$/);

    this.firstToken = (matchedTerms !== null ? matchedTerms[1] : "");
    this.restOfTokens = (matchedTerms !== null ? matchedTerms[2] : "");

    return this;
  };

  Tokenizer.prototype.first =  function () {
    return this.firstToken.trimRight();
  };

  Tokenizer.prototype.rest =  function () {
    if (this.restOfTokens.trimRight() === "") {
      return null;
    }
    return new Tokenizer(this.restOfTokens);
  };

  exports.createTokenizer = function(code) {
    return new Tokenizer(code);
  };


}(typeof exports === 'object' && exports || this));

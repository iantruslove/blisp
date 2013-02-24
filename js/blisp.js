/*! blisp - v0.0.4 - 2013-02-24
* http://iantruslove.github.com/blisp/
* Copyright (c) 2013 Ian Truslove; Licensed MIT */

define('tokens',[],function () {

  var exports = {};

  var BooleanToken = function (token) {
    this.token = token;
    return this;
  };
  BooleanToken.prototype.parse = function () {
    if (this.token === "#t") { return { type: "Literal", value: true }; }
    if (this.token === "#f") { return { type: "Literal", value: false }; }
  };

  var NumberToken = function (token) {
    this.token = token;
    return this;
  };
  NumberToken.prototype.parse = function () {
    return { type: "Literal", value: parseInt(this.token, 10) };
  };

  var BinaryExpressionToken = function (token) {
    this.token = token;
    return this;
  };
  BinaryExpressionToken.prototype.parse = function () {
    return {
      type: "BinaryExpression",
      operator: this.token,
      left: null,
      right: null
    };
  };

  var ExpressionStatementStartToken = function (token) {
    this.token = token;
    return this;
  };
  ExpressionStatementStartToken.prototype.parse = function () {
    return {};
  };

  var ExpressionStatementEndToken = function (token) {
    this.token = token;
    return this;
  };
  ExpressionStatementEndToken.prototype.parse = function () {
    return {};
  };

  exports.BooleanToken = BooleanToken;
  exports.NumberToken = NumberToken;
  exports.BinaryExpressionToken = BinaryExpressionToken;
  exports.ExpressionStatementStartToken = ExpressionStatementStartToken;
  exports.ExpressionStatementEndToken = ExpressionStatementEndToken;

  return exports;
});

// the blisp parser module
define('parser',['./tokens'], function(tokens) {
  var exports ={};

  var isBoolean = exports.isBoolean = function(value) {
    return (value === "#t" || value === "#f");
  };

  var isNumber = exports.isNumber = function(value) {
    return (value.match(/[^0-9]/) === null);
  };

  var isBinaryOperation = exports.isBinaryOperation = function(value) {
    return (value.match(/^[+-\/\*]$/) !== null);
  };

  var isStartParen = exports.isStartParen = function(value) {
    return (value === "(");
  };

  var isClosingParen = exports.isClosingParen = function(value) {
    return (value === ")");
  };

  exports.createToken = function(value) {
    if (isBoolean(value)) {
        return new tokens.BooleanToken(value);
    } else if (isNumber(value)) {
        return new tokens.NumberToken(value);
    } else if (isBinaryOperation(value)) {
        return new tokens.BinaryExpressionToken(value);
    } else if (isStartParen(value)) {
        return new tokens.ExpressionStatementStartToken(value);
    } else if (isClosingParen(value)) {
        return new tokens.ExpressionStatementEndToken(value);
    }
  };

  return exports;
});

define('tokenizer',['./parser'], function (parser) {

  var tokenizer = {};

  var Tokenizer = function (code) {
    var matchedTerms;

    this.untokenizedString = code.trimLeft();
    matchedTerms = this.untokenizedString.match(/^(\(|\)|(?:[^\s()]+))(.*)$/);

    this.firstToken = (matchedTerms !== null ? matchedTerms[1] : "");
    this.restOfTokens = (matchedTerms !== null ? matchedTerms[2] : "");

    return this;
  };

  Tokenizer.prototype.first = function () {
    return parser.createToken(this.firstToken.trimRight());
  };

  Tokenizer.prototype.rest = function () {
    if (this.restOfTokens.trimRight() === "") {
      return null;
    }
    return new Tokenizer(this.restOfTokens);
  };

  Tokenizer.prototype.getCode = function () {
    return this.untokenizedString;
  };

  var createTokenizer = function(code) {
    return new Tokenizer(code);
  };

  tokenizer.Tokenizer = Tokenizer;
  tokenizer.createTokenizer = createTokenizer;
  return tokenizer;

});

define('generator',['./tokenizer', './tokens'], function (tokenizerModule, tokens) {

  var generator = {
    // reads blisp statements and returns escodegen-compatible AST string.
    generate: function (blispCode) {
      var expressionStatement,
          tokenizer,
          Tokenizer = tokenizerModule.Tokenizer,
          generatedCode;

      expressionStatement = {
        type: "ExpressionStatement",
        expression: null
      };

      tokenizer = (blispCode instanceof Tokenizer ? blispCode : new Tokenizer(blispCode));

      generatedCode = generator.rGenerate(tokenizer);

      expressionStatement.expression = generatedCode.astFragment;
      return expressionStatement;
    },

    rGenerate: function (tokenizer) {
      var token,
          firstParamData, secondParamData,
          thingToReturn = {};

      token = tokenizer.first();

      if (token instanceof tokens.ExpressionStatementStartToken) {
        thingToReturn.astFragment = {};

        // operator
        tokenizer = tokenizer.rest();
        thingToReturn.astFragment = tokenizer.first().parse();

        // first param
        tokenizer = tokenizer.rest();
        firstParamData = generator.rGenerate(tokenizer);
        thingToReturn.astFragment.left = firstParamData.astFragment;
        tokenizer = firstParamData.tokenizer;

        // second param
        tokenizer = tokenizer.rest();
        secondParamData = generator.rGenerate(tokenizer);
        thingToReturn.astFragment.right = secondParamData.astFragment;
        tokenizer = secondParamData.tokenizer;

        // closing paren
        tokenizer = tokenizer.rest();

      } else {
        thingToReturn.astFragment = token.parse();
      }

      thingToReturn.tokenizer = tokenizer;
      return thingToReturn;
    }
  };

  return generator;
});

/*
 * blisp
 * http://iantruslove.github.com/blisp/
 *
 * Copyright (c) 2013 Ian Truslove
 * Licensed under the MIT license.
 */

define('blisp',['./generator'], function(generator) {

  var exports = {
    generate: function(blispCode) {
      return generator.generate(blispCode);
    }
  };

  return exports;
});

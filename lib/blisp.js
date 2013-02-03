/*
 * blisp
 * http://iantruslove.github.com/blisp/
 *
 * Copyright (c) 2013 Ian Truslove
 * Licensed under the MIT license.
 */

(function(exports) {
  var Token, BooleanToken, NumberToken, BinaryExpressionToken, ExpressionStatementStartToken, Tokenizer, createTokenizer, parser, generator;

  parser = {
    isBoolean: function(value) {
      return (value === "#t" || value === "#f");
    },
    isNumber: function(value) {
      return (value.match(/[^0-9]/) === null);
    },
    isBinaryOperation: function(value) {
      return (value === "+");
    },
    isStartParen: function(value) {
      return (value === "(");
    },
    isClosingParen: function(value) {
      return (value === ")");
    },
    createToken: function(value) {
      if (parser.isBoolean(value)) {
        return new BooleanToken(value);
      } else if (parser.isNumber(value)) {
        return new NumberToken(value);
      } else if (parser.isBinaryOperation(value)) {
        return new BinaryExpressionToken(value);
      } else if (parser.isStartParen(value)) {
        return new ExpressionStatementStartToken(value);
      } else if (parser.isClosingParen(value)) {
        return new Token(value);
      }
    }
  };

  generator = {
    generateStatement: function (blispCode) {
      var expressionStatement, value, firstToken, tokenizer;

      expressionStatement = {
        type: "ExpressionStatement",
        expression: null
      };

      tokenizer = (blispCode instanceof Tokenizer ? blispCode : new Tokenizer(blispCode));

      firstToken = tokenizer.first();
      console.log("Parsed first token " + blispCode + " as " + JSON.stringify(firstToken.parse, null, 4));

      if (firstToken instanceof ExpressionStatementStartToken) {
        tokenizer = tokenizer.rest();
        expressionStatement.expression = tokenizer.first().parse();
        tokenizer = tokenizer.rest();
        expressionStatement.expression.left = tokenizer.first().parse();
        tokenizer = tokenizer.rest();
        expressionStatement.expression.right = tokenizer.first().parse();
      } else {
        expressionStatement.expression = firstToken.parse();
      }

      return expressionStatement;
    }
  };

  Token = function (token) {
    this.token = token;
    return this;
  };

  Token.prototype.blisp = function () {
    return this.token;
  };

  Token.prototype.parse = function () {
    throw new Error("This should be an abstract method, implemented in a subclass");
  };

  BooleanToken = function (token) {
    this.token = token;
    return this;
  };
  BooleanToken.prototype = new Token();
  BooleanToken.prototype.constructor = BooleanToken;
  BooleanToken.prototype.parse = function () {
    if (this.token === "#t") { return { type: "Literal", value: true }; }
    if (this.token === "#f") { return { type: "Literal", value: false }; }
  };

  NumberToken = function (token) {
    this.token = token;
    return this;
  };
  NumberToken.prototype = new Token();
  NumberToken.prototype.constructor = NumberToken;
  NumberToken.prototype.parse = function () {
    return { type: "Literal", value: parseInt(this.token, 10) };
  };

  BinaryExpressionToken = function (token) {
    this.token = token;
    return this;
  };
  BinaryExpressionToken.prototype = new Token();
  BinaryExpressionToken.prototype.constructor = BinaryExpressionToken;
  BinaryExpressionToken.prototype.parse = function () {
    return {
      type: "BinaryExpression",
      operator: this.token,
      left: null,
      right: null
    };
  };

  ExpressionStatementStartToken = function (token) {
    this.token = token;
    return this;
  };
  ExpressionStatementStartToken.prototype = new Token();
  ExpressionStatementStartToken.prototype.constructor = ExpressionStatementStartToken;
  ExpressionStatementStartToken.prototype.parse = function () {
    return {};
  };

  Tokenizer = function (code) {
    var untokenizedString = code.trimLeft(),
        matchedTerms = untokenizedString.match(/^(\(|\)|(?:[^\s()]+))(.*)$/);

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

  createTokenizer = function(code) {
    return new Tokenizer(code);
  };

  exports.parser = parser;
  exports.generator = generator;
  exports.createTokenizer = createTokenizer;
  exports.Token = Token;
  exports.BooleanToken = BooleanToken;
  exports.Tokenizer = Tokenizer;
  exports.NumberToken = NumberToken;
  exports.BinaryExpressionToken = BinaryExpressionToken;
  exports.ExpressionStatementStartToken = ExpressionStatementStartToken;

}(typeof exports === 'object' && exports || this));

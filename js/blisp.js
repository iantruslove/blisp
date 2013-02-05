/*! blisp - v0.0.2 - 2013-02-04
* http://iantruslove.github.com/blisp/
* Copyright (c) 2013 Ian Truslove; Licensed MIT */

// UMD "returnExports" pattern
// See http://github.com/umdjs
(function (root, factory) {
    if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(factory);
    } else {
        // Browser globals (root is window)
        root.returnExports = factory();
  }
}(this, function () {
    var exports = {},
        Token, BooleanToken, NumberToken, BinaryExpressionToken,
        ExpressionStatementStartToken, ExpressionStatementEndToken, Tokenizer,
        createTokenizer, parser, generator;

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
        return new ExpressionStatementEndToken(value);
      }
    }
  };

  generator = {
    // reads a single blisp statement from the start of the code provided,
    // and returns escodegen-compatible AST string.
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

  BooleanToken = function (token) {
    this.token = token;
    return this;
  };
  BooleanToken.prototype.parse = function () {
    if (this.token === "#t") { return { type: "Literal", value: true }; }
    if (this.token === "#f") { return { type: "Literal", value: false }; }
  };

  NumberToken = function (token) {
    this.token = token;
    return this;
  };
  NumberToken.prototype.parse = function () {
    return { type: "Literal", value: parseInt(this.token, 10) };
  };

  BinaryExpressionToken = function (token) {
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

  ExpressionStatementStartToken = function (token) {
    this.token = token;
    return this;
  };
  ExpressionStatementStartToken.prototype.parse = function () {
    return {};
  };

  ExpressionStatementEndToken = function (token) {
    this.token = token;
    return this;
  };
  ExpressionStatementEndToken.prototype.parse = function () {
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
  exports.ExpressionStatementEndToken = ExpressionStatementEndToken;

  return exports;
}));


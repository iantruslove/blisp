/*! blisp - v0.0.5 - 2013-03-09
* http://iantruslove.github.com/blisp/
* Copyright (c) 2013 Ian Truslove; Licensed MIT */

define('tokens',[],function () {

  var exports = {};

  exports.BooleanToken = function (token) {
    this.token = token;
    return this;
  };
  exports.BooleanToken.prototype.parse = function () {
    if (this.token === "#t" || this.token === "#f") {
      return { type: "Boolean", value: this.token };
    }
  };

  exports.NumberToken = function (token) {
    this.token = token;
    return this;
  };
  exports.NumberToken.prototype.parse = function () {
    return { type: "Number", value: parseInt(this.token, 10) };
  };

  exports.StringToken = function (token) {
    this.token = token;
    return this;
  };
  exports.StringToken.prototype.parse = function () {
    var stringValue = this.token.match(/^"(.*)"$/)[1];
    return { type: "String", value: stringValue };
  };

  exports.BinaryExpressionToken = function (token) {
    this.token = token;
    return this;
  };
  exports.BinaryExpressionToken.prototype.parse = function () {
    return {
      type: "Function",
      value: this.token
    };
  };

  exports.CallExpressionToken = function (token) {
    this.token = token;
    return this;
  };
  exports.CallExpressionToken.prototype.parse = function () {
    return {
      type: "Function",
      value: this.token
    };
  };

  exports.ExpressionStatementStartToken = function (token) {
    this.token = token;
    return this;
  };
  exports.ExpressionStatementStartToken.prototype.parse = function () {
    return {
      type: "List",
      car: null,
      cdr: null
    };
  };

  exports.ExpressionStatementEndToken = function (token) {
    this.token = token;
    return this;
  };
  exports.ExpressionStatementEndToken.prototype.parse = function () {
    return { type: "EmptyList" };
  };

  return exports;
});

// the blisp parser module
define('lexer',['./tokens'], function(tokens) {
  var exports ={};

  exports.isBoolean = function(value) {
    return (value === "#t" || value === "#f");
  };

  exports.isString = function(value) {
    // TODO: strings are a bit more complex than this...
    return (value.match(/^".*"$/) !== null);
  };

  exports.isNumber = function(value) {
    return (value.match(/[^0-9]/) === null);
  };

  exports.isBinaryOperation = function(value) {
    return (value.match(/^[+-\/\*]$/) !== null);
  };

  exports.isCallOperation = function(value) {
    return (value === "parseInt");
  };

  exports.isStartParen = function(value) {
    return (value === "(");
  };

  exports.isClosingParen = function(value) {
    return (value === ")");
  };

  exports.createToken = function(value) {
    if (exports.isBoolean(value)) {
      return new tokens.BooleanToken(value);
    } else if (exports.isNumber(value)) {
      return new tokens.NumberToken(value);
    } else if (exports.isString(value)) {
      return new tokens.StringToken(value);
    } else if (exports.isBinaryOperation(value)) {
      return new tokens.BinaryExpressionToken(value);
    } else if (exports.isStartParen(value)) {
      return new tokens.ExpressionStatementStartToken(value);
    } else if (exports.isClosingParen(value)) {
      return new tokens.ExpressionStatementEndToken(value);
    } else if (exports.isCallOperation(value)) {
      return new tokens.CallExpressionToken(value);
    }
    throw new Error("Don't know how to create that type of token ("+value+")");
  };

  return exports;
});

define('tokenizer',['./lexer'], function (lexer) {

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
    return lexer.createToken(this.firstToken.trimRight());
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

  var exports = {},
      Tokenizer = tokenizerModule.Tokenizer;

  // reads blisp statements and returns escodegen-compatible AST string.
  exports.generate  = function (blispCode) {
    var expressionStatement,
        tokenizer,
        generatedCode = {};

    tokenizer = (blispCode instanceof Tokenizer ? blispCode : new Tokenizer(blispCode));

    if (tokenizer.first() instanceof tokens.ExpressionStatementStartToken) {
      generatedCode = exports.parseRestOfList(tokenizer.rest());
    } else {
      generatedCode = exports.parseFirstToken(tokenizer);
    }

    return {
      type: "ExpressionStatement",
      expression: generatedCode.ast
    };
  };

  // Parses the list in blispCode, consuming all that list's tokens.
  // Returns an object containing the blispAst list representation and the tokenizer.
  // Expects that the first paren of the first list has been removed.
  exports.parseRestOfList = function(blispCode) {
    var listElement = { type: "List", car: null, cdr: undefined },
        rest,
        tokenizer = (blispCode instanceof Tokenizer ? blispCode : new Tokenizer(blispCode));

    var a = exports.parseFirstToken(tokenizer);
    listElement.car = a.ast;
    tokenizer = a.tokenizer;

    if (tokenizer.first() instanceof tokens.ExpressionStatementEndToken) {
      listElement.cdr = { type: "EmptyList" };
      tokenizer = tokenizer.rest();
    } else {
      rest = exports.parseRestOfList(tokenizer);
      listElement.cdr = rest.ast;
      tokenizer = rest.tokenizer;
    }

    return { ast: listElement, tokenizer: tokenizer };
  };

  // Take a single token off the tokenizer.
  // Returns an object containing the blispAst and the tokenizer.
  exports.parseFirstToken = function(tokenizer) {
    if (tokenizer.first() instanceof tokens.ExpressionStatementStartToken) {
      return exports.parseRestOfList(tokenizer.rest());
    } else {
      return { ast: tokenizer.first().parse(), tokenizer: tokenizer.rest() };
    }
  };

  return exports;
});

// Value converters - convert basic blisp AST value objects to Mozilla Parser AST

define('ast-converters/value',[], function () {
  

  var exports = {};

  exports.convert = function (blispAst) {
    switch (blispAst.type) {
      case "Boolean":
        return convertBoolean(blispAst);
      case "Number":
        return convertNumber(blispAst);
      case "String":
        return convertString(blispAst);
    }
    throw new Error("Cannot convert that value");
  };

  var convertNumber = exports.convertNumber = function (blispAst) {
    if (blispAst.type !== "Number") { throw "Incorrect type: expected Number"; }
    if (typeof blispAst.value !== "number") { throw "Invalid value for Number"; }
    return {
      type: "Literal",
      value: blispAst.value
    };
  };

  var convertString = exports.convertString = function (blispAst) {
    if (blispAst.type !== "String") { throw "Incorrect type: expected String"; }
    if (typeof blispAst.value !== "string") { throw "Invalid value for String"; }
    return {
      type: "Literal",
      value: blispAst.value
    };
  };

  var convertBoolean = exports.convertBoolean = function (blispAst) {
    if (blispAst.type !== "Boolean") { throw "Incorrect type: expected Boolean"; }
    if (blispAst.value !== "#t" && blispAst.value !== "#f") { throw "Invalid value for Boolean"; } 
    return {
        type: "Literal",
        value: blispAst.value === "#t"
      };
  };

  return exports;

});

// Expression converter - convert blisp AST expressions to Mozilla Parser AST

define('ast-converters/expression',
    ['./value'],
    function(valueConverter) {

  

  var exports = {};

  exports.convert = function (blispAst) {
    var ast = "NOT SET";
    if (blispAst.type === "Boolean") {
      ast = valueConverter.convertBoolean(blispAst);
    } else if (blispAst.type === "List") {
      ast = exports.convertList(blispAst);
    } else {
      throw new Error("Unable to convert expression");
    }
    return ast;
  };

  exports.flattenList = function (blispAst) {
    var arrayAst, listElement = blispAst;

    arrayAst = {
      type: "ArrayExpression",
      elements: [  ]
    };

    arrayAst.elements.push(valueConverter.convert(listElement.car));
    while (listElement.cdr.type === "List") {
      listElement = listElement.cdr;

      if (exports.isLiteralValue(listElement.car)) {
        arrayAst.elements.push(valueConverter.convert(listElement.car));
      } else {
        arrayAst.elements.push(exports.convert(listElement.car));
      }
    }

    return arrayAst;
  };


  exports.convertList = function (blispAst) {
    if (exports.isBinaryOperation(blispAst.car)) {
      return exports.convertBinaryExpression(blispAst);
    }

    if (exports.isCallOperation(blispAst.car)) {
      return exports.convertCallExpression(blispAst);
    }

    throw new Error("Don't know how to execute that function");
  };

  exports.convertCallExpression = function(blispAst) {
    var ast = {
      type: "CallExpression",
      callee: {
        type: "Identifier",
        name: undefined
      },
      'arguments': []
    };

    ast.callee.name = blispAst.car.value;
    ast['arguments'] = exports.flattenList(blispAst.cdr).elements;

    return ast;
  };

  exports.isCallOperation = function(car) {
    return (car.type === "Function" && car.value.match(/^parseInt$/) !== null);
  };

  exports.isBinaryOperation = function(car) {
    return (car.type === "Function" && car.value.match(/^[\-\+\/\*]$/) !== null);
  };

  exports.isLiteralValue = function(car) {
    return (car.type === "Number" || car.type === "Boolean" || car.type === "String");
  };

  exports.convertBinaryExpression = function(blispAst) {
    var ast = {
      type: "BinaryExpression",
      operator: undefined,
      left: {
        type: "Literal",
        value: undefined
      },
      right: {
        type: "Literal",
        value: undefined
      }
    };

    ast.operator = blispAst.car.value;

    if (exports.isLiteralValue(blispAst.cdr.car)) {
      ast.left.value = blispAst.cdr.car.value;
    } else {
      ast.left = exports.convert(blispAst.cdr.car);
    }

    if (exports.isLiteralValue(blispAst.cdr.cdr.car)) {
      ast.right.value = blispAst.cdr.cdr.car.value;
    } else {
      ast.right = exports.convert(blispAst.cdr.cdr.car);
    }

    return ast;
  };

  return exports;
});


// ast-converter
// Converts internal list-based AST to Mozilla Parser AST (Esprima / Escodegen compatible)

define('ast-converter',
    ['./ast-converters/expression', './ast-converters/value'],
    function(expressionConverter, valueConverter) {

  var exports = {};

  var wrapAstIntoExpressionStatement = function (ast) {
    return {
      type: "ExpressionStatement",
      expression: ast
    };
  };

  exports.convertExpression = function (blispAst) {
    return expressionConverter.convert(blispAst);
  };

  exports.convertExpressionStatement = function (blispAst) {
    return wrapAstIntoExpressionStatement(exports.convertExpression(blispAst.expression));
  };

  return exports;
});

/*
 * blisp
 * http://iantruslove.github.com/blisp/
 *
 * Copyright (c) 2013 Ian Truslove
 * Licensed under the MIT license.
 */

define('blisp',['./generator', './ast-converter'], function(generator, converter) {

  var exports = {
    generate: function(blispCode) {
      return converter.convertExpressionStatement(generator.generate(blispCode));
    }
  };

  return exports;
});

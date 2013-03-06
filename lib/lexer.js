// the blisp parser module
define(['./tokens'], function(tokens) {
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

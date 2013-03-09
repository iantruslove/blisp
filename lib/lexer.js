// the blisp parser module
define(['./tokens'], function(tokens) {
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

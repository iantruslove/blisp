define(function () {

  var exports = {};

  var BooleanToken = function (token) {
    this.token = token;
    return this;
  };
  BooleanToken.prototype.parse = function () {
    if (this.token === "#t" || this.token === "#f") {
      return { type: "Boolean", value: this.token };
    }
  };

  var NumberToken = function (token) {
    this.token = token;
    return this;
  };
  NumberToken.prototype.parse = function () {
    return { type: "Number", value: parseInt(this.token, 10) };
  };

  var StringToken = function (token) {
    this.token = token;
    return this;
  };
  StringToken.prototype.parse = function () {
    var stringValue = this.token.match(/^"(.*)"$/)[1];
    return { type: "String", value: stringValue };
  };

  var BinaryExpressionToken = function (token) {
    this.token = token;
    return this;
  };
  BinaryExpressionToken.prototype.parse = function () {
    return {
      type: "Function",
      value: this.token
    };
  };

  var CallExpressionToken = function (token) {
    this.token = token;
    return this;
  };
  CallExpressionToken.prototype.parse = function () {
    return {
      type: "Function",
      value: this.token
    };
  };

  var ExpressionStatementStartToken = function (token) {
    this.token = token;
    return this;
  };
  ExpressionStatementStartToken.prototype.parse = function () {
    return {
      type: "List",
      car: null,
      cdr: null
    };
  };

  var ExpressionStatementEndToken = function (token) {
    this.token = token;
    return this;
  };
  ExpressionStatementEndToken.prototype.parse = function () {
    return { type: "EmptyList" };
  };

  exports.BooleanToken = BooleanToken;
  exports.NumberToken = NumberToken;
  exports.StringToken = StringToken;
  exports.BinaryExpressionToken = BinaryExpressionToken;
  exports.CallExpressionToken = CallExpressionToken;
  exports.ExpressionStatementStartToken = ExpressionStatementStartToken;
  exports.ExpressionStatementEndToken = ExpressionStatementEndToken;

  return exports;
});

define(function () {

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

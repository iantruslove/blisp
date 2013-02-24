define(function () {

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

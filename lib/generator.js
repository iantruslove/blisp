define(['./tokenizer', './tokens'], function (tokenizerModule, tokens) {

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

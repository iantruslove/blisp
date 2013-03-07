define(['./tokenizer', './tokens'], function (tokenizerModule, tokens) {

  var exports = {},
      Tokenizer = tokenizerModule.Tokenizer;

  // reads blisp statements and returns escodegen-compatible AST string.
  exports.generate  = function (blispCode) {
    var expressionStatement,
        tokenizer,
        generatedCode;

    expressionStatement = {
      type: "ExpressionStatement",
      expression: null
    };

    tokenizer = (blispCode instanceof Tokenizer ? blispCode : new Tokenizer(blispCode));

    generatedCode = exports.rGenerate(tokenizer);

    expressionStatement.expression = generatedCode.astFragment;
    return expressionStatement;
  };


  // Parses the list in blispCode, consuming all that list's tokens.
  // Returns an object containing the blispAst list representation and the tokenizer.
  exports.parseList = function (blispCode) {
    var listElement = { type: "List", car: null, cdr: undefined },
        tokenizer;

    tokenizer = (blispCode instanceof Tokenizer ? blispCode : new Tokenizer(blispCode));

    tokenizer = tokenizer.rest();   // .first() is the start paren

    // special case: empty lists
    if (tokenizer.first() instanceof tokens.ExpressionStatementEndToken) {
      listElement.car = { type: "EmptyList" };
      return { ast: listElement, tokenizer: tokenizer.rest() };
    }

    return { ast: listElement, tokenizer: {} };
  };

  exports.parseFirstToken = function(tokenizer) {
    if (tokenizer.first() instanceof tokens.ExpressionStatementStartToken) {
      return exports.parseRestOfList(tokenizer.rest());
    } else {
      return { ast: tokenizer.first().parse(), tokenizer: tokenizer.rest() };
    }
  };

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

  exports.rGenerate = function (tokenizer) {
    var token,
        firstParamData, secondParamData,
        thingToReturn = {};

    token = tokenizer.first();

    if (token instanceof tokens.ExpressionStatementStartToken) {
      thingToReturn.astFragment = {
        type: "List",
        car: undefined,
        cdr: undefined
      };

      // this list's car
      tokenizer = tokenizer.rest();
      thingToReturn.astFragment.car = tokenizer.first().parse();

      // the cdr
      if (tokenizer.rest().first() instanceof tokens.ExpressionStatementEndToken) {
        thingToReturn.astFragment.cdr = { type: "EmptyList" };
      } else {
        thingToReturn.astFragment.cdr = exports.rGenerate(tokenizer.rest()).astFragment;
      }

      // closing paren
      tokenizer = tokenizer.rest();

    } else {
      thingToReturn.astFragment = token.parse();
    }

    thingToReturn.tokenizer = tokenizer;
    return thingToReturn;
  };

  return exports;
});

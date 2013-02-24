define(['./tokenizer', './tokens'], function (tokenizerModule, tokens) {

  var generator = {
    // reads blisp statements and returns escodegen-compatible AST string.
    generate: function (blispCode) {
      var expressionStatement,
          tokenizer,
          Tokenizer = tokenizerModule.Tokenizer,
          generatedCode;

      expressionStatement = {
        type: "ExpressionStatement",
        expression: null
      };

      tokenizer = (blispCode instanceof Tokenizer ? blispCode : new Tokenizer(blispCode));

      generatedCode = generator.rGenerate(tokenizer);

      expressionStatement.expression = generatedCode.astFragment;
      return expressionStatement;
    },

    rGenerate: function (tokenizer) {
      var token,
          firstParamData, secondParamData,
          thingToReturn = {};

      token = tokenizer.first();

      if (token instanceof tokens.ExpressionStatementStartToken) {
        thingToReturn.astFragment = {};

        // operator
        tokenizer = tokenizer.rest();
        thingToReturn.astFragment = tokenizer.first().parse();

        // first param
        tokenizer = tokenizer.rest();
        firstParamData = generator.rGenerate(tokenizer);
        thingToReturn.astFragment.left = firstParamData.astFragment;
        tokenizer = firstParamData.tokenizer;

        // second param
        tokenizer = tokenizer.rest();
        secondParamData = generator.rGenerate(tokenizer);
        thingToReturn.astFragment.right = secondParamData.astFragment;
        tokenizer = secondParamData.tokenizer;

        // closing paren
        tokenizer = tokenizer.rest();

      } else {
        thingToReturn.astFragment = token.parse();
      }

      thingToReturn.tokenizer = tokenizer;
      return thingToReturn;
    }
  };

  return generator;
});

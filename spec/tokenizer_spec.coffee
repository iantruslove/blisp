sinon = require 'sinon'
escodegen = require 'escodegen'
requirejs = require 'requirejs'

requirejs.config {
  baseUrl: 'lib',
  nodeRequire: require
}

tokenizerModule = requirejs './tokenizer'
tokens = requirejs './tokens'

describe "the Tokenizer", ->
  it "creates instances of Tokenizer", ->
    tokenizer = tokenizerModule.createTokenizer "(+ 1 2)"
    expect(tokenizer instanceof tokenizerModule.Tokenizer).toBeTruthy()

  it "begets Tokens and Tokenizers", ->
    tokenizer = tokenizerModule.createTokenizer "(+ 1 2)"
    expect(tokenizer.first() instanceof tokens.ExpressionStatementStartToken).toBeTruthy()
    expect(tokenizer.rest() instanceof tokenizerModule.Tokenizer).toBeTruthy()
    expect(tokenizer.rest().first() instanceof tokens.BinaryExpressionToken).toBeTruthy()

  it "provides access to the code", ->
    tokenizer = tokenizerModule.createTokenizer "(+ 1 2)"
    expect(tokenizer.getCode()).toEqual "(+ 1 2)"

  it "tokenizes a number", ->
    tokenizer = tokenizerModule.createTokenizer '1'
    expect(tokenizer.first().token).toEqual '1'
    expect(tokenizer.rest()).toBeNull()

  it "tokenizes a number with leading and trailing white space", ->
    tokenizer = tokenizerModule.createTokenizer " 1  "
    expect(tokenizer.first().token).toEqual "1"
    expect(tokenizer.rest()).toBeNull()

  it "tokenizes an opening paren", ->
    tokenizer = tokenizerModule.createTokenizer "( "
    expect(tokenizer.first().token).toEqual "("
    expect(tokenizer.rest()).toBeNull()

  it "tokenizes a simple expression", ->
    tokenizer = tokenizerModule.createTokenizer "( 1 )"
    expect(tokenizer.first().token).toEqual "("
    expect(tokenizer.rest()).not.toBeNull()
    expect(tokenizer.rest().first().token).toEqual "1"
    expect(tokenizer.rest().rest().first().token).toEqual ")"
    expect(tokenizer.rest().rest().rest()).toBeNull

  it "tokenizes a simple expression with no spacing after paren", ->
    tokenizer = tokenizerModule.createTokenizer "(1 )"
    expect(tokenizer.first().token).toEqual "("
    expect(tokenizer.rest()).not.toBeNull()
    expect(tokenizer.rest().first().token).toEqual "1"
    expect(tokenizer.rest().rest().first().token).toEqual ")"

  it "tokenizes a simple expression with no spacing before trailing paren", ->
    tokenizer = tokenizerModule.createTokenizer "( 1)"
    expect(tokenizer.first().token).toEqual "("
    expect(tokenizer.rest()).not.toBeNull()
    expect(tokenizer.rest().first().token).toEqual "1"
    expect(tokenizer.rest().rest()).not.toBeNull()
    expect(tokenizer.rest().rest().first().token).toEqual ")"


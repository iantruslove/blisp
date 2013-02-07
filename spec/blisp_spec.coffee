blisp = require '../lib/blisp.js'
sinon = require 'sinon'
escodegen = require 'escodegen'

describe "blisp compiler", ->

  values = {}

  beforeEach ->
    values =
      true: '#t'
      false: '#f'
      one: '1'
      two: '2'
      string: "'abc'"

  it "exposes a module", ->
    expect(blisp).toBeDefined()


  describe "the parser", ->
    it "can determine booleans", ->
      expect(blisp.parser.isBoolean values.true).toBe true
      expect(blisp.parser.isBoolean values.false).toBe true
      expect(blisp.parser.isBoolean values.one).toBe false

    it "can determine that integers are numbers", ->
      expect(blisp.parser.isNumber values.one).toBe true
      expect(blisp.parser.isNumber values.false).toBe false

    it "can determine addition binary operator", ->
      expect(blisp.parser.isBinaryOperation "+").toBe true

    it "can determine an opening paren", ->
      expect(blisp.parser.isStartParen "(").toBe true

    it "can determine a closing paren", ->
      expect(blisp.parser.isClosingParen ")").toBe true


  describe "the abstract syntax tree generator", ->

    describe "for simple literals", ->
      it "generates the tree for a single boolean value", ->
        expect(blisp.generator.generate("#t")).toEqual({
          type: "ExpressionStatement",
          expression: {
            type: "Literal",
            value: true
          }})

      it "generates the tree for a single integer", ->
        expect(blisp.generator.generate("4")).toEqual({
          type: "ExpressionStatement",
          expression: {
            type: "Literal",
            value: 4
          }})

    describe "for a simple s-exp", ->
      it "parses a simple s-exp", ->
        expect(blisp.generator.generate("(+ 12 24)")).toEqual({
          type: "ExpressionStatement",
          expression: {
            type: "BinaryExpression",
            operator: "+",
            left: {
              type: "Literal",
              value: 12
            },
            right: {
              type: "Literal",
              value: 24
            }
          }})

      it "parses a nested s-exp", ->
        expect(blisp.generator.generate("(+ (+ 10 11) 24)")).toEqual({
          type: "ExpressionStatement",
          expression: {
            type: "BinaryExpression",
            operator: "+",
            left: {
              type: "BinaryExpression",
              operator: "+",
              left: {
                type: "Literal",
                value: 10
              },
              right: {
                type: "Literal",
                value: 11
              }
            },
            right: {
              type: "Literal",
              value: 24
            }
          }})

  describe "the BooleanToken", ->
    it "correctly parses the data as a boolean", ->
      expect(new blisp.BooleanToken(values.true).parse()).toEqual { type: "Literal", value: true }
      expect(new blisp.BooleanToken(values.false).parse()).toEqual { type: "Literal", value: false }

  describe "the NumberToken", ->
    it "correctly parses the data as a number", ->
      expect(new blisp.NumberToken(values.one).parse()).toEqual { type: "Literal", value: 1 }
      expect(new blisp.NumberToken(values.two).parse()).toEqual { type: "Literal", value: 2 }

  describe "the BinaryExpressionToken", ->
    it "correctly parses the data as a number", ->
      expect(new blisp.BinaryExpressionToken("+").parse()).toEqual {
        type: "BinaryExpression",
        operator: "+",
        left: null,
        right: null
      }

  describe "the ExpressionStatementStartToken", ->
    it "parses to an empty object", ->
      expect(new blisp.ExpressionStatementStartToken("(").parse()).toEqual {}

  describe "the Tokenizer", ->
    it "creates instances of Tokenizer", ->
      tokenizer = blisp.createTokenizer "(+ 1 2)"
      expect(tokenizer instanceof blisp.Tokenizer).toBeTruthy()

    it "begets Tokens and Tokenizers", ->
      tokenizer = blisp.createTokenizer "(+ 1 2)"
      expect(tokenizer.first() instanceof blisp.ExpressionStatementStartToken).toBeTruthy()
      expect(tokenizer.rest() instanceof blisp.Tokenizer).toBeTruthy()
      expect(tokenizer.rest().first() instanceof blisp.BinaryExpressionToken).toBeTruthy()

    it "provides access to the code", ->
      tokenizer = blisp.createTokenizer "(+ 1 2)"
      expect(tokenizer.getCode()).toEqual "(+ 1 2)"

    it "tokenizes a number", ->
      tokenizer = blisp.createTokenizer values.one
      expect(tokenizer.first().token).toEqual values.one
      expect(tokenizer.rest()).toBeNull()

    it "tokenizes a number with leading and trailing white space", ->
      tokenizer = blisp.createTokenizer " 1  "
      expect(tokenizer.first().token).toEqual "1"
      expect(tokenizer.rest()).toBeNull()

    it "tokenizes an opening paren", ->
      tokenizer = blisp.createTokenizer "( "
      expect(tokenizer.first().token).toEqual "("
      expect(tokenizer.rest()).toBeNull()

    it "tokenizes a simple expression", ->
      tokenizer = blisp.createTokenizer "( 1 )"
      expect(tokenizer.first().token).toEqual "("
      expect(tokenizer.rest()).not.toBeNull()
      expect(tokenizer.rest().first().token).toEqual "1"
      expect(tokenizer.rest().rest().first().token).toEqual ")"
      expect(tokenizer.rest().rest().rest()).toBeNull

    it "tokenizes a simple expression with no spacing after paren", ->
      tokenizer = blisp.createTokenizer "(1 )"
      expect(tokenizer.first().token).toEqual "("
      expect(tokenizer.rest()).not.toBeNull()
      expect(tokenizer.rest().first().token).toEqual "1"
      expect(tokenizer.rest().rest().first().token).toEqual ")"

    it "tokenizes a simple expression with no spacing before trailing paren", ->
      tokenizer = blisp.createTokenizer "( 1)"
      expect(tokenizer.first().token).toEqual "("
      expect(tokenizer.rest()).not.toBeNull()
      expect(tokenizer.rest().first().token).toEqual "1"
      expect(tokenizer.rest().rest()).not.toBeNull()
      expect(tokenizer.rest().rest().first().token).toEqual ")"


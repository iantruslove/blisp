blisp = require '../lib/blisp.js'
sinon = require 'sinon'

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
        expect(blisp.generator.generateStatement("#t")).toEqual({
          type: "ExpressionStatement",
          expression: {
            type: "Literal",
            value: true
          }})

      it "generates the tree for a single integer", ->
        expect(blisp.generator.generateStatement("4")).toEqual({
          type: "ExpressionStatement",
          expression: {
            type: "Literal",
            value: 4
          }})

    describe "for a simple s-exp", ->
      it "parses a simlpe s-exp", ->
        expect(blisp.generator.generateStatement("(+ 1 2)")).toEqual({
          type: "ExpressionStatement",
          expression: {
            type: "BinaryExpression",
            operator: "+",
            left: {
              type: "Literal",
              value: 1
            },
            right: {
              type: "Literal",
              value: 2
            }
          }})

  describe "the Token", ->
    it "provides access to the original blisp string", ->
      token = new blisp.Token "1"
      expect(token.blisp()).toEqual "1"

  describe "the BooleanToken", ->
    it "is a Token", ->
      booleanToken = new blisp.BooleanToken(values.true)
      expect(booleanToken instanceof blisp.Token).toBeTruthy()
      expect(booleanToken instanceof blisp.BooleanToken).toBeTruthy()

    it "correctly parses the data as a boolean", ->
      expect(new blisp.BooleanToken(values.true).parse()).toEqual { type: "Literal", value: true }
      expect(new blisp.BooleanToken(values.false).parse()).toEqual { type: "Literal", value: false }

  describe "the NumberToken", ->
    it "is a Token", ->
      numberToken = new blisp.NumberToken(values.true)
      expect(numberToken instanceof blisp.Token).toBeTruthy()
      expect(numberToken instanceof blisp.NumberToken).toBeTruthy()

    it "correctly parses the data as a number", ->
      expect(new blisp.NumberToken(values.one).parse()).toEqual { type: "Literal", value: 1 }
      expect(new blisp.NumberToken(values.two).parse()).toEqual { type: "Literal", value: 2 }

  describe "the BinaryExpressionToken", ->
    it "is a Token", ->
      binaryExpressionToken = new blisp.BinaryExpressionToken(values.true)
      expect(binaryExpressionToken instanceof blisp.Token).toBeTruthy()
      expect(binaryExpressionToken instanceof blisp.BinaryExpressionToken).toBeTruthy()

    it "correctly parses the data as a number", ->
      expect(new blisp.BinaryExpressionToken("+").parse()).toEqual {
        type: "BinaryExpression",
        operator: "+",
        left: null,
        right: null
      }

  describe "the ExpressionStatementStartToken", ->
    it "is a Token", ->
      token = new blisp.ExpressionStatementStartToken("(")
      expect(token instanceof blisp.Token).toBeTruthy()
      expect(token instanceof blisp.ExpressionStatementStartToken).toBeTruthy()

    it "parses to an empty object", ->
      expect(new blisp.ExpressionStatementStartToken("(").parse()).toEqual {}

  describe "the Tokenizer", ->
    it "creates instances of Tokenizer", ->
      tokenizer = blisp.createTokenizer "(+ 1 2)"
      expect(tokenizer instanceof blisp.Tokenizer).toBeTruthy()

    it "begets Tokens and Tokenizers", ->
      tokenizer = blisp.createTokenizer "(+ 1 2)"
      expect(tokenizer.first() instanceof blisp.Token).toBeTruthy()
      expect(tokenizer.first() instanceof blisp.ExpressionStatementStartToken).toBeTruthy()
      expect(tokenizer.rest() instanceof blisp.Tokenizer).toBeTruthy()
      expect(tokenizer.rest().first() instanceof blisp.BinaryExpressionToken).toBeTruthy()

    it "tokenizes a number", ->
      tokenizer = blisp.createTokenizer values.one
      expect(tokenizer.first().blisp()).toEqual values.one
      expect(tokenizer.rest()).toBeNull()

    it "tokenizes a number with leading and trailing white space", ->
      tokenizer = blisp.createTokenizer " 1  "
      expect(tokenizer.first().blisp()).toEqual "1"
      expect(tokenizer.rest()).toBeNull()

    it "tokenizes an opening paren", ->
      tokenizer = blisp.createTokenizer "( "
      expect(tokenizer.first().blisp()).toEqual "("
      expect(tokenizer.rest()).toBeNull()

    it "tokenizes a simple expression", ->
      tokenizer = blisp.createTokenizer "( 1 )"
      expect(tokenizer.first().blisp()).toEqual "("
      expect(tokenizer.rest()).not.toBeNull()
      expect(tokenizer.rest().first().blisp()).toEqual "1"
      expect(tokenizer.rest().rest().first().blisp()).toEqual ")"
      expect(tokenizer.rest().rest().rest()).toBeNull

    it "tokenizes a simple expression with no spacing after paren", ->
      tokenizer = blisp.createTokenizer "(1 )"
      expect(tokenizer.first().blisp()).toEqual "("
      expect(tokenizer.rest()).not.toBeNull()
      expect(tokenizer.rest().first().blisp()).toEqual "1"
      expect(tokenizer.rest().rest().first().blisp()).toEqual ")"

    it "tokenizes a simple expression with no spacing before trailing paren", ->
      tokenizer = blisp.createTokenizer "( 1)"
      expect(tokenizer.first().blisp()).toEqual "("
      expect(tokenizer.rest()).not.toBeNull()
      expect(tokenizer.rest().first().blisp()).toEqual "1"
      expect(tokenizer.rest().rest()).not.toBeNull()
      expect(tokenizer.rest().rest().first().blisp()).toEqual ")"



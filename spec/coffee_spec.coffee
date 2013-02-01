blisp = require '../lib/blisp.js'

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

  it "can add two numbers", ->
    sExp = "(+ 1 2)"
    #TODO expect(blisp.compile(sExp)).toEqual "1+2"

  describe "support for types in r6rs", ->
    it "compiles booleans", ->
      expect(blisp.compile values.true).toEqual "true"
      expect(blisp.compile values.false).toEqual "false"

    it "compiles numbers", ->
      expect(blisp.compile(values.one)).toEqual "1"

    it "compiles strings into strings", ->
      aString = "'abc'"
      expect(blisp.compile(values.string)).toEqual "'abc'"


  describe "the parser", ->
    it "can determine booleans", ->
      expect(blisp.parser.isBoolean values.true).toBe true
      expect(blisp.parser.isBoolean values.false).toBe true
      expect(blisp.parser.isBoolean values.one).toBe false

    it "parses booleans", ->
      expect(blisp.parser.parseBoolean(values.true)).toEqual { type: "Literal", value: true }
      expect(blisp.parser.parseBoolean(values.false)).toEqual { type: "Literal", value: false }

    it "can determine that integers are numbers", ->
      expect(blisp.parser.isNumber values.one).toBe true
      expect(blisp.parser.isNumber values.false).toBe false

    it "can parse integer numbers", ->
      expect(blisp.parser.parseNumber values.one).toEqual { type: "Literal", value: 1 }
      expect(blisp.parser.parseNumber values.two).toEqual { type: "Literal", value: 2 }

    it "can determine addition binary operator", ->
      expect(blisp.parser.isBinaryOperation "+").toBe true

    it "can parse the addition binary operator", ->
      expect(blisp.parser.parseBinaryOperation "+").toEqual({
        type: "BinaryExpression",
        operator: "+",
        left: null,
        right: null
      })

    it "can determine an opening paren", ->
      expect(blisp.parser.isStartParen "(").toBe true

    it "can parse an opening paren", ->
      expect(blisp.parser.parseStartParen "(").toEqual({
        type: "ExpressionStatement", 
        expression: null
      })

    it "can determine a closing paren", ->
      expect(blisp.parser.isClosingParen ")").toBe true

    it "can parse any literal", ->
      expect(blisp.parser.parseToken values.one).toEqual { type: "Literal", value: 1 }
      expect(blisp.parser.parseToken values.false).toEqual { type: "Literal", value: false }
      expect(blisp.parser.parseToken "+").toEqual { type: "BinaryExpression", operator: "+", left: null, right: null }
      expect(blisp.parser.parseToken "(").toEqual { type: "ExpressionStatement", expression: null }


  describe "the abstract syntax tree generator", ->
    it "generates the tree for a single boolean value", ->
      expect(blisp.parser.generateSyntaxTree(values.true)).toEqual({
        type: "ExpressionStatement",
        expression: {
          type: "Literal",
          value: true
        }})

    it "generates the tree for a single integer", ->
      expect(blisp.parser.generateSyntaxTree(values.one)).toEqual({
        type: "ExpressionStatement",
        expression: {
          type: "Literal",
          value: 1
        }})


  describe "the tokenizer", ->
    it "creates instances of Tokenizer", ->
      tokenizer = blisp.createTokenizer values.one
      expect(tokenizer instanceof blisp.Tokenizer).toBeTruthy()

    it "tokenizes a number", ->
      tokenizer = blisp.createTokenizer values.one
      expect(tokenizer.first()).toEqual values.one
      expect(tokenizer.rest()).toBeNull()

    it "tokenizes a number with leading and trailing white space", ->
      tokenizer = blisp.createTokenizer " 1  "
      expect(tokenizer.first()).toEqual "1"
      expect(tokenizer.rest()).toBeNull()

    it "tokenizes an opening paren", ->
      tokenizer = blisp.createTokenizer "( "
      expect(tokenizer.first()).toEqual "("
      expect(tokenizer.rest()).toBeNull()

    it "tokenizes a simple expression", ->
      tokenizer = blisp.createTokenizer "( 1 )"
      expect(tokenizer.first()).toEqual "("
      expect(tokenizer.rest()).not.toBeNull()
      expect(tokenizer.rest().first()).toEqual "1"
      expect(tokenizer.rest().rest().first()).toEqual ")"
      expect(tokenizer.rest().rest().rest()).toBeNull

    it "tokenizes a simple expression with no spacing after paren", ->
      tokenizer = blisp.createTokenizer "(1 )"
      expect(tokenizer.first()).toEqual "("
      expect(tokenizer.rest()).not.toBeNull()
      expect(tokenizer.rest().first()).toEqual "1"
      expect(tokenizer.rest().rest().first()).toEqual ")"

    it "tokenizes a simple expression with no spacing before trailing paren", ->
      tokenizer = blisp.createTokenizer "( 1)"
      expect(tokenizer.first()).toEqual "("
      expect(tokenizer.rest()).not.toBeNull()
      expect(tokenizer.rest().first()).toEqual "1"
      expect(tokenizer.rest().rest()).not.toBeNull()
      expect(tokenizer.rest().rest().first()).toEqual ")"





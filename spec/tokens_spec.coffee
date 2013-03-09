requirejs = require 'requirejs'

requirejs.config {
  baseUrl: 'lib',
  nodeRequire: require
}

tokens = requirejs './tokens'

describe "tokens", ->
  values = {}

  beforeEach ->
    values =
      true: '#t'
      false: '#f'
      one: '1'
      two: '2'
      string: "'abc'"

  describe "the BooleanToken", ->
    it "correctly parses the data as a boolean", ->
      expect(new tokens.BooleanToken(values.true).parse()).toEqual { type: "Boolean", value: "#t" }
      expect(new tokens.BooleanToken(values.false).parse()).toEqual { type: "Boolean", value: "#f" }

  describe "the NumberToken", ->
    it "correctly parses the data as a number", ->
      expect(new tokens.NumberToken(values.one).parse()).toEqual { type: "Number", value: 1 }
      expect(new tokens.NumberToken(values.two).parse()).toEqual { type: "Number", value: 2 }

  describe "the StringToken", ->
    it "correctly parses the string data", ->
      expect(new tokens.StringToken('"abc"').parse()).toEqual { type: "String", value: "abc" }

  describe "the BinaryExpressionToken", ->
    it "correctly parses the operation type", ->
      expect(new tokens.BinaryExpressionToken("+").parse()).toEqual {
        type: "Function",
        value: "+" }

  describe "the CallExpressionToken", ->
    it "correctly parses the function name", ->
      expect(new tokens.CallExpressionToken("parseInt").parse()).toEqual {
        type: "Function",
        value: "parseInt" }

  describe "the ExpressionStatementStartToken", ->
    it "parses to an unfilled list structure", ->
      expect(new tokens.ExpressionStatementStartToken("(").parse()).toEqual {
        type: "List",
        car: null,
        cdr: null }

  describe "the ExpressionStatementEndToken", ->
    it "parses to a list terminator", ->
      expect(new tokens.ExpressionStatementEndToken(")").parse()).toEqual {
        type: "EmptyList" }



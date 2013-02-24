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
      expect(new tokens.BooleanToken(values.true).parse()).toEqual { type: "Literal", value: true }
      expect(new tokens.BooleanToken(values.false).parse()).toEqual { type: "Literal", value: false }

  describe "the NumberToken", ->
    it "correctly parses the data as a number", ->
      expect(new tokens.NumberToken(values.one).parse()).toEqual { type: "Literal", value: 1 }
      expect(new tokens.NumberToken(values.two).parse()).toEqual { type: "Literal", value: 2 }

  describe "the BinaryExpressionToken", ->
    it "correctly parses the data as a number", ->
      expect(new tokens.BinaryExpressionToken("+").parse()).toEqual {
        type: "BinaryExpression",
        operator: "+",
        left: null,
        right: null
      }

  describe "the ExpressionStatementStartToken", ->
    it "parses to an empty object", ->
      expect(new tokens.ExpressionStatementStartToken("(").parse()).toEqual {}



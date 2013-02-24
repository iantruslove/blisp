requirejs = require 'requirejs'

requirejs.config {
  baseUrl: 'lib',
  nodeRequire: require
}

generator = requirejs './generator'

describe "the abstract syntax tree generator", ->

  describe "for simple literals", ->
    it "generates the tree for a single boolean value", ->
      expect(generator.generate("#t")).toEqual({
        type: "ExpressionStatement",
        expression: {
          type: "Literal",
          value: true
        }})

    it "generates the tree for a single integer", ->
      expect(generator.generate("4")).toEqual({
        type: "ExpressionStatement",
        expression: {
          type: "Literal",
          value: 4
        }})

  describe "for a simple s-exp", ->
    it "parses a simple s-exp", ->
      expect(generator.generate("(+ 12 24)")).toEqual({
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
      expect(generator.generate("(+ (+ 10 11) 24)")).toEqual({
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


sinon = require 'sinon'
requirejs = require 'requirejs'

requirejs.config {
  baseUrl: 'lib',
  nodeRequire: require
}

converter = requirejs './ast-converter'

describe "the ast-converter", ->
  it "exists", ->
    expect(converter).toBeDefined()

  it "has an expression conversion method", ->
    expect(converter.convertExpression).toBeDefined()


  describe "expression converter", ->
    it "converts simple boolean expressions", ->
      expect(converter.convertExpression {
        type: "ExpressionStatement",
        expression: {
          type: "Boolean",
          value: "#t"
        }
      }).toEqual {
        type: "ExpressionStatement",
        expression: {
          type: "Literal",
          value: true
        }
      }

    it "converts list expressions", ->
      blispAst = {
        type: "ExpressionStatement",
        expression: {
          type: "List",
          car: {
            type: "Boolean",
            value: "#t"
          },
          cdr: {
            type: "EmptyList"
          }
        }
      }
      jsAst = {
        type: "ExpressionStatement"
        expression: {
          type: "SequenceExpression",
          expressions: [
            {
              type: "Literal",
              value: true
            },
            {
              type: "Literal",
              value: true
            }
          ]
        }
      }
      expect(converter.convertExpression blispAst).toEqual jsAst



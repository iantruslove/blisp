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

  it "has an expression statement conversion method", ->
    expect(converter.convertExpressionStatement).toBeDefined()


  describe "overall expression statement converter", ->
    it "converts simple boolean expressions", ->
      blispAst = {
        type: "ExpressionStatement",
        expression: {
          type: "Boolean",
          value: "#t" } }

      jsAst = {
        type: "ExpressionStatement",
        expression: {
          type: "Literal",
          value: true } }

      expect(converter.convertExpressionStatement blispAst).toEqual jsAst


    it "converts list-based expressions", ->
      blispAst = {
        type: "ExpressionStatement",
        expression: {
          type: "List",
          car: {
            type: "Function",
            value: "parseInt"
          },
          cdr: {
            type: "List",
            car: {
              type: "String",
              value: "a"
            },
            cdr: {
              type: "List",
              car: {
                type: "Number",
                value: 16
              },
              cdr: {
                type: "EmptyList"
              } } } } }

      jsAst = {
          type: "ExpressionStatement",
          expression: {
            type: "CallExpression"
            callee: {
              type: "Identifier",
              name: "parseInt"
            },
            'arguments': [
              { type: "Literal", value: "a" },
              { type: "Literal", value: 16 }
            ] } }

      expect(converter.convertExpressionStatement blispAst).toEqual jsAst

  describe "the expression statement converter delegates to the expression converter", ->
    beforeEach ->
      sinon.stub converter, "convertExpression"
      return

    afterEach ->
      converter.convertExpression.restore()
      return

    it "delegates", ->
      converter.convertExpressionStatement {}
      expect(converter.convertExpression.callCount).toBe 1

    it "wraps the response from the expression converter into a statement", ->
      converter.convertExpression.returns { fake: "data" }
      expect(converter.convertExpressionStatement {}).toEqual {
        type: "ExpressionStatement",
        expression: {
          fake: "data" } }


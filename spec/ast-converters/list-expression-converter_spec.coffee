sinon = require 'sinon'
requirejs = require 'requirejs'

requirejs.config {
  baseUrl: 'lib',
  nodeRequire: require
}

listExpressionConverter = requirejs './ast-converters/expression'

describe "list expression converter", ->
  describe "main conversion interface", ->
    beforeEach ->
      sinon.stub(listExpressionConverter, 'convertCallExpression')
      sinon.stub(listExpressionConverter, 'convertBinaryExpression')

    afterEach ->
      listExpressionConverter.convertCallExpression.restore()
      listExpressionConverter.convertBinaryExpression.restore()

    it "throws an error if the function is unknown", ->
      blispAst = {
        type: "List",
        car: {
          type: "Function",
          value: "MY_MADE_UP_NON_FUNCTION"
        } }
      expect(-> listExpressionConverter.convert blispAst).toThrow "Don't know how to execute that function"

    it "delegates for call expression calls", ->
      blispAst = {
        type: "List",
        car: {
          type: "Function",
          value: "parseInt"
        } }
      listExpressionConverter.convert blispAst
      expect(listExpressionConverter.convertBinaryExpression.callCount).toEqual 0
      expect(listExpressionConverter.convertCallExpression.callCount).toEqual 1

    it "delegates for binary operation calls", ->
      blispAst = {
        type: "List",
        car: {
          type: "Function",
          value: "+"
        } }
      listExpressionConverter.convert blispAst
      expect(listExpressionConverter.convertBinaryExpression.callCount).toEqual 1
      expect(listExpressionConverter.convertCallExpression.callCount).toEqual 0

  describe "testing different types of things", ->
    plus = { type: "Function", value: "+" }
    minus = { type: "Function", value: "-" }
    mult = { type: "Function", value: "*" }
    div = { type: "Function", value: "/" }
    parseInt = { type: "Function", value: "parseInt" }

    it "tests whether operations are binary operations", ->
      expect(listExpressionConverter.isBinaryOperation(plus)).toBe true
      expect(listExpressionConverter.isBinaryOperation(minus)).toBe true
      expect(listExpressionConverter.isBinaryOperation(mult)).toBe true
      expect(listExpressionConverter.isBinaryOperation(div)).toBe true
      expect(listExpressionConverter.isBinaryOperation(parseInt)).toBe false

    it "tests whether operations are call operations", ->
      expect(listExpressionConverter.isCallOperation(div)).toBe false
      expect(listExpressionConverter.isCallOperation(parseInt)).toBe true

  describe "converting different types of expressions", ->
    it "converts call expression operations", ->
      blispAst = {
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
              type: "EmptyList" } } } }
      jsAst = {
        type: "CallExpression"
        callee: {
          type: "Identifier",
          name: "parseInt"
        },
        'arguments': [
          { type: "Literal", value: "a" },
          { type: "Literal", value: 16 } ] }
      expect(listExpressionConverter.convertCallExpression blispAst).toEqual jsAst

    it "converts binary operations", ->
      blispAst = {
        type: "List",
        car: {
          type: "Function",
          value: "+"
        },
        cdr: {
          type: "List",
          car: {
            type: "Number",
            value: 8
          },
          cdr: {
            type: "List",
            car: {
              type: "Number",
              value: 16
            },
            cdr: {
              type: "EmptyList"
            } } } }
      jsAst = {
        type: "BinaryExpression",
        operator: "+",
        left: {
          type: "Literal",
          value: 8
        },
        right: {
          type: "Literal",
          value: 16 } }
      debugger
      expect(listExpressionConverter.convertBinaryExpression blispAst).toEqual jsAst

    it "converts nested binary operation expressions", ->
      blispAst = {
        type: "List",
        car: {
          type: "Function",
          value: "+"
        },
        cdr: {
          type: "List",
          car: {
            type: "List",
            car: {
              type: "Function",
              value: "+"
            },
            cdr: {
              type: "List",
              car: {
                type: "Number",
                value: 10
              },
              cdr: {
                type: "List",
                car: {
                  type: "Number",
                  value: 11
                },
                cdr: {
                  type: "EmptyList"
                } } } },
          cdr: {
            type: "List",
            car: {
              type: "Number",
              value: 24
            },
            cdr: {
              type: "EmptyList"
            } } } }
      jsAst = {
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
          } },
        right: {
          type: "Literal",
          value: 24 } }
      expect(listExpressionConverter.convertBinaryExpression blispAst).toEqual jsAst


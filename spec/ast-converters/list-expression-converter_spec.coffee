sinon = require 'sinon'
requirejs = require 'requirejs'

requirejs.config {
  baseUrl: 'lib',
  nodeRequire: require
}

listExpressionConverter = requirejs './ast-converters/list-expression'

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
          type: "ExpressionStatement",
          expression: {
            type: "CallExpression"
            callee: {
              type: "Identifier",
              name: "parseInt"
            },
            'arguments': [
              { type: "Literal", value: "a" },
              { type: "Literal", value: 16 } ] } }
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
        type: "ExpressionStatement",
        expression: {
          type: "BinaryExpression",
          operator: "+",
          left: {
            type: "Literal",
            value: 8
          },
          right: {
            type: "Literal",
            value: 16 } } }
      expect(listExpressionConverter.convertBinaryExpression blispAst).toEqual jsAst

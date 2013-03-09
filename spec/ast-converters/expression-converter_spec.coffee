sinon = require 'sinon'
requirejs = require 'requirejs'

requirejs.config {
  baseUrl: 'lib',
  nodeRequire: require
}

converter = requirejs './ast-converters/expression'

describe "expression converter", ->
  it "converts simple boolean expressions", ->
    blispAst = {
        type: "Boolean",
        value: "#t" }

    jsAst = {
        type: "Literal",
        value: true }

    expect(converter.convert blispAst).toEqual jsAst


  it "converts list-based expressions", ->
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
              type: "EmptyList"
            } } } }

    jsAst = {
          type: "CallExpression"
          callee: {
            type: "Identifier",
            name: "parseInt"
          },
          'arguments': [
            { type: "Literal", value: "a" },
            { type: "Literal", value: 16 }
          ] } 
    expect(converter.convert blispAst).toEqual jsAst

describe "list expression converter", ->
  describe "main conversion interface", ->
    beforeEach ->
      sinon.stub(converter, 'convertCallExpression')
      sinon.stub(converter, 'convertBinaryExpression')

    afterEach ->
      converter.convertCallExpression.restore()
      converter.convertBinaryExpression.restore()

    it "throws an error if the function is unknown", ->
      blispAst = {
        type: "List",
        car: {
          type: "Function",
          value: "MY_MADE_UP_NON_FUNCTION"
        } }
      expect(-> converter.convert blispAst).toThrow "Don't know how to execute that function"

    it "delegates for call expression calls", ->
      blispAst = {
        type: "List",
        car: {
          type: "Function",
          value: "parseInt"
        } }
      converter.convert blispAst
      expect(converter.convertBinaryExpression.callCount).toEqual 0
      expect(converter.convertCallExpression.callCount).toEqual 1

    it "delegates for binary operation calls", ->
      blispAst = {
        type: "List",
        car: {
          type: "Function",
          value: "+"
        } }
      converter.convert blispAst
      expect(converter.convertBinaryExpression.callCount).toEqual 1
      expect(converter.convertCallExpression.callCount).toEqual 0

  describe "testing different types of things", ->
    plus = { type: "Function", value: "+" }
    minus = { type: "Function", value: "-" }
    mult = { type: "Function", value: "*" }
    div = { type: "Function", value: "/" }
    parseInt = { type: "Function", value: "parseInt" }

    it "tests whether operations are binary operations", ->
      expect(converter.isBinaryOperation(plus)).toBe true
      expect(converter.isBinaryOperation(minus)).toBe true
      expect(converter.isBinaryOperation(mult)).toBe true
      expect(converter.isBinaryOperation(div)).toBe true
      expect(converter.isBinaryOperation(parseInt)).toBe false

    it "tests whether operations are call operations", ->
      expect(converter.isCallOperation(div)).toBe false
      expect(converter.isCallOperation(parseInt)).toBe true

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
      expect(converter.convertCallExpression blispAst).toEqual jsAst

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
      expect(converter.convertBinaryExpression blispAst).toEqual jsAst

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
      expect(converter.convertBinaryExpression blispAst).toEqual jsAst

  describe "list flattining", ->
    it "can flatten a single-item list", ->
      blispAst = {
        type: "List",
        car: {
          type: "Boolean",
          value: "#t"
        },
        cdr: {
          type: "EmptyList" }}
      jsAst = {
        type: "ArrayExpression",
        elements: [ {
            type: "Literal",
            value: true } ] }
      expect(converter.flattenList blispAst).toEqual jsAst

    it "can flatten a two-item list", ->
      blispAst = {
        type: "List",
        car: {
          type: "Boolean",
          value: "#t"
        },
        cdr: {
          type: "List"
          car: {
            type: "Boolean",
            value: "#f"
          },
          cdr: {
            type: "EmptyList" }}}
      jsAst = {
        type: "ArrayExpression",
        elements: [
          { type: "Literal", value: true },
          { type: "Literal", value: false }
        ] }
      expect(converter.flattenList blispAst).toEqual jsAst





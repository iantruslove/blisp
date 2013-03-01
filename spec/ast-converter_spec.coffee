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


  describe "expression statement converter", ->
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
              {
                type: "Literal",
                value: "a"
              },
              {
                type: "Literal",
                value: 16 } ] } }

      expect(converter.convertExpressionStatement blispAst).toEqual jsAst

  describe "basic type converters", ->
    describe "boolean converter", ->
      it "converts true boolean values", ->
        blispAst = {
            type: "Boolean",
            value: "#t" }
        jsAst = {
            type: "Literal",
            value: true }
        expect(converter.convertBoolean blispAst).toEqual jsAst

      it "converts false boolean values", ->
        blispAst = {
            type: "Boolean",
            value: "#f" }
        jsAst = {
            type: "Literal",
            value: false }

        expect(converter.convertBoolean blispAst).toEqual jsAst

      it "throws an error if the type is incorrect", ->
        expect(-> converter.convertBoolean { type: "Fish"}).toThrow "Incorrect type: expected Boolean"

      it "throws an error if the value is not a boolean", ->
        expect(-> converter.convertBoolean { type: "Boolean", value: "true"}).toThrow "Invalid value for Boolean"




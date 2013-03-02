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


    # TODO: Need to have list converter actually convert the elements
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

  describe "list converters", ->
    it "can convert a single-item list", ->
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
      expect(converter.listConverters.convertList blispAst).toEqual jsAst

    it "can convert a two-item list", ->
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
      expect(converter.listConverters.convertList blispAst).toEqual jsAst





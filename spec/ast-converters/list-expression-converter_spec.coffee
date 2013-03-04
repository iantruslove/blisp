sinon = require 'sinon'
requirejs = require 'requirejs'

requirejs.config {
  baseUrl: 'lib',
  nodeRequire: require
}

listExpressionConverter = requirejs './ast-converters/list-expression'

describe "list expression converter", ->
  it "converts full expressions", ->
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

    expect(listExpressionConverter.convert blispAst).toEqual jsAst


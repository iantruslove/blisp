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


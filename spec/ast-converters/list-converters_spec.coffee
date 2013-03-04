sinon = require 'sinon'
requirejs = require 'requirejs'

requirejs.config {
  baseUrl: 'lib',
  nodeRequire: require
}

listConverters = requirejs './ast-converters/lists'

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
    expect(listConverters.convertList blispAst).toEqual jsAst

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
    expect(listConverters.convertList blispAst).toEqual jsAst





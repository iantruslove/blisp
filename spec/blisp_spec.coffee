sinon = require 'sinon'
escodegen = require 'escodegen'
requirejs = require 'requirejs'

requirejs.config {
  baseUrl: 'lib',
  nodeRequire: require
}

blisp = requirejs './blisp'

describe "blisp compiler", ->

  it "exposes a module", ->
    expect(blisp).toBeDefined()

  it "has a method to generate moz parser AST", ->
    expect(blisp.generate).toBeDefined()

  it "converts blisp to moz parser AST", ->
    code = "(+ 1 2)"
    ast = {
      type: "ExpressionStatement",
      expression: {
        type: "BinaryExpression",
        operator: "+",
        left: {
          type: "Literal",
          value: 1
        },
        right: {
          type: "Literal",
          value: 2 } } }
    expect(blisp.generate code).toEqual ast


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
    actualAst = blisp.generate "(+ (+ 1 2) 3)"
    expectedAst = {
      type: "ExpressionStatement",
      expression: {
        type: "BinaryExpression",
        operator: "+",
        left: {
          type: "BinaryExpression",
          operator: "+",
          left: {
            type: "Literal",
            value: 1
          },
          right: {
            type: "Literal",
            value: 2 } },
        right: {
          type: "Literal",
          value: 3 } } }

    console.log "Actual:"
    console.log JSON.stringify actualAst, null, 2
    console.log "Expected:"
    console.log JSON.stringify expectedAst, null, 2

    expect(actualAst).toEqual expectedAst


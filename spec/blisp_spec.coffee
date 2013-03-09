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

  it "converts nested blisp binary expressions to moz parser AST", ->
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
    expect(actualAst).toEqual expectedAst

  it "converts blisp call expresions to moz parser AST", ->
    actualAst = blisp.generate '(parseInt "10" 2)'
    expectedAst = {
      type: "ExpressionStatement",
      expression: {
        type: "CallExpression",
        callee: {
          type: "Identifier",
          name: "parseInt"
        },
        'arguments': [ {
            type: "Literal",
            value: "10"
          }, {
            type: "Literal",
            value: 2 } ] } }
    expect(actualAst).toEqual expectedAst

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

  xit "converts blisp to moz parser AST", ->
    code = "(+ 32 12)"
    ast = {}
    expect(blisp.generate code).toEqual ast


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


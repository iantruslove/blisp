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


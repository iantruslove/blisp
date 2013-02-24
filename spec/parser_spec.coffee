sinon = require 'sinon'
requirejs = require 'requirejs'

requirejs.config {
  baseUrl: 'lib',
  nodeRequire: require
}

parser = requirejs './parser'

describe "the parser", ->
  values = {}

  beforeEach ->
    values =
      true: '#t'
      false: '#f'
      one: '1'
      two: '2'
      string: "'abc'"

  it "can determine booleans", ->
    expect(parser.isBoolean values.true).toBe true
    expect(parser.isBoolean values.false).toBe true
    expect(parser.isBoolean values.one).toBe false

  it "can determine that integers are numbers", ->
    expect(parser.isNumber values.one).toBe true
    expect(parser.isNumber values.false).toBe false

  it "can determine addition binary operator", ->
    expect(parser.isBinaryOperation "+").toBe true

  it "can determine an opening paren", ->
    expect(parser.isStartParen "(").toBe true

  it "can determine a closing paren", ->
    expect(parser.isClosingParen ")").toBe true


sinon = require 'sinon'
requirejs = require 'requirejs'

requirejs.config {
  baseUrl: 'lib',
  nodeRequire: require
}

lexer = requirejs './lexer'


describe "the lexer", ->
  values = {}

  beforeEach ->
    values =
      true: '#t'
      false: '#f'
      one: '1'
      two: '2'
      string: "'abc'"

  it "can determine booleans", ->
    expect(lexer.isBoolean values.true).toBe true
    expect(lexer.isBoolean values.false).toBe true
    expect(lexer.isBoolean values.one).toBe false

  it "can determine that integers are numbers", ->
    expect(lexer.isNumber values.one).toBe true
    expect(lexer.isNumber values.false).toBe false

  it "can determine addition binary operator", ->
    expect(lexer.isBinaryOperation "+").toBe true

  it "can determine an opening paren", ->
    expect(lexer.isStartParen "(").toBe true

  it "can determine a closing paren", ->
    expect(lexer.isClosingParen ")").toBe true


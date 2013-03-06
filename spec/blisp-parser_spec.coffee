# The parser converts blisp code into AST
requirejs = require 'requirejs'

requirejs.config {
  baseUrl: 'lib',
  nodeRequire: require
}

parser = requirejs './blisp-parser'

describe "the blisp parser", ->
  it "parses list expressions", ->
    blisp = "(+ 2 4)"
    ast = {
        type: "ExpressionStatement",
        expression: {
          type: "List",
          car: {
            type: "Function",
            value: "+"
          },
          cdr: {
            type: "List",
            car: {
              type: "Number",
              value: 8
            },
            cdr: {
              type: "List",
              car: {
                type: "Number",
                value: 16
              },
              cdr: {
                type: "EmptyList"
              } } } } }
    expect(parser.parse blisp).toEqual ast

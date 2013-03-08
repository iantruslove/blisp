requirejs = require 'requirejs'

requirejs.config {
  baseUrl: 'lib',
  nodeRequire: require
}

generator = requirejs './generator'

describe "the abstract syntax tree generator", ->

  describe "for simple literals", ->
    it "generates the tree for a single boolean value", ->
      expect(generator.generate("#t")).toEqual({
        type: "ExpressionStatement",
        expression: {
          type: "Boolean",
          value: "#t"
        }})

    it "generates the tree for a single integer", ->
      expect(generator.generate("4")).toEqual({
        type: "ExpressionStatement",
        expression: {
          type: "Number",
          value: 4
        }})

  describe "for a simple s-exp", ->
    it "parses a simple s-exp", ->
      expect(generator.generate("(+ 12 24)")).toEqual {
        type: "ExpressionStatement",
        expression: {
          type: "List",
          car: {
            type: "Function"
            value: "+"
          },
          cdr: {
            type: "List",
            car: {
              type: "Number"
              value: 12
            },
            cdr: {
              type: "List",
              car: {
                type: "Number"
                value: 24
              },
              cdr: {
                type: "EmptyList" } } } } }

    it "parses a nested s-exp", ->
      expectedAst = {
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
              type: "List",
              car: {
                type: "Function",
                value: "+"
              },
              cdr: {
                type: "List",
                car: {
                  type: "Number",
                  value: 10
                },
                cdr: {
                  type: "List",
                  car: {
                    type: "Number",
                    value: 11
                  },
                  cdr: {
                    type: "EmptyList"
                  }
                }
              }
            },
            cdr: {
              type: "List",
              car: {
                type: "Number",
                value: 24
              },
              cdr: {
                type: "EmptyList"
              }
            }
          }
        }
      }
      actualAst = generator.generate("(+ (+ 10 11) 24)")
      expect(actualAst).toEqual expectedAst

  describe "its recursive list parser", ->
    it "parses a single item list", ->
      expect(generator.parseRestOfList("1)").ast).toEqual {
        type: "List",
        car: {
          type: "Number"
          value: 1
        },
        cdr: {
          type: "EmptyList"
        } }

    it "parses a longer list", ->
      expect(generator.parseRestOfList("+ 2 3)").ast).toEqual {
        type: "List",
        car: {
          type: "Function"
          value: "+"
        },
        cdr: {
          type: "List",
          car: {
            type: "Number"
            value: 2
          },
          cdr: {
            type: "List",
            car: {
              type: "Number"
              value: 3
            },
            cdr: {
              type: "EmptyList" } } } }

    it "parses a nested list", ->
      actualAst = generator.parseRestOfList("1 (2 3))").ast
      expectedAst = {
        type: "List",
        car: {
          type: "Number"
          value: 1
        },
        cdr: {
          type: "List",
          car: {
            type: "List"
            car: {
              type: "Number",
              value: 2
            },
            cdr: {
              type: "List",
              car: {
                type: "Number",
                value: 3
              },
              cdr: {
                type: "EmptyList"
              }
            }
          },
          cdr: {
            type: "EmptyList" } } }
      expect(actualAst).toEqual expectedAst


    it "parses another nested list", ->
      actualAst = generator.parseRestOfList("(1 2) 3)").ast
      expectedAst = {
        type: "List",
        car: {
          type: "List"
          car: {
            type: "Number",
            value: 1
          },
          cdr: {
            type: "List",
            car: {
              type: "Number",
              value: 2
            },
            cdr: {
              type: "EmptyList"
            }
          }
        },
        cdr: {
          type: "List",
          car: {
            type: "Number"
            value: 3
          },
          cdr: {
            type: "EmptyList" } } }
      expect(actualAst).toEqual expectedAst



sinon = require 'sinon'
requirejs = require 'requirejs'

requirejs.config {
  baseUrl: 'lib',
  nodeRequire: require
}

valueConverter = requirejs './ast-converters/value'

describe "basic value converters", ->

  describe "the value converter facade", ->
    it "converts numbers", ->
      expect(valueConverter.convert { type: "Number", value: 12 }).toEqual { type: "Literal", value: 12 }

    it "converts strings", ->
      expect(valueConverter.convert { type: "String", value: "hi" }).toEqual { type: "Literal", value: "hi" }

    it "converts booleans", ->
      expect(valueConverter.convert { type: "Boolean", value: "#f" }).toEqual { type: "Literal", value: false }


  describe "number converter", ->
    it "converts numbers", ->
      blispAst = {
        type: "Number"
        value: 123
      }
      jsAst = {
        type: "Literal"
        value: 123
      }
      expect(valueConverter.convertNumber blispAst).toEqual jsAst

    it "throws an error if the type is incorrect", ->
      expect(-> valueConverter.convertNumber { type: "Boolean"}).toThrow "Incorrect type: expected Number"

    it "throws an error if the value is not a string", ->
      expect(-> valueConverter.convertNumber { type: "Number", value: "2"}).toThrow "Invalid value for Number"

  describe "string converter", ->
    it "converts strings", ->
      blispAst = {
        type: "String"
        value: "str"
      }
      jsAst = {
        type: "Literal"
        value: "str"
      }
      expect(valueConverter.convertString blispAst).toEqual jsAst

    it "throws an error if the type is incorrect", ->
      expect(-> valueConverter.convertString { type: "Boolean"}).toThrow "Incorrect type: expected String"

    it "throws an error if the value is not a string", ->
      expect(-> valueConverter.convertString { type: "String", value: 1234}).toThrow "Invalid value for String"


  describe "boolean converter", ->
    it "converts true boolean values", ->
      blispAst = {
          type: "Boolean",
          value: "#t" }
      jsAst = {
          type: "Literal",
          value: true }
      expect(valueConverter.convertBoolean blispAst).toEqual jsAst

    it "converts false boolean values", ->
      blispAst = {
          type: "Boolean",
          value: "#f" }
      jsAst = {
          type: "Literal",
          value: false }

      expect(valueConverter.convertBoolean blispAst).toEqual jsAst

    it "throws an error if the type is incorrect", ->
      expect(-> valueConverter.convertBoolean { type: "String"}).toThrow "Incorrect type: expected Boolean"

    it "throws an error if the value is not a boolean", ->
      expect(-> valueConverter.convertBoolean { type: "Boolean", value: "true"}).toThrow "Invalid value for Boolean"



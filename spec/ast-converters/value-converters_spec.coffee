sinon = require 'sinon'
requirejs = require 'requirejs'

requirejs.config {
  baseUrl: 'lib',
  nodeRequire: require
}

valueConverters = requirejs './ast-converters/values'

describe "basic value converters", ->

  describe "the value converter facade", ->
    it "converts numbers", ->
      expect(valueConverters.convert { type: "Number", value: 12 }).toEqual { type: "Literal", value: 12 }

    it "converts strings", ->
      expect(valueConverters.convert { type: "String", value: "hi" }).toEqual { type: "Literal", value: "hi" }

    it "converts booleans", ->
      expect(valueConverters.convert { type: "Boolean", value: "#f" }).toEqual { type: "Literal", value: false }


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
      expect(valueConverters.convertNumber blispAst).toEqual jsAst

    it "throws an error if the type is incorrect", ->
      expect(-> valueConverters.convertNumber { type: "Boolean"}).toThrow "Incorrect type: expected Number"

    it "throws an error if the value is not a string", ->
      expect(-> valueConverters.convertNumber { type: "Number", value: "2"}).toThrow "Invalid value for Number"

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
      expect(valueConverters.convertString blispAst).toEqual jsAst

    it "throws an error if the type is incorrect", ->
      expect(-> valueConverters.convertString { type: "Boolean"}).toThrow "Incorrect type: expected String"

    it "throws an error if the value is not a string", ->
      expect(-> valueConverters.convertString { type: "String", value: 1234}).toThrow "Invalid value for String"


  describe "boolean converter", ->
    it "converts true boolean values", ->
      blispAst = {
          type: "Boolean",
          value: "#t" }
      jsAst = {
          type: "Literal",
          value: true }
      expect(valueConverters.convertBoolean blispAst).toEqual jsAst

    it "converts false boolean values", ->
      blispAst = {
          type: "Boolean",
          value: "#f" }
      jsAst = {
          type: "Literal",
          value: false }

      expect(valueConverters.convertBoolean blispAst).toEqual jsAst

    it "throws an error if the type is incorrect", ->
      expect(-> valueConverters.convertBoolean { type: "String"}).toThrow "Incorrect type: expected Boolean"

    it "throws an error if the value is not a boolean", ->
      expect(-> valueConverters.convertBoolean { type: "Boolean", value: "true"}).toThrow "Invalid value for Boolean"



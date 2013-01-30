blisp = require '../lib/blisp.js'

describe "blisp compiler", ->
  it "exposes a module", ->
    expect(blisp).toBeDefined()

  describe "support for types in r6rs", ->
    it "compiles booleans", -> 
      trueBoolean = "#t"
      falseBoolean = "#f"
      expect(blisp.compile(trueBoolean)).toEqual("true")
      expect(blisp.compile(falseBoolean)).toEqual("false")

    it "compiles numbers", ->
      anInteger = "1"
      expect(typeof anInteger).toBe("string")
      expect(blisp.compile(anInteger)).toEqual "1"

    it "compiles strings into strings", ->
      aString = "'abc'"
      expect(blisp.compile(aString)).toEqual "'abc'"


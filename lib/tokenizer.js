define(['./lexer'], function (lexer) {

  var tokenizer = {};

  var Tokenizer = function (code) {
    var matchedTerms;

    this.untokenizedString = code.trimLeft();
    matchedTerms = this.untokenizedString.match(/^(\(|\)|(?:[^\s()]+))(.*)$/);

    this.firstToken = (matchedTerms !== null ? matchedTerms[1] : "");
    this.restOfTokens = (matchedTerms !== null ? matchedTerms[2] : "");

    return this;
  };

  Tokenizer.prototype.first = function () {
    return lexer.createToken(this.firstToken.trimRight());
  };

  Tokenizer.prototype.rest = function () {
    if (this.restOfTokens.trimRight() === "") {
      return null;
    }
    return new Tokenizer(this.restOfTokens);
  };

  Tokenizer.prototype.getCode = function () {
    return this.untokenizedString;
  };

  var createTokenizer = function(code) {
    return new Tokenizer(code);
  };

  tokenizer.Tokenizer = Tokenizer;
  tokenizer.createTokenizer = createTokenizer;
  return tokenizer;

});

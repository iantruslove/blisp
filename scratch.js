var esprima = require('esprima');
var escodegen = require('escodegen');
var expression;

expression = '[1]';
expression = 'parseFloat("123.45",2,3)';
expression = '1+2+3';
ast = esprima.parse(expression);
console.log( JSON.stringify(ast, null, 2));
generatedJs = escodegen.generate(ast);


var blisp = require('./lib/blisp');
blisp.generate("(+ 2 3)");

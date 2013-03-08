# blisp

browser lisp

A browser-based Scheme-ish repl, written in JavaScript.

## Getting Started
Look at this code running live at http://iantruslove.github.com/blisp/

## Documentation

### Supported Expressions

#### Booleans

```
#t
=> true

#f
=> false
```

#### Basic Arithmetic

```
(+ (* 2 3) (- 10 (/ 4 2)))
=> 14
```

#### Functions

```
(parseInt "10" 2)
=> 3
```

## References

* [R6RS](http://www.r6rs.org/) - the Scheme language spec

## Changelog

* 0.0.5
  * Rewrote parsing engine
  * Added parseInt function
* 0.0.4
  * Switched all modules to strict AMD


## License
Copyright (c) 2013 Ian Truslove  
Licensed under the MIT license.

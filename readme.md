# Unit Aware Parser / Calculator

## Goal

I want to type something like

```text
5V * 50mA = _W
```

Hit enter, and get

``` Watt
0.25Watt
```

The initial goal is to support various ohms law calculations and then add to it if it feels necessary, but things have gotten a little bit... algebraic.

## Status

Initially I thought "Ok well I'll just implement a 'little bit' of an algebra system, so I don't have to learn some bloated third party library...".
But it turns out, for even simple use cases like the one described above, a substantial algebra system is required.
This project is a trap, a rabbit-hole with no bottom, a portal to the land of hardcore-computer-science.

Not working yet.

## Abstract syntax representation

```javascript

// Number 
// (second argument must be a literal, no other function accepts literals)
["num", _]

// Addition
// a+b
["add", a, b]

// Negation
["neg", _]

// Multiplication
// a*b
["mul", a, b]

// Exponentiation
// a^b
["pow", a, b]



// Symbol
// (Second argument must be a string literal which is the name of a symbol)
// Symbols with the same name, evaluated in the same context are assumed to represent the same value
["sym", _]
```

### Lisp features under consideration

```javascript

// Equality relationship
// Note this is not assignment, but used to construct a relationship to be solved.
// a = b
["eq", a, b]

// Replacement Rule:
// a can be replaced with b
// b cannot be replaced with a
["re", a, b]

// Unit
// similar to symbol but never allowed to mix.
// special equivalence and replacement rules
// not allowed to exist outside of this structure: [mul [num, _], [unit, _]]
["unit", _]

// Match
// specifies some criteria or constraint... somehow.
// only valid inside replacement rule [re]
["match", ...]
```

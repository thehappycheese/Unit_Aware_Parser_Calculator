# Unit Aware Parser / Calculator

## Goal

I want to type something like

```text
5V * 50mA = _W
```

Hit enter, and get

``` Watt
0.25W
```

The initial goal is to support various ohms law calculations and then add to it if it feels necessary, but things have gotten a little bit... algebraic.

## Status

Initially I thought "Ok well I'll just implement a 'little bit' of an algebra system, so I don't have to learn some bloated third party library...".
But it turns out, for even simple use cases like the one described above, a substantial algebra system is required.
This project is a trap, a rabbit-hole with no bottom, a portal to the land of hardcore-computer-science.

Not working yet.

## Abstract Syntax Tree Language (ASTL)

The Abstract Syntax Tree Language (ASTL) is used internally to represent:

- Mathematical expressions and equations entered by the user
- Replacement rules used by the internal solver

It looks a bit like lisp `["add", ["num", 1], ["num", 2]]` should evaluate to `["num", 3]`

ASTL is designed with the following goals:

- ASTL should use builtin javascript `Array`, `String` and `Number` literal syntax.
  - JavaScript classes are deliberately avoided in favour of writing a functional style library.
  - The hope is that this will lead to a library of deliciously composable functions instead of endless copy pasting of class methods.
- JSON serialisation should be trivial for  ASTL expressions should be trivial to serialisation to JSON
- Forbid variable length function signatures
  - For example  the `[ "add", _, _ ]` function always consists of a list of 3 elements.
- Literals are wrapped in a type function `["num", 5]`.
  - This way all back-end functions in the interpreter can be designed to expect only arrays, where the first element specifies type.
  - This (in theory) avoids the nasty javascript pitfalls regarding type checking.

The term ASTL Fragments or ASTLFrags 

### Basic Functions

The following are the only symbols generated by parsing input

```javascript
// Addition  (a+b)
["add", a, b]

// Negation  (a-b)
["neg", _]

// Multiplication  (a*b)
["mul", a, b]

// Exponentiation  (a^b)
["pow", a, b]

// Number 
// (second argument must be a literal, no other function accepts literals)
["num", _]

// Symbol
// (Second argument must be a string literal which is the name of a symbol)
// Symbols with the same name, evaluated in the same context are assumed to represent the same value
["sym", _]

```

```javascript

// Equality relationship
// Note this is not assignment, but used to construct a relationship to be solved.
// a = b
["eq", a, b]





```

### Features under consideration

```javascript

["match"]

// Replacement Rule:
// a can be replaced with b
// b cannot be replaced with a
["reduce", a, b]

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


### Reduction Orderings


```math
x^2
```
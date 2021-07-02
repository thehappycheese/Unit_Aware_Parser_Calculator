# Unit Aware Parser / Calculator <!-- omit in toc -->

- [1. Goal](#1-goal)
- [2. Status](#2-status)
- [3. Research Notes (Knuth-Bendix Completion Algorithm)](#3-research-notes-knuth-bendix-completion-algorithm)
- [4. Abstract Syntax Tree Language (ASTL)](#4-abstract-syntax-tree-language-astl)
	- [4.1. ASTL Nodes](#41-astl-nodes)
	- [4.2. Rewrite Rule](#42-rewrite-rule)

## 1. Goal

I want to type something like

```text
5V * 50mA = _W
```

Hit enter, and get

``` Watt
0.25W
```

The initial goal is to support various ohms law calculations and then add to it if it feels necessary, but things have gotten a little bit... algebraic.

## 2. Status

Initially I thought "Ok well I'll just implement a 'little bit' of an algebra system, so I don't have to learn some bloated third party library...".
But it turns out, for even simple use cases like the one described above, a substantial algebra system is required.
This project is a trap, a rabbit-hole with no bottom, a portal to the land of hardcore-computer-science.

Not working yet.

## 3. Research Notes (Knuth-Bendix Completion Algorithm)

See my research notes in [readme_extras/](readme_extras/reduction_orderings.md)

## 4. Abstract Syntax Tree Language (ASTL)

The Abstract Syntax Tree Language (ASTL) is used internally to represent:

- Mathematical expressions and equations entered by the user
- Replacement rules used by the internal solver

It looks a bit like lisp `["add", ["num", 1], ["num", 2]]` should evaluate to `["num", 3]`

ASTL is designed with the following goals:

- ASTL statements should be able to be expressed as a javascript or JSON literal.
- Classes are avoided in favour of writing a functional style library.
  - The hope is that this will lead to a library of deliciously composable functions instead of endless copy pasting of class methods and weird inheritance problems
- Forbid variable length function signatures
  - For example  the `["add", _, _]` function always consists of a list of 3 elements.
- Literals are wrapped in a type function `["num", 5]`.
  - This way the interpreter can be designed to expect only arrays, where the first element specifies type.
  - This (in theory) avoids the nasty javascript pitfalls regarding type checking.

### 4.1. ASTL Nodes

| Abstract Syntax |     Input Syntax     |      | Function       | Description                                                 | Use      |
| --------------- | :------------------: | ---- | -------------- | ----------------------------------------------------------- | -------- |
| `["bool",_]`    |   `true` / `false`   | Leaf | Boolean        |                                                             | Internal |
| `["str",_]`     |        `"T"`         | Leaf | String         |                                                             | Internal |
| `["sym",_]`     |         `x`          | Leaf | Symbol         |                                                             |          |
| `["num",_]`     |         `1`          | Leaf | Number         | TODO: should this be positive only?                         |          |
|                 |                      |      |                |                                                             |          |
| `["pow",a,b]`   |         a^b          | Tree | Exponentiation |                                                             |          |
| `["mul",a,b]`   |         a·b          | Tree | Multiplication |                                                             |          |
| `["neg",a]`     |          -a          | Tree | Negation       | No space permitted between - when used as unary operator    |          |
| `["add",a,b]`   |         a+b          | Tree | Addition       |                                                             |          |
|                 |                      |      |                |                                                             |          |
| `["not",a]`     |          ¬a          | Tree | Inversion      | Can only be evaluated to boolean. Solving is not supported. |          |
| `["and",a,b]`   |         a∧b          | Tree | Union          | Can only be evaluated to boolean. Solving is not supported. |          |
| `["or",a,b]`    |         a∨b          | Tree | Disjunction    | Can only be evaluated to boolean. Solving is not supported. |          |
|                 |                      |      |                |                                                             |          |
| `["lt",a,b]`    |        a&lt;b        | Tree | Less Than      | Can only be evaluated to boolean. Solving is not supported. |          |
| `["gt",a,b]`    |        a&gt;b        | Tree | Greater Than   | Can only be evaluated to boolean. Solving is not supported. |          |
| `["eq",a,b]`    |         a=b          | Tree | Equal To       | Can be evaluated to boolean, or used to solve for unknowns. |          |
|                 |                      |      |                |                                                             |          |
| `["rew",a,b]`   |     a &#10230; b     | Tree | Rewrite Rule   | a may be replaced with b                                    |          |
| `["axiom",x,c]` | a &#10230; b where c | Tree | Assert         | x is the `["rew",a,b]` and `c` must evaluate to true                    |          |

### 4.2. Rewrite Rule

Rewrite rules may only be applied when:

- c evaluates to ["bool", true] AND
- when a and b are instantiated `tree_is_less_complex_than(instance_a, instance_b)`
  evaluates to `["bool", false]`<br>
  (ie. the instance of b must be simpler than the instance of a)

# Reduction Orderings

May be used to actually list the orderings used in this software?
For now it is just my research gathered from elsewhere online.

## General Notes

Loosely based on From https://www.youtube.com/watch?v=AP8L3OZxO-k

### Terms

Let $T$ be the set of all valid terms.

Any term can also be regarded as a pattern. For example, given the following terms $t_1$ and $t_2$:

$$
t_1 = x+1 \\
t_2 = y^2 +1
$$

The term $t_1$ matches the term $t_2$ when $x$ is substituted for $y^2$

$$
t_1[x/y^2] = t_2
$$

When used this way, we regard $t_1$ to be the pattern that was successfully matched.

### Complexity Ordering

Let the comparison operator $>_r$ be defined to compare the "complexity" between any two terms.

Complexity of a term can be measured by the number of leaf nodes in a tree:

```javascript
count_leaf(
	["add", 1, ["add", 2, 3]]
);
//  =3
```

When terms have the same apparent complexity the leftmost subtree of each is used to make further comparison:

```javascript
count_leaf(leftmost_subtree(["add", 1, ["add", 2, 3]]));
//  =1

count_leaf(leftmost_subtree(["add", ["add", 1, 2], 3]));
//  =2
```

### Rewrite Rules

Let $R$ be a set of rewrite rules

$$l \to r \in R$$

where
$
\{l,r\} \sub T \\
$

- The application of the rule must maintain equivalence: $$l=r$$
- The right side must be less 'complex' than the left side: $$l >_r r$$

A set of rules is `Noetherian` if it has the following 3 properties:

1. **Well Founded:** In every subset of $T$ there exists just one way to order elements according to complexity (as defined by the $<_r$ operator).
2. **Stable:** $t_a <_r t_b \implies t_a[t_c/x] >_r t_b[t_c/x]$
   - eg: $x+y >_r x \implies (a+b)+y>_r a+b\ \text{where}\ t=a+b$
3. **Monotonic:** $t_a <_r t_b \implies t_c[t_a/x] >_r t_c[t_b/x]$
   - eg: $a+b >_r a \implies (a+b)+1 >_r a+1\ \text{where}\ t=x+1$ 

As a consequence of being Noetherian

- Replacement rules can only happen in the forward direction due to the Well Founded property.
- No new variables will be introduced during a replacement
- Complexity after each rewrite will decrease or remain constant.

## Rewrite Proof vs Non Rewrite Proof

If a proof can occur by applying rewrite terms only in the forward direction, then it is called a 'rewrite proof'.

If a proof requires that rewrite rules are applied in reverse a few times before then appling them forwards again in some different order, then this is said to be a 'Non-Rewrite Proof'. In such a proof, the term of peak complexity is called the 'critical term'. Non-Rewrite proofs are very difficult to write software for.

Therefore the goal is to generate a set of rewrite rules comprehensive enough that it eliminates the need for Non-rewrite proofs.

## Unification of terms

Unification is the process of pattern matching terms;
$$
(0 + a) + -a \leftrightarrow (x + y) + z \quad \implies \quad 0 \leftrightarrow x,\enspace
a\leftrightarrow y,\enspace
-a\leftrightarrow z
$$

## Superposition of Critical Terms

Suppose our set of rewrite rules contains multiple rules where the left hand sides can be 'unified'.

The more general pattern will subsume the other.

$$
t_b\ \text{subsumes}\ t_a \iff t_a = t_b[t_c/x]\\
\text{where}\ t_a >_r t_b >_r t_c
$$

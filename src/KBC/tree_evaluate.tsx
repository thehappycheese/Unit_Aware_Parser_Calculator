import * as Tree from "./tree"


export function tree_evaluate(tree: Tree.TreeOrLeaf): Tree.TreeOrLeaf {
	if (evaluators.hasOwnProperty(tree[0])) {
		return evaluators[tree[0]](tree)
	} else {
		return ["err", `Unable to evaluate tree of type "${tree[0]}"`]
	}

}


function tree_evaluate_binary(tree: Tree.BinaryTree, leaf_type_a: Tree.LeafTypeName, leaf_type_b: Tree.LeafTypeName, lambda: (a: Tree.LeafLiteral, b: Tree.LeafLiteral) => Tree.Leaf): Tree.TreeOrLeaf {
	let a = tree_evaluate(tree[1]);
	let b = tree_evaluate(tree[2]);
	if (Tree.is_leaf_type(a, leaf_type_a) && Tree.is_leaf_type(b, leaf_type_b)) {
		return lambda(a[1], b[1])
	} else {
		return [tree[0], a, b]
	}
}


function tree_evaluate_unary(tree: Tree.UnaryTree, leaf_type: Tree.LeafTypeName, lambda: (a: Tree.LeafLiteral) => Tree.Leaf): Tree.TreeOrLeaf {
	let a = tree_evaluate(tree[1]);
	if (Tree.is_leaf_type(a, leaf_type)) {
		return lambda(a[1])
	} else {
		return [tree[0], a]
	}
}


let evaluators: Record<
	Tree.LeafTypeName | Tree.UnaryTypeName | Tree.BinaryTypeName,
	(tree: Tree.TreeOrLeaf) => Tree.TreeOrLeaf
> = {

	"bool":  tree => Tree.copy(tree),
	"str":   tree => [...tree],
	"err":   tree => [...tree],
	"sym":   tree => [...tree],
	"num":   tree => [...tree],
	"rew":   tree => ["err", "Cannot evaluate an 'rew' tree"],
	"axiom": tree => ["err", "Cannot evaluate an 'axiom' tree"],

	"pow": tree => tree_evaluate_binary(tree as Tree.BinaryTree, "num",	"num",	(a, b) => ["num",	a as number ** (b as number)]),
	"mul": tree => tree_evaluate_binary(tree as Tree.BinaryTree, "num",	"num",	(a, b) => ["num",	a as number *  (b as number)]),
	"neg": tree => tree_evaluate_unary (tree as Tree.UnaryTree,  "num",			(a   ) => ["num",	-a                          ]),
	"add": tree => tree_evaluate_binary(tree as Tree.BinaryTree, "num",	"num",	(a, b) => ["num",	a as number +  (b as number)]),
	"not": tree => tree_evaluate_unary (tree as Tree.UnaryTree,  "bool",		(a   ) => ["bool",	!a     ]),
	"and": tree => tree_evaluate_binary(tree as Tree.BinaryTree, "bool","bool",	(a, b) => ["bool",	a && b ]),
	"or":  tree => tree_evaluate_binary(tree as Tree.BinaryTree, "bool","bool",	(a, b) => ["bool",	a || b ]),
	"lt":  tree => tree_evaluate_binary(tree as Tree.BinaryTree, "num",	"num",	(a, b) => ["bool",	a < b  ]),
	"gt":  tree => tree_evaluate_binary(tree as Tree.BinaryTree, "num",	"num",	(a, b) => ["bool",	a > b  ]),
	"eq":  tree => tree_evaluate_binary(tree as Tree.BinaryTree, "num",	"num",	(a, b) => ["bool",	a === b]),

}
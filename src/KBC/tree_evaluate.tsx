export {}
// function tree_evaluate(tree){
// 	if(evaluators.hasOwnProperty(tree[0])){
// 		return evaluators[tree[0]](tree)
// 	}else{
// 		return ["err", `Unable to evaluate tree of type "${tree[0]}"`]
// 	}
	
// }

// function tree_evaluate_binary_match(tree, lambdas){
// 	let a = tree_evaluate(tree[1]);
// 	let b = tree_evaluate(tree[2]);
// 	for(let [leaf_type_a, leaf_type_b, lambda] of lambdas){
// 		if(tree_type(a)==leaf_type_a && tree_type(b)==leaf_type_b){
// 			return lambda(a[1], b[1])
// 		}
// 	}
// 	return [tree_type(tree), a, b]
// }

// function tree_evaluate_binary(tree, leaf_type_a, leaf_type_b, lambda){
// 	let a = tree_evaluate(tree[1]);
// 	let b = tree_evaluate(tree[2]);
// 	if(tree_type(a)==leaf_type_a && tree_type(b)==leaf_type_b){
// 		return lambda(a[1], b[1])
// 	}else{
// 		return [tree_type(tree), a, b]
// 	}
// }
// function tree_evaluate_unary(tree, leaf_type_a, lambda){
// 	let a = tree_evaluate(tree[1]);
// 	if(a[0]==leaf_type_a){
// 		return lambda(a[1])
// 	}else{
// 		return [tree_type(tree), a]
// 	}
// }

// let evaluators = {
// 	// leaf nodes
// 	"nux":	tree	=> [...tree],
// 	"bool":	tree	=> [...tree],
// 	"str":	tree	=> [...tree],
// 	"sym":	tree	=> [...tree],
// 	"num":	tree	=> [...tree],

// 	"pow":	tree	=> tree_evaluate_binary(tree, "num",	"num",	(a,b)	=> ["num",	a**b	]),
// 	"mul":	tree 	=> tree_evaluate_binary(tree, "num",	"num",	(a,b)	=> ["num",	a*b		]),
// 	"neg":	tree	=> tree_evaluate_unary (tree, "num",	"num",	(a)		=> ["num",	-a		]),
// 	"add":	tree	=> tree_evaluate_binary(tree, "num",	"num",	(a,b)	=> ["num",	a+b		]),
// 	"not":	tree	=> tree_evaluate_unary (tree, "bool",	"bool",	(a)		=> ["bool",	!a		]),
// 	"and":	tree	=> tree_evaluate_binary(tree, "bool",	"bool",	(a,b)	=> ["bool",	a&&b	]),
// 	"or":	tree	=> tree_evaluate_binary(tree, "bool",	"bool",	(a,b)	=> ["bool",	a||b	]),
// 	"lt":	tree	=> tree_evaluate_binary(tree, "num",	"num",	(a,b)	=> ["bool",	a<b		]),
// 	"gt":	tree	=> tree_evaluate_binary(tree, "num",	"num",	(a,b)	=> ["bool",	a>b		]),
// 	"eq":	tree	=> tree_evaluate_binary(tree, "num",	"num",	(a,b)	=> ["bool",	a===b	]),

// }
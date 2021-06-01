let example = ["mul", ["add",["num",10],["num",15]], ["mul",["num", 2],["sym", "m"]]]

let replacement_rules = [
	[
		// A*(B*C) => (A*B)*C
		["mul",["sym","A"],["mul",["sym","B"],["sym","C"]]],
		["mul",["mul",["sym","A"],["sym","B"]],["sym","C"]]
	],
	[
		// A*B => B*A
		["mul",["sym","A"],["sym","B"]],
		["mul",["sym","B"],["sym","A"]]
	],
	[   // A<num> + B<num> => num_sum(A,B)
		["add",["", ["num", ["sym","A"]],["num", ["sym","B"]]],
		["call","num_add",[["sym","B"],["sym","A"]]]
	],
	[   // A<num> * B<num> => num_mul(A,B)
		["mul",["num", ["sym","A"]],["num", ["sym","B"]]],
		["call","num_mul",[["sym","A"],["sym","B"]]]]
	]
];

apply_rules(replacement_rules, example);

// apply each replacement rule to each match
// if a replacement returns an executable function, execute it immediately
// compare result with history.
// If returned to previous state mark step as dead and add to candidates for final answer
// prioritise searching matches that happened shallower
// prioritise searching matches that reduce total number of parentheses
// prioritise searching matches that reduce maximum function depth
// prioritise searching matches based on hard-coded rule priority (???)


function apply_rules(expression, rules){
	let queue = [];
	for(let [rule, replacement] of rules){
		let matches = match(rule, expression);
	}
}


function match(rule, expression){
	for(let sub_expression of walk(expression)){
		let [expr_type, ...expr_args] = sub_expression;
		let [rule_type, ...rule_args] = rule;
		
		if(rule_type==="sym"){
			return expression;
		}else if (rule_type===expr_type){
			let submatches = expr_args.map((item, index)=>match(rule_args[index], item))
			if(submatches.every(item=>item)){
				return expression;
			}else{
				return false;
			}
		}else{
			return false;
		}
	}
}

function tree_copy(tree){
}

function tree_index(tree, index_list){
	let result = tree;
	for (index of index_list){
		result = result[index]
	}
	return result;
}

function * tree_walk_index(tree, indexes){
	let subtree = tree_index(tree,indexes)
	if(!Array.isArray(subtree)){
		return;
	}
	yield indexes;
	for(let subtree_index = 1; subtree_index < subtree.length; subtree_index++){
		for(let sub_indexes of tree_walk_index(tree, [...indexes, subtree_index])){
		    yield sub_indexes
		}
	}
}
function * tree_walk(tree, indexes){
	if(!Array.isArray(tree)){
		return;
	}
	yield [tree, indexes];
	for(let subtree_index = 1; subtree_index < tree.length; subtree_index++){
		let subtree = tree[subtree_index];
		for(let [sub_sub_tree, sub_indexes] of tree_walk(subtree, [...indexes, subtree_index])){
		    yield [sub_sub_tree, sub_indexes];
		}
	}
}

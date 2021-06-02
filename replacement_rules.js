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

//apply_rules(replacement_rules, example);

// apply each replacement rule to each match
// if a replacement returns an executable function, execute it immediately
// compare result with history.
// If returned to previous state mark step as dead and add to candidates for final answer
// prioritise searching matches that happened shallower
// prioritise searching matches that reduce total number of parentheses
// prioritise searching matches that reduce maximum function depth
// prioritise searching matches based on hard-coded rule priority (???)


function copy(item){
	if(!Array.isArray(item)){
		return item;
	}
	let result = []
	for(let sub_item of item){
		result.push(copy(sub_item))
	}
	return result;
}



function apply_rules(expression, rules){
	for(let [expr, expr_index] of tree_walk(expression)){
		let [expr_type, ...expr_args] = expr;	
		for(let [rule_index, rule] of enumerate(rules)){
			let [rule_type, ...rule_args] = rule;
		}
	}
}


function * matches(rules, expression){
	for(let [expr, expr_index] of tree_walk(expression)){
		let [expr_type, ...expr_args] = expr;
		
		
		for(let [rule_index, rule] of enumerate(rules)){
			let [rule_type, ...rule_args] = rule;
			if(rule_type==="sym"){
				yield [rule, ["sym", expr]];
				continue;
			}else if (rule_type===expr_type){

				

				let submatches = expr_args.map((item, index)=>match(rule_args[index], item))
				if(submatches.every(item=>item)){
					return expr;
				}else{
					return false;
				}
			}
		}
	}
}

function match(rule, expression, symbols=[]){
	if(!Array.isArray(rule)){
		if(!Array.isArray(expression)){
			return rule===expression;
		}
		return false;
	}
	let [rule_type, ...rule_args] = rule;
	if(!Array.isArray(expression)){
		if(rule_type==="sym"){
			return ["eq", ["sym", rule[1]], expression];
		}
	}
	
	let [expr_type, ...expr_args] = expression;
	if(rule_type==="sym"){
		// TODO: can only be allowed if that symbol was not already assigned to a non-matching expression??
		return ["eq", ["sym", rule[1]], expression];
	}else if(rule_type===expr_type){
		let result = [];
		for(let pair of zip(rule_args, expr_args)){
			let sub_result = match(...pair)
			if(!sub_result) return false;
			result.push(sub_result);
		}
		return result;
	}
	return false;
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

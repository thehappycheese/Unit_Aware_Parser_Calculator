let example = ["mul", ["add",["num",10],["num",15]], ["mul",["num", 2],["sym", "m"]]]

let replacement_rules = [
	"rules",
	[
		// 0*A => 0
		"reduce",
		["mul",["num",0],["sym","A"]],
		["num",0]
	],
	[
		// --A => A
		"reduce",
		["neg",["neg",["sym","A"]]],
		["sym","A"]
	],
	[
		// 1*A => A
		"reduce",
		["mul",["num",1],["sym","A"]],
		["sym","A"]
	],
	[
		// A*(B*C) => (A*B)*C
		"reduce",
		["mul",["sym","A"],["mul",["sym","B"],["sym","C"]]],
		["mul",["sym","B"],["mul",["sym","A"],["sym","C"]]],
	],
	[
		// A*B => B*A
		"reduce",
		["mul",["sym","A"],["sym","B"]],
		["mul",["sym","B"],["sym","A"]]
	],
	[
		// A+B => B+A
		"reduce",
		["add",["sym","A"],["sym","B"]],
		["add",["sym","B"],["sym","A"]]
	],
	[
		// A+(B+C) => (A+B)+C
		"reduce",
		["mul",["sym","A"],["mul",["sym","B"],["sym","C"]]],
		["mul",["sym","B"],["mul",["sym","A"],["sym","C"]]],
	],
	[
		// A+(B+C) => (A+B)+C
		"reduce",
		["mul",["sym","A"],["mul",["sym","B"],["sym","C"]]],
		["mul",["sym","B"],["mul",["sym","A"],["sym","C"]]],
	],

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






function apply_rules(expression, rules){
	for(let [expr, expr_index] of tree_walk(expression)){
		let [expr_type, ...expr_args] = expr;	
		for(let [rule_index, rule] of enumerate(rules)){
			let [rule_type, ...rule_args] = rule;
		}
	}
}


function * matches(rules, expression){
	for(let [[expr_type, ...expr_args], expr_index] of tree_walk(expression)){
		for(let [rule_index, [rule_type, ...rule_args]] of enumerate(rules)){
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


function * tree_walk(tree, indexes=[]){
	if(!Array.isArray(tree)){
		return;
	}
	yield ["tree_location", ["tree_index", ...indexes], tree ];
	for(let subtree_index = 1; subtree_index < tree.length; subtree_index++){
		for(let item of tree_walk(tree[subtree_index], [...indexes, subtree_index])){
			yield item;
		}
	}
}


function measure_complexity(term){

}
function unify_terms(term1,term2){

}
function normalise_term(term){

}

function knuth_bendix_completion(axioms){
	let rewrite_rules = [];

	return rewrite_rules;
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



	if(tree_is_leaf(rule)){
		if(tree_is_leaf(expression)){
			return [rule===expression, symbols] ;
		}
		return [false, symbols];
	}

	let [rule_type, ...rule_args] = rule;

	if(tree_is_leaf(expression)){
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




/// returns [matched:bool, [symbol_values_to_be_compared:["eq",["sym",_],_]]]
function match2(rule, expression){
	// do not allow to recurse to last nodes.
	let [rule_type, ...rule_args] = rule;
	let [expr_type, ...expr_args] = expression;

	if(rule_type==="sym"){
		return [true, [["eq", ["sym", rule[1]], expression]]];

	}else if(rule_type==="num" && expr_type==="num"){
			return [rule_args[0]===expr_args[0], []]
	}else if(rule_type===expr_type){
		if(rule_args.length!=expr_args.length){
			return [false,[]]
		}
		let symbols = [];
		for(let pair of zip(rule_args, expr_args)){
			let [success, match_symbols] = match2(...pair)
			if(!success) return [false, []];
			symbols.push(...match_symbols);
		}
		return [true, symbols];
		// TODO: Confirm that symbols agree with each other!
	}
	return [false, []];
}
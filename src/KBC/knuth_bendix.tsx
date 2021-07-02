export {}

// export function measure_complexity(term) {

// }
// function unify_terms(term1, term2) {

// }
// function normalise_term(term) {

// }

// function knuth_bendix_completion(axioms) {
// 	let rewrite_rules = [];

// 	return rewrite_rules;
// }



// function apply_rules(expression, rules) {
// 	//
// }


// function* matches(rules, expression) {
// 	for (let [[expr_type, ...expr_args], expr_index] of tree_walk_left(expression)) {
// 		for (let [rule_index, [rule_type, ...rule_args]] of enumerate(rules)) {
// 			if (rule_type === "sym") {
// 				yield [rule, ["sym", expr]];
// 				continue;
// 			} else if (rule_type === expr_type) {
// 				let submatches = expr_args.map((item, index) => match_anywhere(rule_args[index], item))
// 				if (submatches.every(item => item)) {
// 					return expr;
// 				} else {
// 					return false;
// 				}
// 			}
// 		}
// 	}
// }

// function match_anywhere(rule, expression) {
// 	for (let [indexes, sub_expression] of tree_walk_left(expression)) {
// 		let [match_success, match_symbols] = match(rule, sub_expression)
// 		if (match_success) {
// 			return [match_success, match_symbols]
// 		}
// 	}
// 	return [false, []]
// }




// /// returns [matched:bool, [symbol_values_to_be_compared:["eq",["sym",_],_]]]
// function match(rule, expression) {
// 	// do not allow to recurse to last nodes.
// 	let [rule_type, ...rule_args] = rule;
// 	let [expr_type, ...expr_args] = expression;

// 	if (rule_type === "sym") {
// 		return [true, [["eq", ["sym", rule[1]], expression]]];

// 	} else if (rule_type === "num" && expr_type === "num") {
// 		return [rule_args[0] === expr_args[0], []]
// 	} else if (rule_type === expr_type) {
// 		if (rule_args.length != expr_args.length) {
// 			return [false, []]
// 		}
// 		let symbols = [];
// 		for (let pair of zip(rule_args, expr_args)) {
// 			let [match_success, match_symbols] = match(...pair)
// 			if (!match_success) return [false, []];
// 			symbols.push(...match_symbols);
// 		}
// 		return [true, symbols];
// 		// TODO: Confirm that symbols agree with each other!
// 	}
// 	return [false, []];
// }

// function structurally_equal(tree_a, tree_b) {
// 	let [type_a, ...args_a] = tree_a;
// 	let [type_b, ...args_b] = tree_b;
// 	if (type_a === type_b) {
// 		if (args_a.length != args_b.length) return false;
// 		for (let pair of zip(args_a, args_b)) {
// 			if (!structurally_equal(...pair)) return false;
// 		}
// 		return true;
// 	}
// 	return false;
// }
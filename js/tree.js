
function tree_type(tree){
	return tree[0];
}

function tree_same_type(tree_a, tree_b){
	return tree_a[0]===tree_b[0]
}
function tree_is_leaf(tree) {
	return !Array.isArray(tree);
}

function tree_is_not_leaf(tree) {
	return Array.isArray(tree);
}

function tree_copy(item) {
	if (tree_is_leaf(item)) {
		return item;
	}
	let result = []
	for (let sub_item of item) {
		result.push(tree_copy(sub_item))
	}
	return result;
}

function tree_max_depth(tree, depth = 0) {
	if (tree_is_leaf(tree)) return depth;
	let [head, ...tail] = tree;
	return tail.reduce((deepest_so_far, subtree) =>
		Math.max(deepest_so_far, tree_max_depth(subtree, depth + 1)), depth);
}

function tree_count(tree) {
	if (tree_is_leaf(tree)) return 1;
	let [head, ...tail] = tree;
	return tail.reduce(
		(count, subtree) => count + tree_count(subtree),
		0
	);
}

function tree_complexity(tree) {
	if (tree_is_leaf(tree) || (tree.length == 2 && tree_is_leaf(tree[1]))) return [1];
	let [head, ...tail] = tree;
	let tail_results = tail.map(tree_complexity);
	sum = tail_results.reduce((acc, cur) => acc + cur[0], 0)
	return [sum, ...tail_results.flat()]
}

function tree_is_less_complex_than(tree_a, tree_b) {
	let complexity_a = tree_complexity(tree_a);
	let complexity_b = tree_complexity(tree_b);
	if (complexity_a.length != complexity_b.length) {
		return complexity_a.length < complexity_b.length;
	}
	for (let [a, b] of zip(complexity_a, complexity_b)) {
		if (a < b) return true;
	}
	return false;
}

// TODO: rename... this is like the pandas .loc() function. maybe tree_loc() ?
function tree_lookup(tree, index_list) {
	let result = tree;
	for (index of index_list) {
		result = result[index]
	}
	return result;
}

/** Top first then recurse left
 */
function* tree_walk_left(tree, indexes = []) {
	if (tree_is_leaf(tree)) {
		return;
	}
	yield [indexes, tree];
	for (let subtree_index = 1; subtree_index < tree.length; subtree_index++) {
		for (let item of tree_walk_left(tree[subtree_index], [...indexes, subtree_index])) {
			yield item;
		}
	}
}



function tree_print(tree, pretty = true, depth = 0) {
	let space = `<div style="display:inline-block;width:${depth * 20}px;height:1em;border-bottom:1px dotted #555;">${new Array(depth * 4).fill("&nbsp;").join("")}</div>`;
	if (Array.isArray(tree)) {
		let [head, ...tail] = tree;


		switch (head) {
			case "num":
				return space + `<span class="fnum">${tail[0]}</span>`;
			case "sym":
				return space + `<span class="fsym">${tail[0]}</span>`;
			case "str":
				return space + `<span class="fstr">${tail[0]}</span>`;
			default:

				if (tree_count(tree) < 4 && typeof head == "string") {
					// inline recursion
					return space + `[<span class="fname">${head}</span> ${tail.map((item) => tree_print(item, pretty, 0)).join(" ")}]`;
				} else {
					// indented recursion
					if (typeof head == "string")
						return space + `[<span class="fname">${head}</span><br>${tail.map(item => tree_print(item, pretty, depth + 1)).join("<br>")}<br>${space}]`;
					return space + `[<br>${tree.map(item => tree_print(item, pretty, depth + 1)).join("<br>")}<br>${space}]`;
				}
		}


	} else {
		return space + (tree?.toString() ?? '<span class="print_tree_error">print_tree error</span>');
	}
}

function tree_is_leaf(tree){
	return !Array.isArray(tree);
}

function tree_is_not_leaf(tree){
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

function tree_max_depth(tree, depth=0){
	if(tree_is_leaf(tree)) return depth;
	let [head, ...tail] = tree;
	return tail.reduce((deepest_so_far, subtree) =>
		Math.max(deepest_so_far, tree_max_depth(subtree, depth+1))
	, depth);
}

function tree_count(tree){
	if(tree_is_leaf(tree)) return 1;
	let [head, ...tail] = tree;
	return tail.reduce(
		(count, subtree) => count + tree_count(subtree),
		0
	);
}

function tree_complexity(tree){
	if(tree_is_leaf(tree)) return [1];
	let [head, ...tail] = tree;
	let tail_results = tail.map(tree_complexity);
	sum = tail_results.reduce((acc,cur)=>acc+cur[0], 0)
	return [sum,...tail_results.flat()]
}

// TODO: rename... this is like the pandas .loc() function. maybe tree_loc() ?
function tree_lookup(tree, index_list){
	let result = tree;
	for (index of index_list){
		result = result[index]
	}
	return result;
}


function * tree_walk(tree, indexes=[]){
	if(tree_is_leaf(tree)){
		return;
	}
	yield ["tree_location", ["tree_index", ...indexes], tree ];
	for(let subtree_index = 1; subtree_index < tree.length; subtree_index++){
		for(let item of tree_walk(tree[subtree_index], [...indexes, subtree_index])){
			yield item;
		}
	}
}



function tree_print(tree, pretty = true, depth = 0) {
	let space = `<div style="display:inline-block;width:${depth * 20}px;height:1em;border-bottom:1px dotted #555;">${new Array(depth*4).fill("&nbsp;").join("")}</div>`;
	if (Array.isArray(tree)) {
		let [head, ...tail] = tree;

		
		switch(head){
			case "num":
				return space + `<span class="fnum">${tail[0]}</span>`;
			case "sym":
				return space + `<span class="fsym">${tail[0]}</span>`;
			case "str":
				return space + `<span class="fstr">${tail[0]}</span>`;
			default:
				
				if(tree_count(tree)<4 && typeof head =="string"){
					// inline recursion
					return space + `[<span class="fname">${head}</span> ${tail.map((item) => tree_print(item, pretty, 0)).join(" ")}]`;
				}else{
					// indented recursion
					if(typeof head =="string")
						return space + `[<span class="fname">${head}</span><br>${tail.map(item => tree_print(item, pretty, depth + 1)).join("<br>")}<br>${space}]`;
					return space + `[<br>${tree.map(item => tree_print(item, pretty, depth + 1)).join("<br>")}<br>${space}]`;
				}
		}

		
	} else {
		return space + (tree?.toString() ?? '<span class="print_tree_error">print_tree error</span>');
	}
}

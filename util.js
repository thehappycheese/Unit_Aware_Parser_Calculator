

// function head(item) {
// 	return item[0];
// }

// function tail(item) {
// 	return item.slice(1);
// }

function* enumerate(arr) {
	let cnt = 0;
	for (let item of arr) {
		yield [cnt, item];
		cnt++;
	}
}

function tree_copy(item) {
	if (!Array.isArray(item)) {
		return item;
	}
	let result = []
	for (let sub_item of item) {
		result.push(tree_copy(sub_item))
	}
	return result;
}

function* zip(arr1, arr2) {
	for (let i = 0; i < Math.min(arr1.length, arr2.length); i++) {
		yield [arr1[i], arr2[i]];
	}
}

function partition(arr, predicate) {
	let result_true = [];
	let result_false = [];
	for (let item of arr) {
		if (predicate(item)) {
			result_true.push(item);
		} else {
			result_false.push(item);
		}
	}
	return [result_true, result_false];
}



let printers = {
	"num":()=>`<span class="fnum">${tail[0]}</span>`,
	"sym":()=>`<span class="fsym">${tail[0]}</span>`,
	"default":()=>`<span class="fsym">${tail[0]}</span>`,
};

function print_tree(tree, pretty = true, depth = 0) {
	let space = `<div style="display:inline-block;width:${depth * 20}px;height:1em;border-bottom:1px dotted #555;">${new Array(depth).fill("&#9;").join("")}</div>`;
	if (Array.isArray(tree)) {
		let [head, ...tail] = tree;
		switch(head){
			case "num":
				return space + `<span class="fnum">${tail[0]}</span>`;
			case "sym":
				return space + `<span class="fsym">${tail[0]}</span>`;
			default:
				if(tree_count(tree)<4){
					// inline recursion
					return space + `[<span class="fname">${head}</span> ${tail.map((item) => print_tree(item, pretty, 0)).join(" ")}]`;	
				}else{
					// indented recursion
					return space + `[<span class="fname">${head}</span><br>${tail.map(item => print_tree(item, pretty, depth + 1)).join("<br>")}<br>${space}]`;
				}
		}
	} else {
		return space + (tree?.toString() ?? '<span class="print_tree_error">print_tree error</span>');
	}
}

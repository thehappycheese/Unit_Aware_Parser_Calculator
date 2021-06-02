function head(item){
	return item[0];
}

function tail(item){
	return item.slice(1);
}

function * enumerate(arr){
	let cnt = 0;
	for(let item of arr){
		yield [cnt, item];
		cnt++;
	}
}

function * zip(arr1, arr2){
	for(let i=0;i<Math.min(arr1.length, arr2.length);i++){
		yield [arr1[i],arr2[i]];
	}
}

function partition(arr, predicate){
	let result_true = [];
	let result_false = [];
	for(let item of arr){
		if(predicate(item)){
			result_true.push(item);
		}else{
			result_false.push(item);
		}
	}
	return [result_true, result_false];
}

function print_tree(tree, depth=0){
	let space = `<div style="display:inline-block;width:${depth*20}px;height:1em;border-bottom:1px solid grey;"></div>`;
	if(Array.isArray(tree)){
		if(tree.every(item=>!Array.isArray(item))){
			return space + `[<span class="fname">${head(tree)}</span> ${tail(tree).join(" ")}]`
		}else{
			return space + `[<span class="fname">${head(tree)}</span><br>${tail(tree).map(item=>print_tree(item,depth+1)).join("<br>")}<br>${space}]`;
		}
	}else{
		return tree.toString();
	}
}
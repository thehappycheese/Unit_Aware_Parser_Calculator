let F = {
	head:(item)=>{
		return item[0];
	},
	tail:(item)=>{
		return item.slice(1);
	}
}

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
	let space = `<div style="display:inline-block;width:${depth*20}px;height:1em;border-bottom:1px solid grey;">${new Array(depth*4).fill("&nbsp;").join("")}</div>`;
	if(Array.isArray(tree)){
		let [head, ...tail]=tree;
		if(head==="num"){
			return space + `<span class="fnum">${tail[0]}</span>`
		}else if(tail.every(item=>Array.isArray(item) && item[0]==="num")){
			return space + `[<span class="fname">${head}</span> ${tail.map(([,val])=>`<span class="fnum">${val}</span>`).join(" ")}]`;
		}else if(tail.every(item => !Array.isArray(item))){
			return space + `[<span class="fname">${head}</span> ${tail.join(" ")}]`
		}else{
			return space + `[<span class="fname">${head}</span><br>${tail.map(item=>print_tree(item,depth+1)).join("<br>")}<br>${space}]`;
		}
	}else{
		return tree.toString();
	}
}

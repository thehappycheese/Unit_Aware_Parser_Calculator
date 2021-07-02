import * as iter from './iter'
import * as util from './util'
import './Tree.css';

export type TreeValue = number|string|boolean;
export type Tree = BinaryFunction | UnaryFunction;
// export type BinaryTree = [string, Tree|Leaf, Tree|Leaf] 
// export type UnaryTree = [string, Tree|Leaf] 
// export type Leaf = [string, TreeValue]
//export type Tree = [string, Tree | TreeValue] 
//export type Tree = [string, Tree] 


let class_names:Record<string, string> = {
	num:'Tree-Num',
	sym:'Tree-Sym',
	str:'Tree-Str',
	bool:'Tree-Bool',
	
	not:'Tree-Una',
	neg:'Tree-Una',
	err:'Tree-Err',

	pow:'Tree-Bin',
	mul:'Tree-Bin',
	add:'Tree-Bin',
	and:'Tree-Bin',
	or:'Tree-Bin',
	lt:'Tree-Bin',
	gt:'Tree-Bin',
	eq:'Tree-Bin',
	req:'Tree-Rew',

	default:'Tree-Unk'
}

interface Treeish{
	walk_pre_order(indices?:number[]):Generator<[Tree|Leaf, number[]],void,undefined>;
	walk_in_order(indices?:number[]):Generator<[Tree|Leaf, number[]],void,undefined>;
	walk_post_order(indices?:number[]):Generator<[Tree|Leaf, number[]],void,undefined>;
	walk_top_down(indices?:number[]):Generator<[Tree|Leaf, number[]],void,undefined>;
	copy():Treeish;
	count():number;
	print_JSX():JSX.Element;
}

class Leaf implements Treeish{
	type;
	value;
	constructor(leaf_type:string, value:TreeValue){
		this.type = leaf_type
		this.value = value;
	}
	*walk_pre_order(indices:number[] = []):Generator<[Tree|Leaf, number[]],void,undefined>{
		yield [this,indices];
	};
	*walk_in_order(indices:number[] = []):Generator<[Tree|Leaf, number[]],void,undefined>{
		yield [this,indices];
	};
	*walk_post_order(indices:number[] = []):Generator<[Tree|Leaf, number[]],void,undefined>{
		yield [this,indices];
	};
	*walk_top_down(indices:number[] = []):Generator<[Tree|Leaf, number[]],void,undefined>{
		yield [this, indices];
	}
	copy():Leaf{
		return new Leaf(this.type, this.value);
	}
	count():number{
		return 1;
	}
	print_JSX():JSX.Element{
		return (
			<div className={class_names[this.type] ?? class_names.default}>{this.value}</div>
		);
	}
}

class UnaryFunction implements Treeish{
	type;
	left;
	constructor(tree_type:string, left:Tree|Leaf){
		this.type = tree_type
		this.left = left;
	}
	*walk_pre_order(indices:number[] = []):Generator<[Tree|Leaf, number[]],void,undefined>{
		yield [this,indices];
		yield * this.left.walk_pre_order();
	};
	*walk_in_order(indices:number[] = []):Generator<[Tree|Leaf, number[]],void,undefined>{
		yield * this.left.walk_in_order();
		yield [this,indices];
	};
	*walk_post_order(indices:number[] = []):Generator<[Tree|Leaf, number[]],void,undefined>{
		yield * this.left.walk_post_order();
		yield [this,indices];
	};
	*walk_top_down(indices:number[] = []):Generator<[Tree|Leaf, number[]],void,undefined>{
		yield [this, indices];
		yield * this.left.walk_top_down([...indices,0]);
	}
	copy():UnaryFunction{
		return new UnaryFunction(this.type, this.left.copy());
	}
	count():number{
		return this.left.count()
	}
}

class BinaryFunction implements Treeish{
	type;
	left;
	right;
	constructor(tree_type:string, left:Tree|Leaf, right:Tree|Leaf){
		this.type = tree_type
		this.left = left;
		this.right = right;
	}
	*walk_pre_order(indices:number[] = []):Generator<[Tree|Leaf, number[]], void ,undefined>{
		yield [this, indices];
		yield * this.left.walk_pre_order([...indices,0])
		yield * this.right.walk_pre_order([...indices,1])
	}
	*walk_in_order(indices:number[] = []):Generator<[Tree|Leaf, number[]], void,undefined>{
		yield * this.left.walk_in_order()
		yield [this, indices];
		yield * this.right.walk_in_order()
	}
	*walk_post_order(indices:number[] = []):Generator<[Tree|Leaf, number[]],void,undefined>{
		yield * this.left.walk_post_order()
		yield * this.right.walk_post_order()
		yield [this, indices];
	}
	*walk_top_down(indices:number[] = []):Generator<[Tree|Leaf, number[]],void,undefined>{
		yield [this, indices];
		let a = this.left.walk_top_down([...indices,0]);
		let b = this.right.walk_top_down([...indices,1]);
		let z = iter.zip_undefined(a,b);
		for(let pair of z){
			for(let item of pair){
				if (item!==undefined){
					yield item
				}
			}
		}
	}
	copy():BinaryFunction{
		return new BinaryFunction(this.type, this.left.copy(), this.right.copy());
	}
	count():number{
		return this.left.count()+this.right.count();
	}
}

export function build_from_parser_output(tree:any):Tree|Leaf{
	switch(tree.length){
		case 3:
			if (Array.isArray(tree[1]) && Array.isArray(tree[2])){
				return new BinaryFunction(tree[0], build_from_parser_output(tree[1]), build_from_parser_output(tree[2]))
			}else{
				throw new Error("Tree build error. Binary trees nodes may not contain literals.")
			}
		case 2:
			if (Array.isArray(tree[1])){
				return new UnaryFunction(tree[0], build_from_parser_output(tree[1]))
			}else {
				return new Leaf(tree[0], tree[1])
			}
		default:
			throw new Error("Tree build error - Unrecognised parser output.")

	}
}


export type LaxTree = any[];

function tree_type(tree:LaxTree){
	return tree[0];
}

function tree_tail(tree:LaxTree){
	return tree.slice(1);
}
function tree_same_type(tree_a:LaxTree, tree_b:LaxTree){
	return tree_a[0]===tree_b[0]
}
function tree_is_leaf(tree:LaxTree) {
	return tree.length==2 && !Array.isArray(tree[1]);
}



function tree_max_depth(tree:LaxTree, depth = 0):number {
	if (tree_is_leaf(tree)) return depth;
	return tree_tail(tree).reduce((deepest_so_far, subtree) =>Math.max(deepest_so_far, tree_max_depth(subtree, depth + 1)), depth);
}

function tree_count(tree:LaxTree):number {
	if (tree_is_leaf(tree)) return 1;
	let [head, ...tail] = tree;
	return tail.reduce(
		(count, subtree) => count + tree_count(subtree),
		0
	);
}


function tree_complexity(tree:LaxTree):Array<number> {
	if (tree_is_leaf(tree)) return [1];
	let tail_results = tree_tail(tree).map(tree_complexity);
	let sum = tail_results.reduce((acc, cur) => acc + cur[0], 0)
	return [sum, ...tail_results.flat()]
}

function tree_is_less_complex_than(tree_a:LaxTree, tree_b:LaxTree) {
	let complexity_a = tree_complexity(tree_a);
	let complexity_b = tree_complexity(tree_b);
	if (complexity_a.length != complexity_b.length) {
		return complexity_a.length < complexity_b.length;
	}
	for (let [a, b] of iter.zip(complexity_a, complexity_b)) {
		if (a < b) return true;
	}
	return false;
}




export function tree_print(tree:Tree|boolean|number|string, pretty = true, depth = 0):string {
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

export function tree_print_JSX(tree:LaxTree|boolean|number|string, inline=false):JSX.Element {
	
	if (Array.isArray(tree)) {
		let [head, ...tail] = tree;
		if(tree_is_leaf(tree)){
			switch (head) {
				case "num":
					return <div style={{display:inline?"inline-block":""}} className="Tree-Num">{tail[0]}</div>;
				case "sym":
					return <div style={{display:inline?"inline-block":""}} className="Tree-Symbol">{tail[0]}</div>;
				case "str":
					return <div style={{display:inline?"inline-block":""}} className="Tree-String">"{tail[0]}"</div>;
				default:
					return <div style={{display:inline?"inline-block":""}} className="Tree-Leaf" title={`unknown leaf type: ${head}`}>{tail[0].toString()}</div>;
			}
		}else{
			if (inline) {
				// inline recursion
				return (
					<div className="Tree-Non-Indent">
						[
						<span className="Tree-Function-Name"> {head} </span>
						{util.intersperse(tail.map(item => tree_print_JSX(item, inline))," ")}{" "}
						] 
					</div>
				);
			} else {
				// indented recursion
				let go_inline = inline || tree_max_depth(tree)<5;
				return (
					<div>
						<div>[<span className="Tree-Function-Name">{head}</span></div>
							<div className="Tree-Indent">{util.intersperse(tail.map(item => tree_print_JSX(item, go_inline)),go_inline?<br/>:"")}</div>
						<div>]</div>
					</div>
				);
			}
		}
	}
	return <span className="print_tree_error">print_tree error</span>;
	
}
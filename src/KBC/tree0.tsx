import { zip } from "./iter";
import {intersperse} from "./util";

type LeafLiteral = number | string | boolean;
export type Leaf = [string, LeafLiteral];
export type UnaryTree = [string, Tree | Leaf];
export type BinaryTree = [string, Tree | Leaf, Tree | Leaf];
export type Tree = UnaryTree | BinaryTree;// any[];



export function type(tree: Tree) {
	return tree[0];
}

export function same_type(tree_a: Tree, tree_b: Tree) {
	return tree_a[0] === tree_b[0]
}

export function is_leaf(tree: Tree | Leaf): tree is Leaf {
	return tree.length === 2 && !Array.isArray(tree[1]);
}

export function is_leaf_literal(tree: Tree | Leaf | LeafLiteral): tree is LeafLiteral {
	return !Array.isArray(tree);
}

export function copy<T extends Tree | Leaf>(tree: T): T {
	if (is_leaf(tree)) {
		return [...tree] as T & Leaf;
	}
	let [head, ...tail] = tree;
	return [head, tail.map(copy)] as T & Tree;

}

export function* walk_pre_order(tree: Tree | Leaf): Generator<Tree | Leaf> {
	if (is_leaf(tree)) return;
	yield tree;
	let [head, ...tail] = tree;
	for (let subtree of tail) {
		yield* walk_pre_order(subtree)
	}
}

export function* walk_pre_order_depth(tree: Tree | Leaf, depth: number = 0): Generator<[Tree | Leaf, number]> {
	yield [tree, depth];
	if (is_leaf(tree)) return;
	let [head, ...tail] = tree;
	for (let subtree of tail) {
		yield* walk_pre_order_depth(subtree, depth + 1);
	}
}

export function* walk_post_order_depth(tree: Tree | Leaf, depth: number = 0): Generator<[Tree | Leaf, number]> {
	if (!is_leaf(tree)) {
		let [head, ...tail] = tree;
		for (let subtree of tail) {
			yield* walk_pre_order_depth(subtree, depth + 1);
		}
	}
	yield [tree, depth];
}

function* walk_pre_order_index(tree: Tree | Leaf, index: number[] = []): Generator<[Tree | Leaf, number[]]> {
	yield [tree, index];
	if (is_leaf(tree)) return;
	let [head, ...tail] = tree;
	let sub_index = 0;
	for (let subtree of tail) {
		yield* walk_pre_order_index(subtree, [sub_index, ...index]);
		sub_index++;
	}
}





/**
 * Returns a list of numbers: each item of the list corresponds to
 * either a (Tree or a Leaf) in pre-order, and is the count of Leaf
 * below that node.
 * 
 * The length of the list is the number of nodes
 * The value of the first item in the list is the total count of leaves.
 * Since the left branch is always explored first, bigger numbers toward 
 * the left of the list indicate higher complexity to the left of the tree.
 */
function count_leaf_below_pre_order(tree: Tree | Leaf): number[] {
	if (is_leaf(tree) || (tree.length == 2 && is_leaf(tree[1]))) return [1];
	let [head, ...tail] = tree;
	let tail_results = tail.map(count_leaf_below_pre_order);
	return [
		tail_results.reduce((acc, cur) => acc + cur[0], 0),
		...tail_results.flat()
	]
}

export function max_depth(tree: Tree | Leaf, depth = 0): number {
	if (is_leaf(tree)) return depth;
	let [head, ...tail] = tree;
	return tail.reduce((deepest_so_far, subtree) =>
		Math.max(deepest_so_far, max_depth(subtree, depth + 1)), depth);
}

function count(tree: Tree | Leaf): number {
	if (is_leaf(tree)) return 1;
	let [head, ...tail] = tree;
	return tail.reduce(
		(sum, subtree) => sum + count(subtree),
		0
	);
}



function less_complex_than(tree_a: Tree | Leaf, tree_b: Tree | Leaf) {
	let complexity_a = count_leaf_below_pre_order(tree_a);
	let complexity_b = count_leaf_below_pre_order(tree_b);
	if (complexity_a.length != complexity_b.length) {
		return complexity_a.length < complexity_b.length;
	}
	for (let [a, b] of zip(complexity_a, complexity_b)) {
		if (a < b) return true;
	}
	return false;
}
/**
 * Repeatedly indexes tree using each number in the index_list and returns the result.
 */
function index(tree: Tree | Leaf, index_list: number[]) {
	let result = tree;
	for (let index of index_list) {
		if (index === 0) throw new Error("zero indices are not allowed");
		result = result[index] as Tree | Leaf;
	}
	return result;
}


export function print_JSX(tree:Tree|Leaf, inline=false):JSX.Element {
	let [head, ...tail] = tree;
	if(is_leaf(tree)){
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
					{util.intersperse(tail.map(item => print_JSX(item, inline))," ")}{" "}
					] 
				</div>
			);
		} else {
			// indented recursion
			let go_inline = inline || max_depth(tree)<5;
			return (
				<div>
					<div>[<span className="Tree-Function-Name">{head}</span></div>
						<div className="Tree-Indent">{util.intersperse(tail.map(item => print_JSX(item, go_inline)),go_inline?<br/>:"")}</div>
					<div>]</div>
				</div>
			);
		}
	}
}
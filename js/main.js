"use strict";

var input_tree;
var input_textarea = document.querySelector("#axiom_input");

input_textarea.addEventListener("keyup",change_handler);
input_textarea.addEventListener("keyup",replace_while_typing);
input_textarea.addEventListener("click",change_handler);




if (localStorage.getItem("inp")){
	input_textarea.value = localStorage.getItem("inp");
}

let axioms = [];
if (localStorage.getItem("axioms")){
	axioms = JSON.parse(localStorage.getItem("axioms"));
}
draw_axioms()





let grammar = undefined;
let last_grammar = "";

var headers = new Headers();
headers.append('pragma', 'no-cache');
headers.append('cache-control', 'no-cache');

setInterval(update_on_grammar, 3000);

function update_on_grammar(){
	fetch("/grammar.pegjs", {headers})
	.then(response=>response.text())
	.then(text=>{
		if (text===last_grammar){
			return;
		}
		last_grammar = text;
		grammar = peggy.generate(text,);
		change_handler();
	})
}

let replace_while_typing_rules = [
	new Replace_While_Typing("*","·"),
	new Replace_While_Typing("ohm","Ω"),
	new Replace_While_Typing("micro","µ"),
	new Replace_While_Typing("-->","⟶"),
	new Replace_While_Typing("<=","≤"),
	new Replace_While_Typing(">=","≥"),
	new Replace_While_Typing("<>","≠"),
	new Replace_While_Typing("¬=","≠"),
	new Replace_While_Typing("¬<","≥"),
	new Replace_While_Typing("¬>","≤"),
	new Replace_While_Typing("··","^"),
	new Replace_While_Typing("and","∧"),
	new Replace_While_Typing("or","∨"),
	new Replace_While_Typing("not","¬"),
]



function replace_while_typing(e){
	if(input_textarea.selectionStart === input_textarea.selectionEnd){
		let sel_start = input_textarea.selectionStart ;
		let v = input_textarea.value;

		replace_while_typing_rules.map(item=>{
			[v, sel_start] = item.do_replace(v, sel_start);
		})
		input_textarea.value = v;
		input_textarea.selectionStart = sel_start;
		input_textarea.selectionEnd = sel_start;
	}
}


function change_handler(e){
	if(!grammar) return;

	localStorage.setItem("inp", input_textarea.value);
	
	input_tree = ["nux"]

	try{
		input_tree = grammar.parse(input_textarea.value);
		document.querySelector("#raw").innerHTML = tree_print(input_tree);
	}catch(e){
		document.querySelector("#raw").innerHTML = e.message;
	}

	if(input_tree[0]=="rew"){
		document.querySelector("#out_count").innerHTML = tree_complexity(input_tree[1])+"<br>"+tree_complexity(input_tree[2]);
	}else{
		document.querySelector("#out_count").innerHTML = tree_complexity(input_tree);
	}

}


function add_axiom(){

	if(input_tree[0]!=="rew"){
		alert("Axiom must be rewrite rule")
		return;
	}
	if(tree_is_less_complex_than(input_tree[1], input_tree[2])){
		alert("Axiom must be ordered!")
		return;
	} 
	axioms.push([
		"axiom",
		["str", input_textarea.value],
		input_tree
	]);
	draw_axioms()
	localStorage.setItem("axioms", JSON.stringify(axioms));
}

function draw_axioms(){
	document.querySelector("#stage1").innerHTML = "";
	axioms.map(axiom=>{
		let ndiv = document.createElement("div");
		ndiv.setAttribute("class","axiom_container")
		ndiv.innerHTML = tree_print(axiom[1]);
		document.querySelector("#stage1").appendChild(ndiv)
	})
}

function axiom_list_click(e){
	let node = e.target;
	let bail = true;
	while (node!==null){
		if(node.getAttribute("class")=="axiom_container"){
			bail = false;
			break;
		}
		node = node.parentNode;
	}
	if(bail) return;
	let index = Array.from(node.parentNode.children).indexOf(node)
	if(e.ctrlKey){
		let [axiom] = axioms.splice(index,1);
		input_textarea.value = axiom[1][1];
		change_handler()
		draw_axioms()
		return;
	}

	let axiom = axioms[index];
	document.querySelector("#stage2").innerHTML = tree_print(match(axiom[2][1], input_tree));

	
}

update_on_grammar()
"use strict";

var input_textarea = document.querySelector("#input");
input_textarea.addEventListener("keyup",change_handler);
input_textarea.addEventListener("keyup",replace_while_typing);
input_textarea.addEventListener("click",change_handler);

if (localStorage.getItem("inp")){
	input_textarea.value = localStorage.getItem("inp");
}

document.querySelector("#rule_list").innerHTML = print_tree(axioms, true);

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
	document.querySelector("#intermediate").innerHTML = "";
	localStorage.setItem("inp", input_textarea.value);
	
	let intermediate;
	try{
		intermediate = grammar.parse(input_textarea.value);
		document.querySelector("#intermediate").innerHTML = JSON.stringify(intermediate,null,2);
	}catch(e){
		document.querySelector("#intermediate").innerHTML = e.message;
		document.querySelector("#output").innerHTML = "";
	}

	let result;
	try{
		result = [];
		for(let item of tree_walk(intermediate)){
			result.push(print_tree(item));
		}
		document.querySelector("#output").innerHTML = result.join("<br>");
	}catch(e){
		document.querySelector("#output").innerHTML = e.message;
	}

}


update_on_grammar()
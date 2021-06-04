"use strict";
if (localStorage.getItem("inp")){
	document.querySelector("#input").value = localStorage.getItem("inp");
}

let grammar = undefined;
let last_grammar = "";

var headers = new Headers();
headers.append('pragma', 'no-cache');
headers.append('cache-control', 'no-cache');

setInterval(
	update_on_grammar
	,3000
);

function update_on_grammar(){
	fetch("/grammar.pegjs", {headers})
	.then(response=>response.text())
	.then(text=>{
		if (text===last_grammar){
			return;
		}
		last_grammar = text;
		grammar = peggy.generate(text);
		change_handler();
	})
}


var input_textarea = document.querySelector("#input");
input_textarea.addEventListener("keyup",change_handler);
input_textarea.addEventListener("keyup",replace_while_typing);
input_textarea.addEventListener("click",change_handler);

function replace_while_typing(e){
	if(input_textarea.selectionStart === input_textarea.selectionEnd){
		let sel_start = input_textarea.selectionStart ;
		let v = input_textarea.value;
		if (v[sel_start-1]==="*"){
			input_textarea.value = v.slice(0, sel_start-1)+"·"+v.slice(sel_start);
			input_textarea.selectionStart = sel_start;
			input_textarea.selectionEnd = sel_start;
		}
		if (v.slice(sel_start-3,sel_start)?.toLowerCase()==="ohm"){
			input_textarea.value = v.slice(0, sel_start-3)+"Ω"+v.slice(sel_start);
			input_textarea.selectionStart = sel_start-2;
			input_textarea.selectionEnd = sel_start-2;
		}
		if (v.slice(sel_start-5,sel_start)?.toLowerCase()==="micro"){
			input_textarea.value = v.slice(0, sel_start-5)+"µ"+v.slice(sel_start);
			input_textarea.selectionStart = sel_start-4;
			input_textarea.selectionEnd = sel_start-4;
		}

		
	}
}

function change_handler(e){
	if(!grammar) return;
	document.querySelector("#intermediate").innerHTML = "";
	localStorage.setItem("inp", document.querySelector("#input").value);
	
	let intermediate;
	try{
		intermediate = grammar.parse(document.querySelector("#input").value);
		document.querySelector("#intermediate").innerHTML = JSON.stringify(intermediate,null,2);
	}catch(e){
		document.querySelector("#intermediate").innerHTML = e.message;
		document.querySelector("#output").innerHTML = "";
	}

	let result;
	try{
		result = print_tree(intermediate);
		document.querySelector("#output").innerHTML = result;
	}catch(e){
		document.querySelector("#output").innerHTML = e.message;
	}

}


update_on_grammar()
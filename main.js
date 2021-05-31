
if (localStorage.getItem("inp")){
	document.querySelector("#input").value = localStorage.getItem("inp");
}

let grammar = undefined;
let last_grammar = "";

var headers = new Headers();
headers.append('pragma', 'no-cache');
headers.append('cache-control', 'no-cache');

setInterval(()=>{
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
	,3000
);

document.querySelector("#input").addEventListener("keyup",change_handler);
document.querySelector("#input").addEventListener("click",change_handler);

function change_handler(e){
	if(!grammar) return;
	document.querySelector("#intermediate").innerHTML = "";
	localStorage.setItem("inp", document.querySelector("#input").value);
	try{
		let [intermediate, result] = grammar.parse(document.querySelector("#input").value);
		document.querySelector("#intermediate").innerHTML = JSON.stringify(intermediate,null,2);
		document.querySelector("#output").innerHTML = JSON.stringify(result,null,2);
	}catch(e){
		document.querySelector("#intermediate").innerHTML = e.message;
		document.querySelector("#output").innerHTML = "";
	}

}

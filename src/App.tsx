import React from 'react';
import { useState } from 'react';
import './App.css';
import KBCParserInput, { KBCParserInputState } from './Components/KBCParserInput';
import * as tree from "./KBC/tree"
import { tree_evaluate } from './KBC/tree_evaluate';

function format_error(state:KBCParserInputState){
	let {error}=state;
	if(error == null) return "";
	let len = error.location.end.offset - error.location.start.offset;
	if(len<2){
		return new Array(error.location.start.offset).fill("═").join("")+"╛";
	}else{
		return new Array(error.location.start.offset).fill("═").join("")+"╧"+
			new Array(len-1).fill("═").join("")+"╛"
	}
}

function App() {
	let [kbc1_value, kbc1_set_value] = useState<KBCParserInputState>({text:"", tree:["err", "Awaiting input to parse."], error:null})
	return (
		<div className="Index-Panel">
			<KBCParserInput value={kbc1_value} setValue={kbc1_set_value}/>
			<p>{
				kbc1_value.error
				? 
				<pre>{
					"input: "+kbc1_value.text + "\r\n"+
					"error: "+format_error(kbc1_value)+"\r\n\r\n"+
					kbc1_value.error?.message
				}</pre>
				:
				<div>{tree.print_JSX(kbc1_value.tree)}</div>
			}</p>
			<p>{
				tree.print_JSX(tree_evaluate(kbc1_value.tree))
			}</p>
		</div>
	);
}

export default App;

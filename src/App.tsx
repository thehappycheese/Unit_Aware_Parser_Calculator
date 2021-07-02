import React from 'react';
import { useState } from 'react';
import './App.css';
import KBCParserInput, { KBCParserInputState } from './Components/KBCParserInput';
import * as tree from "./KBC/tree"

function App() {
	let [kbc1_value, kbc1_set_value] = useState<KBCParserInputState>({text:"", tree:[], error:null})
	return (
		<div className="Index-Panel">
			<KBCParserInput value={kbc1_value} setValue={kbc1_set_value}/>
			<br/>
			{kbc1_value.error && <div>{kbc1_value.error?.message ?? ""}</div>}
			<div>{tree.tree_print_JSX(kbc1_value.tree)}</div>
			
		</div>
	);
}

export default App;

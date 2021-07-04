import React, { useState, useRef, useEffect} from "react"
import * as peggy from "peggy";
import * as tree from "../KBC/tree";



class Replace_While_Typing {
	pattern:string;
	replacement:string;
	ignore_case:boolean;
	constructor(pattern:string, replacement:string, ignore_case=false) {
		this.pattern = pattern;
		this.replacement = replacement;
		this.ignore_case = ignore_case;
	}
	can_replace(text:string, caret_position:number) {
		let slice = text.slice(caret_position - this.pattern.length, caret_position)
		if(this.ignore_case){
			return slice?.toLowerCase() === this.pattern.toLowerCase();
		}else{
			return slice === this.pattern;
		}
	}
	do_replace(text:string, caret_position:number):[string, number] {
		if (this.can_replace(text, caret_position)) {
			return [
				text.slice(0, caret_position - this.pattern.length) + this.replacement + text.slice(caret_position),
				caret_position - this.pattern.length + this.replacement.length
			]
		}
		return [text, caret_position];
	}
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
	new Replace_While_Typing("true","Ⓣ"),
	new Replace_While_Typing("false","Ⓕ"),
]


let parser:peggy.Parser;
async function get_grammar(){
	let result = await fetch("/grammar.pegjs");
	let result_text = await result.text();
	parser = peggy.generate(result_text,{})
}
get_grammar();

export type KBCParserInputState = {
	text:string, 
	tree:tree.TreeOrLeaf,
	error:peggy.parser.SyntaxError | null
}

export default function KBCParserInput({value, setValue}:{value:KBCParserInputState, setValue:React.Dispatch<React.SetStateAction<KBCParserInputState>>}){
	const inputEl = useRef<HTMLInputElement>(null);
	let [{selectionStart,selectionEnd}, set_selection] = useState({
		selectionStart:0,
		selectionEnd:0
	} as Record<string, number|null>);
	useEffect(
		() => {
			console.log("effect")
			if(inputEl===null) return;
			if(inputEl.current===null) return;

			inputEl.current.selectionStart = selectionStart;
			inputEl.current.selectionEnd = selectionEnd;
		}
	);
	return <input ref={inputEl} type="text" value={value.text} onChange={(e)=>{
		
		let current_selection_start = e.target.selectionStart;
		let current_value = e.target.value;
		replace_while_typing_rules.map(item=>{
			[current_value, current_selection_start] = item.do_replace(current_value, current_selection_start ?? current_value.length);
		})
		let tree_parsed:tree.TreeOrLeaf = ["err", "failed to parse"];
		let error:peggy.parser.SyntaxError|null = null;
		
		try{
			tree_parsed = parser.parse(current_value)
		}catch(e){
			error = e;
		}
		
		setValue({
			text:current_value,
			tree:tree_parsed,
			error
		})
		set_selection({
			selectionStart:current_selection_start,
			selectionEnd:current_selection_start
		})
	}} />
}
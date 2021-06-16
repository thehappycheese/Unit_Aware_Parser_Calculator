
class Replace_While_Typing {
	constructor(pattern, replacement, ignore_case=false) {
		this.pattern = pattern;
		this.replacement = replacement;
		this.ignore_case = ignore_case;
	}
	can_replace(text, caret_position) {
		let slice = text.slice(caret_position - this.pattern.length, caret_position)
		if(this.ignore_case){
			return slice?.toLowerCase() === this.pattern.toLowerCase();
		}else{
			return slice === this.pattern;
		}
	}
	do_replace(text, caret_position) {
		if (this.can_replace(text, caret_position)) {
			return [
				text.slice(0, caret_position - this.pattern.length) + this.replacement + text.slice(caret_position),
				caret_position - this.pattern.length + this.replacement.length
			]
		}
		return [text, caret_position];
	}
}
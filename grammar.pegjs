{

}

Expression
	= head:Term tail:( _ ("+" / "-") _ Term)* {
		let result = tail.reduce((head, tail) =>{
				let [/*whitespace*/, op, /*whitespace*/, term] = tail;
				if(op==="+"){
					return ["add", head, term];
				}else{
					return ["add", head, ["neg", term]];
				}
			},
			head
		);
		return result;
	}

Term
  = head:Factor tail:(_ ("*" / "/") _ Factor)* {
	  return tail.reduce((head, tail)=>{
		let [/*whitespace*/, op, /*whitespace*/, term] = tail;
		if(op==="*"){
			return ["mul", head, term];
		}else{
			return ["mul", head, ["pow", term, ["num", -1]]];
		}
	  }, head);
	}

Factor
  = "(" _ expr:Expression _ ")" { return expr; }
  / Number_Unit
  / Number_Unitless


Number_Unit 
 = number:Number_Unitless unit:(Unit_Modified / Unit) {return ["*", number, unit]}

Number_Unitless "number-unitless"
 = _ [+-]?[0-9]+ ( '.' [0-9]+ )? {
	return ["num", parseFloat(text())];
}

_ "whitespace"
  = [ \t\n\r]*
  
 
Unit_Modified
 = mod:("T"/"G"/"M"/"k"/"m"/"µ"/"n"/"p"/"f") unit:Unit {
 	let exponent = {
		T:12,
		G:9,
		M:6,
		k:3,
		m:-3,
		µ:-6,
		n:-9,
		p:-12,
		f:-15
	}[mod];
	
	return ["mul", ["pow", ["num",10], ["num",exponent]], unit];
 }
 
Unit "unit"
 = Amp / Volt / Ohm / Watt / Metre
  
Amp "Amps"
 = "A" {return ["sym","A"]}
 
Volt "Volt"
 ="V" {return ["sym","V"]}
 
Ohm "Ohm"
 = "Ω" {return ["sym","Ω"]}
 
Watt "Watt"
 = "W" {return ["sym","W"]}
 
Metre "Metre"
 = "m" {return ["sym","m"]}

// 3mW/mm = [3units][[10^-3][W^1]][[10^-3][m^-1]]
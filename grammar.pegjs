{

}

Thingo = Relationship / RewriteRule / Term_Addition


ConditionList =
	first:Relationship rest:(_ ";" _ Relationship)*{
		return [first, ...rest.map(item=>item[3])];
	}


Relationship = 
	Relationship_Equal /
	Relationship_Not_Equal /
	Relationship_Less_Than /
	Relationship_Greater_Than /
	Relationship_Less_Than_Or_Equal /
	Relationship_Greater_Than_Or_Equal /
	Term_Logical



Relationship_Equal
	= head:Term_Addition _ "=" _ tail:Term_Addition {
		return ["equ", head, tail];
	}

Relationship_Not_Equal
	= head:Term_Addition _ "≠" _ tail:Term_Addition {
		return ["not", ["equ", head, tail]];
	}

Relationship_Less_Than
	= head:Term_Addition _ "<" _ tail:Term_Addition {
		return ["lt", head, tail];
	}

Relationship_Greater_Than
	= head:Term_Addition _ ">" _ tail:Term_Addition {
		return ["gt", head, tail];
	}

Relationship_Greater_Than_Or_Equal
	= head:Term_Addition _ "≥" _ tail:Term_Addition {
		return ["not", ["lt", head, tail]];
	}

Relationship_Less_Than_Or_Equal
	= head:Term_Addition _ "≤" _ tail:Term_Addition {
		return ["not", ["gt", head, tail]];
	}

RewriteRule
	= head:Term_Addition _ "⟶" _ tail:Term_Addition cond:(_ "where" _ ConditionList )? {
		let result = ["rew", head, tail];
		if(cond){
			result.push(cond[3])
		}
		return result;
	}


Term_Logical
	= head:Term_Addition tail:( _ ("∧" / "∨") _ Term_Addition)* {
		let result = tail.reduce((head, tail) =>{
				let [/*whitespace*/, op, /*whitespace*/, term] = tail;
				if(op === "∧"){
					return ["and", head, term];
				}else{
					return ["or", head, term];
				}
			},
			head
		);
		return result;
	}

Term_Addition
	= head:Term_Multiplication tail:( _ ("+" / "-") _ Term_Multiplication)* {
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

Term_Multiplication
  = head:Exponent tail:(_ ("·" / "/") _ Exponent)* {
	  return tail.reduce((head, tail)=>{
		let [/*whitespace*/, op, /*whitespace*/, term] = tail;
		if(op==="·"){
			return ["mul", head, term];
		}else{
			return ["mul", head, ["pow", term, ["num", -1]]];
		}
	  }, head);
	}

Factor
  = "(" _ expr:Term_Addition _ ")" { return expr; }
  / Number
  / Unit_Modified

Exponent
	= factor:Factor "^" exponent:Factor {
		return ["pow", factor, exponent]
	}
	/ Factor


// Number_Unit 
//  = number:Number_Unitless unit:(Unit_Modified / Unit) {return ["mul", number, unit]}

Number "number-unitless"
 = _ [+-]?[0-9]+ ( '.' [0-9]+ )? {
	return ["num", parseFloat(text())];
}

_ "whitespace"
  = [ \t\n\r]*
 
Unit_Modified
	= Non_Prefixable_Unit 
	/ mod:("T"/"G"/"M"/"k"/"m"/"µ"/"n"/"p"/"f") unit:Prefixable_Unit {
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
		return ["mul", ["pow", ["num",10], ["num", exponent]], unit];
	}
	/ Prefixable_Unit
	 
Non_Prefixable_Unit
	= Kilogram / Hour

Prefixable_Unit
	= Metre / Second / Gram / Ampere / Kelvin / mole / candela / Volt / Ohm / Farrad / Henry / Watt / Celcius



// SI Base Units
Metre
	= "m" {return ["sym","m"]}

Second
	= "s" {return ["sym","s"]}



Kilogram
	= "kg" {return ["sym","kg"]}

Gram
	= "g" {
		return ["mul",["pow",["num", 10],["num",-3]],["sym","kg"]] 
	}

Ampere
	= "A" {return ["sym","A"]}
 
Kelvin
	= "K" {return ["sym","K"]}

mole
	= "mol" {return ["sym","mol"]}

candela
	= "cd" {return ["sym","cd"]}

// SI Derived Units

Hour
	= "h" {return ["sym","h"]}

Volt
	= "V" {return ["sym","V"]}

Ohm
	= "Ω" {return ["sym","Ω"]}

Farrad
	= "F" {return ["sym","F"]}

Henry
	= "H" {return ["sym","H"]}

Watt
	= "W" {return ["sym","W"]}

Celcius
	= "C" {return ["sym","C"]}
// 3mW/mm = [3units][[10^-3][W^1]][[10^-3][m^-1]]
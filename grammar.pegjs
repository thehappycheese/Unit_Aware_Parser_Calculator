{

	function head(item){
		return item[0];
	}
	function tail(item){
		return item.slice(1);
	}
	function partition(arr, predicate){
		let result_true = [];
		let result_false = [];
		for(let item of arr){
			if(predicate(item)){
				result_true.push(item);
			}else{
				result_false.push(item);
			}
		}
		return [result_true, result_false];
	}

	function simplify(item){
		let [op, ...args] = item;
		switch (op) {
			case "+":
				return simplify_add(...args)
			default:
				return item;
		}
	}

	function simplify_add(...items){
		let [nums, other] = partition(items.map(simplify), item=>head(item)=="num")
		
		let num = ["num", nums.reduce((acc,cur)=>acc+cur[1],0)];
		if (other.length){
			return ["+",num,...other]
		}
		return num;
	}
}

Expression
  = head:Term tail:(_ ("+" / "-") _ Term)* {
	  let result = tail.reduce(function(result, element) {
		  return [element[1], result , element[3]];
	  }, head);
	  return [result, simplify(result)];
	}

Term
  = head:Factor tail:(_ ("*" / "/") _ Factor)* {
	  return tail.reduce(function(result, element) {
		return [element[1], result, element[3]];
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
	
	return ["*", ["pow", ["num",10], ["num",exponent]], unit];
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
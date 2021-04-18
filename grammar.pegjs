{
	function add_terms(a,b){
    	if(a.unit==b.unit){
        	return {number:a.number+b.number, unit:a.unit}
        }
        return [a,"+",b]
    }
	function mul_factors(a, b){
    	console.log(a,b)
    	if(b.unit=="none"){
        	return {number:a.number*b.number, unit:a.unit}
        }
        if(a.unit=="none"){
        	return {number:a.number*b.number, unit:b.unit}
        }
        if(a.unit=="V" && b.unit=="A"){
        	return {number:a.number*b.number, unit:"W"}
        }
        return [a,"*",b]
    }
    function div_factors(a, b){
    	if(b.unit=="none"){
        	return {number:a.number/b.number, unit:a.unit}
        }
        if(a.unit==b.unit){
        	return {number:a.number/b.number, unit:"none"}
        }
        return [a,"/",b]
    }
}

Expression
  = head:Term tail:(_ ("+" / "-") _ Term)* {
      return tail.reduce(function(result, element) {
        if (element[1] === "+") {
        	return add_terms(result , element[3]);
            
        }
        if (element[1] === "-") { return result - element[3]; }
      }, head);
    }
    


Term
  = head:Factor tail:(_ ("*" / "/") _ Factor)* {
      return tail.reduce(function(result, element) {
        if (element[1] === "*") {
        	return mul_factors(result , element[3]);
        }
        if (element[1] === "/") { 
        	return div_factors(result , element[3]);
        }
      }, head);
    }

Factor
  = "(" _ expr:Expression _ ")" { return expr; }
  / Number_Unit
  / Number_Unitless


Number_Unit 
 = number:Number_Unitless unit:(Unit / Unit_Modified) {return {...number, unit:unit}}

Number_Unitless "number-unitless"
 = _ [+-]?[0-9]+ ( '.' [0-9]+ )? {
	return {number:parseFloat(text()), unit:{}};
}


_ "whitespace"
  = [ \t\n\r]*
  
 
Unit_Modified
 = mod:("T"/"G"/"M"/"k"/"m"/"µ"/"n"/"p") unit:Unit {
 	let exponent = {
    	T:12,
        G:9,
        M:6,
        k:3,
        m:-3,
        µ:-6,
        "micro-":-6,
        n:-6,
        p:-9,
        f:-15
    }[mod];
    let out = {};
    for(let [key,val] of Object.entries(unit)){
    	out[key] = val+exponent;
    }
    return out;
 }
 
Unit "unit"
 = Amp / Volt / Ohm / Watt
  
Amp "Amps"
 = "A" {return {A:0}}
 
Volt "Volt"
 ="V" {return {V:0}}
 
Ohm "Ohm"
 = "Ohm"/"Ω" {return {Ω:0}}
 
Watt "Watt"
 = "W" {return {W:0}}
 
Metre "Metre"
 = "m" {return {m:0}}

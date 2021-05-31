function keys_match(a, b) {
	let a_keys = Object.keys(a).sort();
	let b_keys = Object.keys(b).sort();
	if (a_keys.length != b_keys.length) return false;
	for (let i = 0; i < a_keys.length; i++) {
		if (a_keys[i] != b_keys[i]) return false;
	}
	return true;
}

function keys_match_and_values_match(a, b) {
	let a_keys = Object.keys(a).sort();
	let b_keys = Object.keys(b).sort();
	if (a_keys.length != b_keys.length) return false;
	for (let i = 0; i < a_keys.length; i++) {
		if (a_keys[i] != b_keys[i]) return false;
		if (a[a_keys[i]] != b[b_keys[i]]) return false;
	}
	return true;
}

function zero_units(item) {
	
	let u_entries = Object.entries(item.unit);
	let exponent_to_add = 0-u_entries[0][1];
	

	return {
		number:item.number/10**exponent_to_add,
		unit:Object.fromEntries(u_entries.map(item=>[item[0],item[1]+exponent_to_add]))
	}

}
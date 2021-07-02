// function* enumerate(arr) {
// 	let cnt = 0;
// 	for (let item of arr) {
// 		yield [cnt, item];
// 		cnt++;
// 	}
// }

/**
 * Keeps returning pairs until one array runs out.
 */
export function* zip(arr1:Array<any>, arr2:Array<any>) {
	for (let i = 0; i < Math.min(arr1.length, arr2.length); i++) {
		yield [arr1[i], arr2[i]];
	}
}

/** # zip_undefined()
 * 
 * Keeps returning until both inputs are exhausted. 
 * When one iterator runs out it keeps going until the other is also exhausted,
 * filling the blanks with `undefined`
 * 
 */
export function* zip_undefined<T1,T2>(iter1:Iterator<T1>, iter2:Iterator<T2>):Generator<[T1|undefined, T2|undefined]> {
	while(true){
		let r1 = iter1.next();
		let r2 = iter2.next();
		yield [
			r1.done?undefined:r1.value,
			r2.done?undefined:r2.value,
		]
		if(r1.done && r2.done) return;
	}
}

export function * iter_map<T,V>(iter:Iterable<T>, func:(arg:T)=>V):Generator<V>{
	for(let item of iter){
		yield func(item)
	}
}

// function partition(arr, predicate) {
// 	let result_true = [];
// 	let result_false = [];
// 	for (let item of arr) {
// 		if (predicate(item)) {
// 			result_true.push(item);
// 		} else {
// 			result_false.push(item);
// 		}
// 	}
// 	return [result_true, result_false];
// }


/// chunk every n, never produce a chunk less than n, stop early if required
export function* chunk(arr:Array<any>, n:number) {
	let each_result = [];
	for (let item of arr) {
		each_result.push(item);
		if (each_result.length === n) {
			yield each_result;
			each_result = [];
		}
	}
}
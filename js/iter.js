// function* enumerate(arr) {
// 	let cnt = 0;
// 	for (let item of arr) {
// 		yield [cnt, item];
// 		cnt++;
// 	}
// }

function* zip(arr1, arr2) {
	for (let i = 0; i < Math.min(arr1.length, arr2.length); i++) {
		yield [arr1[i], arr2[i]];
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
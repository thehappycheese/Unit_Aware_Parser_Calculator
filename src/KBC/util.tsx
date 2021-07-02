
/** Places a separator between all elements of an array and returns a new array
 * 
 * @example
 * ```typescript
 * intersperse([1,2,3],"&")
 * //[1, "&", 2, "&", 3]
 * ```
 */
export function intersperse(array:any[], separator:any){
	return array.reduce((acc,item)=>(acc)?[...acc, separator, item]:[item], null);
}
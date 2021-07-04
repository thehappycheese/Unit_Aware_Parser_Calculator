
/** Places a separator between all elements of an array and returns a new array
 * 
 * @example
 * ```typescript
 * intersperse([1,2,3],"&")
 * //[1, "&", 2, "&", 3]
 * ```
 */
export function intersperse<A, B>(array:A[], separator:B):Array<A|B>{
	return array.reduce((acc,item)=>acc?[...acc, separator, item]:[item], null as unknown as Array<A|B>);
}
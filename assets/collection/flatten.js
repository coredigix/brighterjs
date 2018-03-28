/**
 * flatten array
 * recursive function is faster when level < 5
 * make array flatten, used with $$ main function to make flat all arrays passed in arguments
 */

const FLATTEN_ARRAY_MAX_LEVEL = 5;

function flattenArray(arr){
	var result	= [];
	makeFlat(arr, result, 0);
	return result;
}

function makeFlat(arr, target, level){
	if(level === FLATTEN_ARRAY_MAX_LEVEL)throw new Error('Max array level!');
	++level;
	if(typeof arr === 'object'){
		if(arr === null) target.push(arr);
		else if(Reflect.has(arr, 'length')){// array like
			for(var i=0, len = arr.length; i < len; ++i)
				makeFlat(arr[i], target, level);
		}
		else target.push(arr);
	}
	else target.push(arr);
}
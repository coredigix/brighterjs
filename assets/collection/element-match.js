/**
 * extends element match
 * elementMatch(htmlElement, 'div.cc')								element matches this selector
 * elementMatch(htmlElement, function(element) => {return true}) 	element matches this function
 * elementMatch(htmlElement, HTMLElement) 										match only this element
 * elementMatch(htmlElement, [HTMLElement])										matches if inside this array
 */

function elementMatch(ele, condition){ //TODO add matche css selector
	// match selector
	if(typeof condition === 'string'){}
	// match function
	else if(typeof condition === 'function')
		return condition(ele) === true;
	else if(condition.length){
		// we didn't use "indexOf" because this needs to be applied to ArrayLike lists too
		for(var i =0, len = condition.length; i < len; ++i){
			if(condition[i] === ele)
				return true
		}
		return false;
	}
	else
		return ele === condition;
}


/**
 * matches css selector
 */
function matcheSelector(element, selector){}
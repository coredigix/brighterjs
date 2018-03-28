/**
 * extends element match
 * elementMatch(htmlElement, 'div.cc')								element matches this selector
 * elementMatch(htmlElement, function(element) => {return true}) 	element matches this function
 * elementMatch(htmlElement, HTMLElement) 										match only this element
 * elementMatch(htmlElement, [HTMLElement])										matches if inside this array
 */

function elementMatch(ele, condition){
	// match selector
	if(typeof condition === 'string')
		return matchesSelector(ele, condition);
	// match function
	else if(typeof condition === 'function')
		return condition(ele);
	else if(
		typeof condition === 'object'
		&& condition !== null
		&& Reflect.has(condition, 'length') === true
	){
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
const matchesSelector	= (function(){
	var elementMatches;
	if( Element.prototype.matches )
		elementMatches	= function(ele, selector){ return ele.matches(selector); };
	else if( Element.prototype.matchesSelector )
		elementMatches	= function(ele, selector){ return ele.matchesSelector(selector); };
	else if( Element.prototype.mozMatchesSelector )
		elementMatches	= function(ele, selector){ return ele.mozMatchesSelector(selector); };
	else if( Element.prototype.msMatchesSelector )
		elementMatches	= function(ele, selector){ return ele.msMatchesSelector(selector); };
	else if( Element.prototype.oMatchesSelector )
		elementMatches	= function(ele, selector){ return ele.oMatchesSelector(selector); };
	else if( Element.prototype.webkitMatchesSelector )
		elementMatches	= function(ele, selector){ return ele.webkitMatchesSelector(selector); };
	else
		throw new Error('Unsupproted Element.matches');
	return elementMatches;
})();
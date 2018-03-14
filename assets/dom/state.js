$$.plugin({
	 /**
	  * isVisible()		: is the first tag is visible
	  * or.isVisible()	: is at least one tag is visible
	  * all.isVisible()	: is all tags are visible
	  */
	isVisible	: function(){
		return this.predicate(_elementIsVisible);
	},

	/**
	 * is(selector)			// returns true if the first element matches the selector
	 * is(HTMLELement)
	 * is(ArrayLike of HTMLElements)
	 * is(function)
	 * all.is(selector)		// returns true if all elements matches the selector
	 * or.is(selector)		// returns true if at least one element matches the selector
	 */
	is			: function(selector){
		return this.predicate(ele => _extendedMatches(ele, selector));
	}
});

function _elementIsVisible(ele){
	return ele.offsetWidth || ele.offsetHeight || ele.getClientRects().length > 0;
}
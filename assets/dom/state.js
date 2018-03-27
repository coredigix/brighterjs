$$.plugin({
	

	/**
	 * is(selector)			// returns true if the first element matches the selector
	 * is(HTMLELement)
	 * is(ArrayLike of HTMLElements)
	 * is(function)
	 * all.is(selector)		// returns true if all elements matches the selector
	 * or.is(selector)		// returns true if at least one element matches the selector
	 */
	is			: function(selector){
		return this.predicate(ele => elementMatch(ele, selector));
	}
});

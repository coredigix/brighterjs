$$.plugin({
	/**
	 * immediately following subling elements in the DOM
	 * .all.next					// get all next elements
	 */
	next	: function(selector){
		return _sibling(this, 'nextSibling', selector);
	},
	/**
	 * immediately following subling elements in the DOM
	 * .all.prev					// get all next elements
	 */
	prev	: function(selector){
		return _sibling(this, 'previousSibling', selector);
	},
	/**
	 * get next elements until somme selected one
	 * nextUntil(selector)
	 * nextUntil(function)	// until this function returns false
	 * nextUntil(HTMLElement)
	 * nextUntil(ArrayLikeOfHTMLElements)	// $$Object, jQueryObject, list, ...
	 *
	 * .all.nextUntil		// include the target element
	 * .not.nextUntil		// get elements others than selected ones (after selected ones)
	 */
	nextUntil	: _siblingUntil('nextSibling'), //TODO
	/**
	 * get next elements until somme selected one
	 * prevUntil(selector)
	 * prevUntil(function)	// until this function returns false
	 * prevUntil(HTMLElement)
	 * prevUntil(ArrayLikeOfHTMLElements)	// $$Object, jQueryObject, list, ...
	 *
	 * .all.prevUntil		// include target element
	 * .not.prevUntil		// get elements others than selected ones (before selected ones)
	 */
	prevUntil	: _siblingUntil('previousSibling'), //TODO
	/**
	 * get siblings elements
	 */
	siblings	: function(selector) {
		return this.parent.children(selector);
		// return this.tags.children()map(ele => {
		// 	return ele.parentNode && ele.parentNode.firstChild;
		// }).next(selector);
	},
	/**
	 * concatination of nextUntil et prevUntil
	 */
	siblingsUntil	: function(selector){
		return this
				.prevUntil(selector) // previous elements
				.push(
					this.nextUntil(selector) // next elements
				);
	}
});

/**
 * next	: nextSibling
 * prev	: previousSibling
 */
function _sibling($this, attrName){
	var nodes	= [];
	if($this._op('all'))
		$this.forEach(tag => {
			while(tag = tag[attrName]){
				if(nodes.indexOf(tag) === -1)
					nodes.push(tag);
			}
		});
	else
		$this.forEach(tag => {
			tag	= tag[attrName];
			if(tag && nodes.indexOf(tag) === -1)
				nodes.push(tag);
		});
	// filter
	nodes	= $$(nodes);
	if(selector)
		nodes = nodes.filter(selector);
	return nodes;
}


/**
 * sibling until
 */
function _siblingUntil(attr){
	return function(selector){
		var result,
			elements,
			includeTargetElement	= this._op('all'),
			returnsAfterTarget		= this._op('not'); // return elements after targetElement instead of before it
		// if no selector, just execute "next"
			if(!selector)
				result	= this.all[attr	=== 'nextSibling' ? 'next' : 'prev']();
		// else
			else{
				result	= this.$map(
					returnsAfterTarget ?
					(ele => {
						elements	= [];
						// escape unwanted elements
							while((ele = ele[attr]) && !_extendedMatches(ele, selector)){}
						// if include the target element
							if(includeTargetElement && ele)
								elements.push(ele);
						// got other elements
							if(ele){
								ele = ele[attr];
								while(ele = ele[attr])
									elements.push(ele);
							}
						return elements;
					})
					:(ele => {
						elements	= [];
						while((ele = ele[attr]) && !_extendedMatches(ele, selector))
							elements.push(ele);
						// if include target element
						if(includeTargetElement && ele)
							elements.push(ele);
						return elements;
					})
				);
			}
		return result;
	}
}
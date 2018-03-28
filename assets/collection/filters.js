$$.plugin({
/**
 * filter(selector)							// keep only elements that matches this selector
 * filter(function)							// keep only elements matched by this function
 * filter(HTMLElement)						// keep onl this tag if exits
 * filter([HTMLElement])					// return intersection of this array and current array
 * filter($$Object | jQuery | arrayLike)	// return intersection of this array and current array
 * 
 * not.filter			// inverse the result of the filter
 * @return {array} list of new elements that matches the condition
 */
	filter		: function(condition){
		var fx;
		if(arguments.length !== 1)
			throw new Error('Needs exactly one argument');
		// create filter fx
		if(typeof condition === 'string')
			fx	= ( ele => matchesSelector(ele, condition));
		// match function
		else if(typeof condition === 'function')
			fx	= condition;
		else if(Reflect.has(condition, 'length') === true)
			fx	= (ele => {
				// we didn't use "indexOf" because this needs to be applied to ArrayLike lists too
				for(var i = 0, len = condition.length; i < len; ++i){
					if(condition[i] === ele)
						return true
				}
				return false;
			});
		else
			fx = (ele => ele === condition);
		return Array.prototype.filter.call(this, this._op('not') === true ? (ele => !fx(ele)) : fx);
	},

	/**
	 * return the first element that matches a condition
	 * get first element that matches a condition
	 * first()							get the first element
	 * first(ele => true|false) 		get the first element that matches this condition
	 * first('div.cc')					get the first element that matches this selector
	 */
	first(condition){
		var len	= this.length;
		var result	= $$();
		if(len > 0){
			if(arguments.length === 0)
				result.push(this[ this._op('rtl') === true ? len - 1 : 0]);
			else
				this.each(ele => {
					if(elementMatch(ele, condition) === true){
						result.push(ele);
						return false;
					}
				});
		}
		return result;
	},

	/**
	 * get the last element that matches a condition
	 * last()						get the last element
	 * last(ele => true|false) 		get the last element that matches this condition
	 * last('div.cc')				get the last element that matches this selector
	 */
	last(condition){
		return this.rtl.first(condition);
	},

	
	/**
	 * do someting on a tag or throw error if not a tag or other errors
	 * @return cb return value
	 */
	// doTag	: function(index, cb, notSilentError){
	// 	var tag	= this.eq(index);
	// 	try{
	// 		if(tag.nodeType !== 1)
	// 			throw new Error('Not a tag');
	// 		return cb(tag);
	// 	} catch(err){
	// 		if(notSilentError === true)
	// 			throw err;
	// 	}
	// }
	// doFirstTag	: function(cb, preventSilentError){
	// 	var tag	= this[0];
	// 	try{
	// 		if(tag.nodeType !== 1)
	// 			throw new Error('Not a tag');
	// 		return cb(tag);
	// 	} catch(err){
	// 		if(preventSilentError === true)
	// 			throw err;
	// 	}
	// },

	/**
	 * execute a function on the first element and returns its value
	 * .get(int)		get this element, equivalent to this[int]
	 * .get(cb) 		execute operation on the first element and returns it's value
	 * .all.get(cb)		equivalent to .map(cb)
	 */
	get	: function(cb){
		if(this.length === 0){} // return undefined
		// do some operation and get result
		else if(typeof cb === 'function'){
			if(this._op('all') === true)
				return this.map(cb);
			else 
				return cb(this[0]);
		}
		// int
		else if(typeof cb === 'number'){
			if(cb < 0)
				cb += this.length;
			return this[cb];
		}
		// 
		else throw new Error('Illegal argument');
	},

	/**
	 * matches elements that contains some childrens
	 * .has(selector)		: select elements that has some childs
	 * .has(ArrayLike)		: Array, $$Object, HTMLElements or even jQuery object
	 * .not.has	: inverse of has
	 * @param {string} selector css selector
	 */
	has			: function(selector){
		if(arguments.length !== 1)
			throw new Error('Illegal arguments length');

		return this.filter(ele => _find(ele, selector) !== null); // "not" is implemented inside "filter" function
	},

	/**
	 * filter to get only visible items (with style.display != none && style.visibility!= hidden)
	 * visible		// filter visible items
	 * not.visible	// filter hidden items
	 */
	 get visible(){ return this.filter(_elementIsVisible); },// "not" is implemented inside "filter" function

	/**
	 * filter to get only visible items in the view port (visible to the user)
	 * get only elements that we see in viewport
	 * visible		// filter visible items
	 * not.visible	// filter hidden items
	 */
	 get userVisible(){ return this.filter(_elementIsUserVisible); },

	/**
	 * .attached		get only elements attached to DOM
	 * .not.attached	get only elements not attached to DOM
	 */
	 get attached(){ return this.filter(_elementIsAttached); },

	/**
	 * boolean equivaltent to filter functions
	* isVisible()		: is the first tag is visible
	* or.isVisible()	: is at least one tag is visible
	* all.isVisible()	: is all tags are visible
	* @return {boolean} true if the element is visible (see .visible above for more details)
	*/
	isVisible		: function(){ return this.predicate(_elementIsVisible); },
	isUserVisible	: function(){ return this.predicate(_elementIsUserVisible); },
	isAttached		: function(){ return this.predicate(_elementIsAttached); }
});


function _elementIsVisible(ele){
	return ele.offsetWidth || ele.offsetHeight || ele.getClientRects().length > 0;
}
function _elementIsUserVisible(ele){
	throw new Error('unimplemented');
	//TODO
}
function _elementIsAttached(ele){
	throw new Error('unimplemented');
	//TODO
}
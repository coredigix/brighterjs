$$.plugin({
/**
 * filter(selector)							// keep only elements that matches this selector
 * filter(function)							// keep only elements matched by this function
 * filter(HTMLElement)						// keep onl this tag if exits
 * filter([HTMLElement])					// return intersection of this array and current array
 * filter($$Object | jQuery | arrayLike)	// return intersection of this array and current array
 * 
 * not.filter			// inverse the result of the filter
 */
	filter		: function(condition){
		var fx;
		if(arguments.length !== 1)
			throw new Error('Needs exactly one argument');
		// create filter fx
		if(typeof condition === 'string')
			fx	= ( ele => matcheSelector(ele, condition));
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
	 * get first element that matches a condition
	 * first()							get the first element
	 * first(ele => true|false) 		get the first element that matches this condition
	 * first('div.cc')					get the first element that matches this selector
	 */
	first(condition){
		var len	= this.length;
		if(len > 0){
			if(arguments.length === 0)
				return this[0];
			else {
				for(var index = 0;index < len; ++index){
					if(elementMatch(this[index], condition) === true)
						return this[index];
				}
			}
		}
	},

	/**
	 * get the last element that matches a condition
	 * last()						get the last element
	 * last(ele => true|false) 		get the last element that matches this condition
	 * last('div.cc')				get the last element that matches this selector
	 */
	last(condition){
		var index	= this.length - 1;
		if(index >= 0){
			if(arguments.length === 0)
				return this[index];
			else {
				for(; index >= 0; --index){
					if(elementMatch(this[index], condition) === true)
						return this[i];
				}
			}
		}
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
	 * .get(int)		get this element
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
	}

	/**
	 * matches elements that contains some childrens
	 * .has(selector)		: select elements that has some childs
	 * .has(ArrayLike)		: Array, $$Object, HTMLElements or even jQuery object
	 * .not.has	: inverse of has
	 */
	has			: function(selector){
		if(arguments.length !== 1)
			throw new Error('Illegal arguments length');

		return this.filter(this._op('not') === true ? (ele => _find(ele, selector) === undefined) : (ee => _find(ele, selector) !== undefined));
	},

	/**
	 * visible		// filter visible items
	 * not.visible	// filter hidden items
	 */
	 get visible(){
	 	this.filter(this._op('not') ? (ele => _elementIsVisible(ele)) : _elementIsVisible);
	 }
});
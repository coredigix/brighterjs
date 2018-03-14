$$.plugin({
/**
 * filter()								// do nothing
 * filter(null | undefined )			// do nothing
 * filter(selector, selector2, ...)		// filter thos elements
 * filter(function, fx2, ...)		// use this fx
 * filter(HTMLElement)	// remove this HTML element from list
 * filter([HTMLElement])// remove all those HTML Elements (Array or Array like)
 * filter($$Object)		// remove all elements in this list in the collection
 * filter(HTMLElement, ...)
 * 
 * not.filter			// inverse the result of the filter
 * all.filter(fx, fx2, )// elements must mache all criteria instead of one of theme
 */
	filter		: function(){
		var result, fx, filterFxArr, filterFunc;
		if(arguments.length === 0)
			result	= this.duplicate(); // do copy
		else {
			// create filter fx
			filterFxArr = Array.prototype.map.call(arguments, function(arg) {
				if(typeof arg === 'function')	// function
					fx	= arg;
				else if(typeof arg == 'string')	// selector
					fx	= (ele => _ElementMatches(ele, arg));
				else if(arg.nodeType)			// DOM element
					fx	= (ele => ele === arg);
				else if('indexOf' in arg)		// brighter object or Array or Array like object
					fx	= (ele =>  arg.indexOf(ele) > -1);
				else if('index' in arg)			// jquery
					fx	= (ele =>  arg.index(ele) > -1);
				else if(!arg)
					fx = (ele => true);
				else
					throw new Error('Illegal argument ' + arg);
				return fx;
			});
			// filter fx
			if(this._op('all'))
				filterFunc	= (ele => filterFxArr.every(fx => fx(ele)));
			else
				filterFunc	= (ele => filterFxArr.some(fx => fx(ele)));
			// apply filter
			result	= Array.prototype.filter.call(this, this._op('not') ? (ele => !filterFunc(ele)) : filterFunc);
		}
		return result;
	},

	first	: function(){ return $$(super.first.call(arguments)); },
	last	: function(){ return $$(super.last.call(arguments)); },
	firstTag: function(predicat, start, end){ return $$(super.first(ele => ele && ele.nodeType === 1 && predicat, start, end)) },
	lastTag	: function(predicat, start, end){ return $$(super.last(ele => ele && ele.nodeType === 1 && predicat, start, end)) },

	// Each
	// each tag (tag only, exclude attributeNode, commentNode, textNode, ...)
	eachTag	: function(cb){
		return this.each(ele => ele && ele.nodeType === 1 ? cb(ele, i) : true );
	},

	/**
	 * map tags and returns undefined for non tags
	 */
	mapTags	: function(cb){
		return this.map(ele => ele && ele.nodeType === 1 ? cb(ele, i) : undefined );
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
	doFirstTag	: function(cb, preventSilentError){
		var tag	= this[0];
		try{
			if(tag.nodeType !== 1)
				throw new Error('Not a tag');
			return cb(tag);
		} catch(err){
			if(preventSilentError === true)
				throw err;
		}
	},

	/**
	 * .tagOperation(cb)	// do operation on the first tag and return it's value
	 * .all.tagOperation(cb)// do operation on all tags and return an array of it's values
	 */
	tagOperation	: function(cb){
		if(this._op('all') === true)
			return this.mapTags(cb);
		else return this.doFirstTag(cb);
	}

	get tags(){
		return this.filter(ele => ele && ele.nodeType === 1);
	},

	/**
	 * .has(selector)		: select elements that has some childs
	 * .has(ArrayLike)		: Array, $$Object, HTMLElements or even jQuery object
	 * .has()
	 * .not.has	: inverse of has
	 */
	has			: function(selector){
		var filterFx	= (ele => ele.find(selector).length !== 0);
		// apply
		return this.filter(this._op('not') === true ? (ele => !filterFx(ele)) : filterFx);
	},

	/**
	 * visible		// filter visible items
	 * not.visible	// filter hidden items
	 */
	 get visible(){
	 	this.filter(this._op('not') ? (ele => _elementIsVisible(ele)) : _elementIsVisible);
	 }
});

// get first tag
function _getFirstTag(tab){
	return Array.prototype.find.call(tab, ele => ele.nodeType === 1);
}
$$.plugin({
	/**
	 * className()				: get the className of the fist eleemnt
	 * className(className)		: set the className of all elements
	 * all.className()			: get all elements className as a list
	 */
	className		: function(className){
		return arguments.length === 0 ? this.attr('class') : this.attr({'class' : className});
	},
	/**
	 * addClass('cl1 cl2')
	 * addClass(['cl1', 'cl2'])
	 */
	addClass	: function(){
		var cls	= _prepClassArgs(arguments);
		this.eachTag(ele => ele.classList.remove.apply(ele.classList, cls));
	},
	/**
	 * removeClass('cl1 cl2')
	 * removeClass(['cl1', 'cl2'])
	 */
	removeClass	: function(){
		var cls	= _prepClassArgs(arguments);
		this.eachTag(ele => ele.classList.remove.apply(ele.classList, cls));
	},
	/**
	 * .hasClass('cl')			if the first element has this class
	 * .hasClass('cl1 cl2')		if the first element has those classes
	 * .hasClass(['cl1', 'cl2'])		if the first element has those classes
	 * .all.hasClass('cl')		if all elements has this class
	 * .or.hasClass('cl')		if some element has this class
	 */
	hasClass	: function(){
		var cls		= _prepClassArgs(arguments);
		return this.predicate( ele => cls.every( c => ele.classList.contains(c) ) );
	},
	/**
	 * toggleClass('className', force)
	 */
	toggleClass	: function(className, force){
	 	var lst	= _prepClassArgs(arguments);

	 	this.eachTag(
	 		arguments.length === 1 ?
	 		ele => { lst.forEach(c => ele.classList.toggle(c)) }
	 		: ele => { lst.forEach(c => ele.classList.toggle(c, force)) }
	 	);
	}
});
function _prepClassArgs(args){
	var cls	= args[0];
	if(typeof cls === 'string')
		cls	= cls.trim().split(/\s+/);
	else if(!Array.isArray(cls))
		throw new Error('Incorrect arguments');
	return cls;
}
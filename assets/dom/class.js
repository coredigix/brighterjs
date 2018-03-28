$$.plugin({
	/**
	 * .className()				: get the className of the fist eleemnt
	 * .className(className)	: set the className of all elements
	 * .all.className()			: get all elements className as a list
	 * @return { string} classes joined by space
	 */
	className		: function(className){
		return arguments.length === 0 ? this.attr('class') : this.attr({'class' : className});
	},
	/**
	 * .addClass('cl1', 'cl2')
	 * .addClass(['cl1', 'cl2'])
	 * @return self
	 */
	addClass	: function(cls){
		if(!Array.isArray(cls))
			cls	= Array.from(arguments);
		return this.forEach(tag => tag.classList.add.apply(tag.classList, cls));
	},
	/**
	 * removeClass('cl1', 'cl2')
	 * removeClass(['cl1', 'cl2'])
	 */
	removeClass	: function(cls){
		if(!Array.isArray(cls))
			cls	= Array.from(arguments);
		this.forEach(tag => tag.classList.remove.apply(tag.classList, cls));
	},
	/**
	 * .hasClass('cl')				if the first element has this class
	 * .hasClass('cl1', 'cl2')		if the first element has those classes
	 * .hasClass(['cl1', 'cl2'])	if the first element has those classes
	 * .all.hasClass('cl')			if all elements has this class
	 * .or.hasClass('cl')			if some element has this class
	 * .not.hasClass				inverse
	 */
	hasClass	: function(cls){
		if(!Array.isArray(cls))
			cls	= Array.from(arguments);
		return this.predicate( ele => cls.every( c => ele.classList.contains(c) ) );
	},
	/**
	 * .toggleClass('class1')    			add class1 if not exist, otherwise remove it
	 * .toggleClass('className', force)		add className if force === true, remove it otherwise
	 * .toggleClass(['cl1', 'cl2'], force)
	 * .
	 */
	toggleClass	: function(className, force){
		if(Array.isArray(className)){
			this.forEach(tag => {
				className.forEach( tag => tag.classList.toggle(className, force) );
			});
		}
		else this.forEach( tag => tag.classList.toggle(className, force) );
	 	return this;
	}
});
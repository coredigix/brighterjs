$$.plugin({
	// get or set attributes
	// attr()				// returns list of all attributes names
	// attr('attrName')		// get attribute value
	// all.attr('attrName')
	// attr({key: value})	// set attributes
	attr	: function(attrs){
		var ele, result;
		if(arguments.length === 1){
			// get values
			if(typeof attrs === 'string')
				result	= this.get(ele => ele.getAttribute(attrs)) // .all. is supported inside "get" method
			// set attributes
			else {
				this.forEach(ele => {
					for(ele in attrs)
						ele.setAttribute(ele, attrs[ele]);
				});
				result = this;
			}
		}
		// return attributes name list
		else if(arguments.length === 0)
			result	= this.get(ele => ele.getAttributeNames()); // .all. is supported inside "get" method
		else throw new Error('uncorrect arguments length');
		return result;
	},
	/**
	 * if elements has this attribute
	 * .hasAttr('attrName')			if the first element has this attribute
	 * .all.hasAttr('attrName')		if the all elements have this attribute
	 * .or.hasAttr('attrName')		if the some element has this attribute
	 * .not.hasAttr('attrName')		has not this attribute
	 */
	// hasAttr('attrName')
	// .or.hasAttr('attrName')
	hasAttr	: function(attrName){
		return this.predicate(ele => ele.hasAttribute(attrName));
	},
	removeAttr: function(attrName){
		this.forEach(tag => {
			tag.removeAttribute(attrName);
		});
		return this;
	},
	// .property('href')		get property value of the first element
	// .all.property('href')	get property value of all elements
	property	: function(propName){
		return this.get(tag => tag[propName]);
	}
});
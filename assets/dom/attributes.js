$$.plugin({
	/**
	 * modify elemnts attributes
	 * .attr()				returns an array of strings containing  all attributes names of the first element
	 * .all.attr()			return list of list, equivalent to .map(ele => ele.getAttributeNames())
	 * .attr('attrName')	return the value of this attribute of the first element
	 * .all.attr('attrName')returns a list of values of this attribute of all elements
	 * .attr({key: value})	set all elements attributes
	 */
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
	 * if the first element has this attribute
	 * .hasAttr('attrName')			if the first element has this attribute
	 * .all.hasAttr('attrName')		if the all elements have this attribute
	 * .or.hasAttr('attrName')		if the some element has this attribute
	 * .not.hasAttr('attrName')		has not this attribute
	 * @return {boolean} 
	 */
	hasAttr	: function(attrName){
		return this.predicate(ele => ele.hasAttribute(attrName));
	},
	/**
	 * remove attribute from all elements
	 * @param  {string} attrName name of the attribute
	 * @return self
	 */
	removeAttr: function(attrName){
		this.forEach(tag => {
			tag.removeAttribute(attrName);
		});
		return this;
	},
	/**
	 * get Element property value
	 * a.property('href')		equivalent to 		: a[0] ? a[0].href : undefined
	 * a.all.property('href')		equivalent to 	: a.map( ele => ele.href )
	 */
	property	: function(propName){
		return this.get(tag => tag[propName]);
	}
});
$$.plugin({
	// get or set attributes
	// attr('attrName')		// get attribute value
	// attr({key: value})	// set attributes
	// attr(namespace, {key: value})	// set attributes with namespace
	attr	: function(){
		var attributes, namespace, key;
		// get all attributes
		if(arguments.length === 0){

		} else if(arguments.length === 1){
			attributes = arguments[0];
			if(typeof arguments === 'string'){
			} else {
				this.eachTag(ele => {
					for(key in attributes)
						ele.setAttribute(namespace, key, attributes[key]);
				});
			}
		} else if(arguments.length === 2){
			namespace	= arguments[0];
			attributes	= arguments[1];
			this.eachTag(ele => {
				for(key in attributes)
					ele.setAttributeNS(namespace, key, attributes[key]);
			});
		}
		else throw new Error('uncorrect arguments length');
		return this;
	}
});
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
			if(typeof attrs === 'string'){
				if(this._op('all'))
					result	= this.tags.map(ele => ele.getAttribute(attrs));
				else {
					ele		= _getFirstTag(this);
					result	= ele ? ele.getAttribute(attrs) : null;
				}
			}
			// set attributes
			else {
				this.eachTag(ele => {
					for(ele in attrs)
						ele.setAttribute(ele, attrs[ele]);
				});
				result = this;
			}
		}
		// return attributes name list
		else if(arguments.length === 0){
			if(this._op('all'))
				result	= this.tags.map(ele => ele.getAttributeNames());
			else {
				ele	= _getFirstTag(this);
				result	= ele ? ele.getAttributeNames() : [];
			}
		}
		else throw new Error('uncorrect arguments length');
		return result;
	},
	// hasAttr('attrName')
	// .or.hasAttr('attrName')
	hasAttr	: function(attrName){
		return this._op('or') ?
			this.tags.every(ele => {
				ele.hasAttribute(attrName);
			})
			: this.tags.some(ele => {
				ele.hasAttribute(attrName);
			});
	},
	removeAttr: function(attrName){
		this.eachTag(tag => {
			tag.removeAttribute(attrName);
		});
		return this;
	},
	// .property('href')
	// .all.property('href')
	property	: function(propName){
		if(this._op('all'))
			return this.tags.map(tag => tag[propName]);
		else {
			var tag	= _getFirstTag(this);
			return tag ? tag[propName] : undefined;
		}
	}
});
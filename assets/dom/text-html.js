$$.plugin({
	/**
	 * get text
	 * .text()				// get first element text
	 * .all.text()			// get all elements text as array
	 * .text('some text')	// set all elements text
	 */
	text	: function(text){
		if(arguments.length === 0)
			return this.tagOperation(tag => tag.innerText);
		else
			this.eachTag(tag => { tag.innerText = text });
		return this;
	},

	get html(){ return this.tagOperation(tag => tag.innerHTML) },

	get outerHTML(){ return this.tagOperation(tag => tag.outerHTML) }
});
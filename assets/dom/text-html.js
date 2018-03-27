$$.plugin({
	/**
	 * get text
	 * .text()				// get first element text
	 * .all.text()			// get all elements text as array
	 * .text('some text')	// set all elements text
	 */
	text	: function(text){
		if(arguments.length === 0)
			return this.get(tag => tag.innerText);
		else
			return this.forEach(tag => tag.innerText = text);
	},

	/**
	 * see "get" method for all alternatives
	 * html
	 * .all.html
	 */
	html	: function(html){
		if(arguments.length === 0)
			return this.get(tag => tag.innerHTML);
		else
			return this.forEach(tag => tag.innerHTML = html);
	},

	/**
	 * see "get" method for all alternatives
	 * outerHTML
	 * .all.outerHTML
	 */
	get outerHTML(){ return this.get(tag => tag.outerHTML) }
});
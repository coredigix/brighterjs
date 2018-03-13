$$.plugin({
	/**
	 * .clone()		clone object deeply and with data events
	 * .clone(boolean) // all options to this boolean value
	 * .clone({
	 * 		events	: boolean, // default true
	 * 		data	: true, false, 'deep', // default true
	 * })
	 */
	clone	: function(options){
		this.map(element => {
			// clone node deeply
				element	= element.cloneNode(true);
			//TODO clone events and data
			// return
				return element;
		});
	}
});
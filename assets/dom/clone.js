$$.plugin({
	/**
	 * .clone()			clone object deeply and with data events
	 * .clone(false)	clone HTML only, do not add events and data
	 */
	clone	: function(cloneData){
		return this.$map(element => {
			// clone node deeply
				element	= element.cloneNode(true);
			//TODO clone events and data
			// return
				return element;
		});
	}
});
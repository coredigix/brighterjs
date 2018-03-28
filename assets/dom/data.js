/**
 * this api allow us to associate data to HTMLElements
 */

$$.plugin({
	/**
	 * get/set data associated with an HTML element
	 * .data()				// returns object representing all stored data on the first element
	 * .all.data()			// return list of object representing all stored data on all elements
	 *
	 * .data('key')			// get this associated data
	 * .data('key', value) 	// set data
	 */
	data(key, value){
		var data;
		// return all data
		if(arguments.length > 3) throw new Error('Illegal arguments');
		// set data value of all elements
		else if(arguments.length === 3)
			return this.forEach(ele => {
				data	= htmlElementData[ele];
				if(data === undefined)
					data	= htmlElementData[ele] = {};
				data[key]	= value;
			});
		else
			return this.get(ele => {
				// init
				data	= htmlElementData[ele];
				if(data === undefined)
					data	= htmlElementData[ele] = {};
				// get only specified data
				if(arguments.length === 1)
					data	= data[key];
				return data;
			});
	}
});

const htmlElementData	= new WeakMap();
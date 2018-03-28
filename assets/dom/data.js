/**
 * this api allow us to associate data to HTMLElements
 */

$$.plugin({
	/**
	 * get/set data associated with an HTML element
	 * .data.
	 * .all.data.
	 * @return {[type]} [description]
	 */
	get data(){
		return this.get(ele => {
			var data	= htmlElementData[ele];
			if(data === undefined)
				data	= htmlElementData[ele] = {};
			return data;
		});
	}
});

const htmlElementData	= new WeakMap();
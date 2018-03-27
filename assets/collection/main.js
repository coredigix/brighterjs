
class $$Collection extends Array {
	get [Symbol.isConcatSpreadable](){ return true; }
	// make array concat spreadable
	// get [ArrayUtils.spreadable](){ return true; }
	// get [ArrayUtils.preProcess](ele){
	// 	if(!Reflect.has(ele, 'nodeType'))
	// 		ele	= $$(ele)[0];
	// 	return ele;
	// }
	// get [ArrayUtils.control](ele){
	// 	if(!Reflect.has(ele, 'nodeType'))
	// 		ele	= $$(ele)[0];
	// 	return this.indexOf(ele) === -1;
	// }

	/**
	 * clone the collection
	 * we use "for" instead of "slice" and "push.apply" because it's faster
	 */
	duplicate(){
		// var lst	= [];
		// for(var i = 0, len = this.length; i < len; ++i)
		// 	lst.push(this[i]);
		// return lst;
		//we do not need this speed, so we use slice
		return this.slice(0);
	}

	/** remove all elemnts */
	clear(){
		this.splice(0);
		return this;
	}

	/**
	 * each			iterate on the list
	 * rtl.each	iterate right to left
	 */
	each(cb){
		var i, len = this.length;
		if(this._op('rtl') === true)
			for(i = len - 1; i >= 0; --i){
				if(cb(this[i], i) === false)
					break;
			}
		else
			for(i=0; i < len; ++i){
				if(cb(this[i], i) === false)
					break;
			}
		return this;
	}

	/**
	 * forEach
	 * rtl.forEach	iterate right to left
	 */
	forEach(cb){
		var i, len = this.length;
		if(this._op('rtl') === true)
			for(i = len - 1; i >= 0; --i)
				cb(this[i], i);
		else
			for(i=0; i < len; ++i)
				cb(this[i], i);
		return this;
	}

	/**
	 * get new collection without duplicates
	 */
	unique(){
		return this.filter((ele, indx) => {
			return this.indexOf(ele) === indx;
		});
	}

	/**
	 * Alternative of [*] that accepts negative values
	 * -1 referer to the last element in the collection
	 */
	eq(index){
		if(index < 0)
			index += this.length;
		return this[index];
	}

	concat(){ super.concat($$(arguments))}

	splice(start, rmCount){
		if(arguments.length > 2){
			var args = $$(Array.slice.call(arguments, 2));
			super.unshift.call(args, start, rmCount);
			super.splice.apply(this, args);
		}
		else super.splice(start, rmCount);
	}

	push(){
		var lst	= $$(arguments).filter(ele => this.indexOf(ele) === -1);
		if(lst.length > 0)
			super.push.apply(this, lst);
		return this;
	}

	unshift(){
		var lst	= $$(arguments).filter(ele => this.indexOf(ele) === -1);
		if(lst.length > 0)
			super.unshift.apply(this, lst);
		return this;
	}

	/**
	 * @param  {HTMLElement} ele
	 * @return {boolean}     true if this list contains this HTMLElement
	 */
	contains(ele){
		return this.indexOf(ele) !== -1;
	}
}
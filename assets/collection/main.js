
class $$BrighterJs extends Array {
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

	/** remove all elements */
	clear(){
		this.splice(0);
		return this;
	}

	/**
	 * each			iterate on the list, break when callback returns false
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
	 * forEach, iterate on the array, do not break
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

	/**
	 * Array::concat equivalent
	 */
	concat(){ super.concat($$(arguments))}

	/**
	 * see Array::splice for more details
	 * @return { array} an array containing removed items
	 */
	splice(start, rmCount){
		if(arguments.length > 2){
			var args = $$(Array.slice.call(arguments, 2));
			super.unshift.call(args, start, rmCount);
			super.splice.apply(this, args);
		}
		else super.splice(start, rmCount);
	}

	/**
	 * add element if not already exists
	 */
	add(){
		if(
			arguments.length === 1
			&& _isValidElement(arguments[0]) === true
			&& this.indexOf(arguments[0]) === -1
		)
			super.push.call(this, arguments[0]);
		else{
			var lst	= $$(arguments).filter(ele => this.indexOf(ele) === -1);
			if(lst.length > 0)
				super.push.apply(this, lst);
		}
		return this;
	}

	/**
	 * push new item to the array
	 * @return self
	 */
	push(){
		if(
			arguments.length === 1
			&& _isValidElement(arguments[0]) === true
			// && this.indexOf(arguments[0]) === -1
		)
			super.push.call(this, arguments[0]);
		else{
			var lst	= $$(arguments); //.filter(ele => this.indexOf(ele) === -1);
			if(lst.length > 0)
				super.push.apply(this, lst);
		}
		return this;
	}

	/**
	 * unsift an item
	 * @return {[type]} [description]
	 */
	unshift(){
		if(
			arguments.length === 1
			&& _isValidElement(arguments[0]) === true
		)
			super.unshift.call(this, arguments[0]);
		else{
			var lst	= $$(arguments);//.filter(ele => this.indexOf(ele) === -1)
			if(lst.length > 0)
				super.unshift.apply(this, lst);
		}
		return this;
	}

	/**
	 * @param  {HTMLElement} ele
	 * @return {boolean}     true if this list contains this HTMLElement
	 */
	contains(ele){
		return this.indexOf(ele) !== -1;
	}

	/**
	 * map elements, faster and returns an Array
	 * instead of using [Symbol.species] that will affect other methodes
	 */
	map(cb) {
		var result = [],
			i,
			len = this.length;
		for(i=0; i < len; ++i)
			result.push(cb(this[i], i, this));
		return result;
	}
	/**
	 * alternative to map, it returns a brighter object, and teste if returned elements are valide HTMLElements
	 */
	$map(cb){
		var result = new $$BrighterJs();
			i,
			len = this.length;
		for(i=0; i < len; ++i)
			result.add(cb(this[i], i, this));
		return result;
	}
}

const $$prototype  = $$.prototype	= $$BrighterJs.prototype;



class $$Collection	extends ArrayUtils {
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

	concat(){ super.concat($$(arguments))}

	splice(start, rmCount){
		if(arguments.length > 2)
			super.splice(start, nbrCount, $$(Array.slice.call(arguments, 2)));
		else super.splice(start, nbrCount);
	}

	push	: function(){
		var lst	= $$(arguments).filter(ele => this.indexOf(ele) === -1);
		if(lst.length > 0)
			super.push.apply(this, lst);
		return this;
	}
	unshift	: function(){
		var lst	= $$(arguments).filter(ele => this.indexOf(ele) === -1);
		if(lst.length > 0)
			super.unshift.apply(this, lst);
		return this;
	}
}
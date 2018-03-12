const _COLLECTIONOP	= {
	all	: Symbol(),
	not	: Symbol(),
	or	: Symbol()
};


class $$Collection	extends ArrayUtils {
	// make array operations spreadable
	get [Symbol.isConcatSpreadable](){ return true; }

	push(){ super.push($$(arguments)); }
	unshift(){ super.unshift($$(arguments)); }

	concat(){ super.concat($$(arguments))}

	splice(start, rmCount){
		if(arguments.length > 2)
			super.splice(start, nbrCount, $$(Array.slice.call(arguments, 2)));
		else super.splice(start, nbrCount);
	}


	first(){ return $$(super.first.call(arguments)); }
	last(){ return $$(super.last.call(arguments)); }
	firstTag(predicat, start, end){ return $$(super.first(ele => ele && ele.nodeType === 1 && predicat, start, end)) }
	lastTag(predicat, start, end){ return $$(super.last(ele => ele && ele.nodeType === 1 && predicat, start, end)) }

	// Each
	// each tag (tag only, exclude attributeNode, commentNode, textNode, ...)
	eachTag(cb){
		return this.each(ele => ele && ele.nodeType === 1 ? cb(ele, i) : true );
	}

	get tags(){
		return this.filter(ele => ele && ele.nodeType === 1);
	}

	// operators
	get all(){
		this[_COLLECTIONOP.all] = true;
		return this;
	}
	get or(){
		this[_COLLECTIONOP.or] = true;
		return this;
	}
	get not(){
		this[_COLLECTIONOP.not] = true;
		return this;
	}
	_op(op, fxTrue, fxFalse){
		if(this[_COLLECTIONOP[op]] === true){
			this[_COLLECTIONOP[op]] = false;
			fxTrue();
		}
		else fxFalse;
		return this;
	}
}
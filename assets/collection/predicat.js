const _COLLECTIONOP	= {
	all	: Symbol(),
	not	: Symbol(),
	or	: Symbol(),
	rtl	: Symbol() // fx each will begin from right to left
};

$$.plugin({
	/**
	 * execute a predicat on the collection
	 * used as backend for somme functions like: hasAttr
	 * .predicate(condition)		returns true if the first element matches the predicate
	 * .all.predicate(condition)	returns true if all elements matches the predicate
	 * .or.predicate(condition)		returns true if somme element matches the predicate
	 * .not.predicate(condition)	invert the condition state
	 */
	predicate	: function(predicat){
		var result;
		if(this._op('all') === true)
			result = this.every(predicat);
		else if(this._op('or') === true)
			result = this.some(predicat);
		else if(this.length === 0)
			result = false;
		else
			result = predicat(this[0]);
		
		if(this._op('not') === true)
			result = !result;
		return result;
	},

	// operators
	get all(){
		this[_COLLECTIONOP.all]	= true;
		this[_COLLECTIONOP.or] 	= false;
		return this;
	},
	get or(){
		this[_COLLECTIONOP.or]	= true;
		this[_COLLECTIONOP.all]	= false;
		return this;
	},
	get not(){
		this[_COLLECTIONOP.not] = true;
		return this;
	},
	get rtl(){
		this[_COLLECTIONOP.rtl] = true;
		return this;
	},
	
	_op(op){
		var flag = this[_COLLECTIONOP[op]];
		this[_COLLECTIONOP[op]] = false;
		return flag;
	}
});
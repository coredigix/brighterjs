const _COLLECTIONOP	= {
	all	: Symbol(),
	not	: Symbol(),
	or	: Symbol()
};

$$.plugin({
	predicate	: function(predicat){
		if(this._op('not'))
			predicat	= (ele => !predicat(ele));
		
		if(this._op('all'))
			return this.every(predicat);
		else if(this._op('or'))
			return this.some(predicat);
		else return this.first().every(predicat);
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
	_op(op, fxTrue, fxFalse){
		if(this[_COLLECTIONOP[op]] === true){
			this[_COLLECTIONOP[op]] = false;
			fxTrue();
		}
		else fxFalse;
		return this;
	}
});
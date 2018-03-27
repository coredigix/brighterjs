function assert(predicat, errMsg){
	if(!predicat){ // predicat === false || predicat === 0 || predicat === '' ||  predicat === undefined || predicat === null
		if(arguments.length <= 1)
			throw new Error('Assertion fails');
		else if(typeof errMsg === 'string')
			throw new Error(errMsg);
		else throw errMsg;
	}
}

$$.rootPlugin({
	assert	: assert
});
function assert(predicat, errMsg){
	if(!predicat){
		if(typeof errMsg === 'string')
			throw new Error(errMsg);
		else if(!errMsg)
			throw new Error('Assertion fails');
		else throw errMsg;
	}
}

$$.rootPlugin({
	assert	: assert
});
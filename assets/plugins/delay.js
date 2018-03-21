/**
 * setting promise delay
 */

function delay(tme){
	var p;
	p	= new Promise((resolve, reject) => {
		p.resolve	= resolve;
		p.reject	= reject;

		if(tme === 0) resolve();
		else setTimeout(() => resolve(), tme);
	});
	return p;
}

$$.plugin({
	delay	: delay
});
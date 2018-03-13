// create fragment
$$.rootPlugin({
	get fragment(){ return $$(document.createDocumentFragment()) }
});

// put all elements into fragment
$$.plugin({
	get toFragment(){
		var frag	= document.createDocumentFragment();
		this.each(ele => { frag.appendChild(ele) });
		return $$(frag);
	}
});
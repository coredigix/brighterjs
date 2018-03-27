// create fragment
$$.rootPlugin({
	get fragment(){ return $$(document.createDocumentFragment()) }
});

// put all elements into fragment
$$.plugin({
	toFragment(){
		var frag	= document.createDocumentFragment();
		this.forEach(ele => frag.appendChild(ele) );
		return $$(frag);
	}
});
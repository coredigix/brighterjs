$$.plugin({
	/**
	 * get a new collection with parents of current elements
	 */
	get parent(){
		return this.$map(ele => ele.parentNode);
	},
	// get a new collection with offsetParents of current elments
	get offsetParent(){
		return this.$map(ele => ele.offsetParent);
	},

	/**
	 * get all parents until the selected one
	 * .parentsUntil(selector)
	 * .parentsUntil(function)	// stop when returns false
	 * .parentsUntil(HTMLElement)
	 * .parentsUntil(ArrayLike)
	 *
	 * .all.parentsUntil	// include the selected parent
	 * .not.parentsUntil	// get other parents until document
	 */
	parentsUntil		: function(){ throw new Error('Unimplemented!') }, //TODO
	offsetParentsUntil	: function(){ throw new Error('Unimplemented!') }, //TODO

	// get a new collection mapping current elements with theres children
	get children(){ return _getChilds(this, 'children'); },
	get childNodes(){ return _getChilds(this, 'childNodes'); }

	// parents(filter)
	// closest parent(selector)
	// hasParent
});

function _getChilds($obj, attrName){
	var childs	= [], tagChilds, child;
	$obj.forEach(tag => {
		tagChilds	= tag[attrName];
		if(tagChilds){
			for(var i = 0, len = tagChilds.length; i < len; ++i){
				child	= tagChilds.item(i);
				if(childs.indexOf(child) === -1)
					childs.push(child);
			}
		}
	});
	return $$(childs);
}
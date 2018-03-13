$$.plugin({

	first	: function(){ return $$(super.first.call(arguments)); },
	last	: function(){ return $$(super.last.call(arguments)); },
	firstTag: function(predicat, start, end){ return $$(super.first(ele => ele && ele.nodeType === 1 && predicat, start, end)) },
	lastTag	: function(predicat, start, end){ return $$(super.last(ele => ele && ele.nodeType === 1 && predicat, start, end)) },

	// Each
	// each tag (tag only, exclude attributeNode, commentNode, textNode, ...)
	eachTag	: function(cb){
		return this.each(ele => ele && ele.nodeType === 1 ? cb(ele, i) : true );
	}

	get tags(){
		return this.filter(ele => ele && ele.nodeType === 1);
	}
});


// get first tag
function _getFirstTag(tab){
	return Array.prototype.find.call(tab, ele => ele.nodeType === 1);
}
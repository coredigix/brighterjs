/**
 * find inside element
 */

$$.rootPlugin({
	/**
	 * use brighter selector, slower
	 */
	find	: function(selector){ return $$(_find(document, selector)); },
	findAll	: function(selector){ return $$(document.querySelectorAll(selector)); },

	/**
	 * use native selector, faster
	 */
	query	: function(selector){ return $$(_find(document, selector)); },
	queryAll: function(selector){ return $$(document.querySelectorAll(selector)); }
});
$$.plugin({
	find	: function(selector){
		return $$( this.$map(tag => _find(tag, selector)) ).unique();
	},
	findAll	: function(selector){
		return $$( this.$map(tag => tag.querySelectorAll(selector)) ).unique();
	},

	query	: function(selector){
		return $$( this.$map(tag => _find(tag, selector) ) ).unique();
	},
	queryAll: function(selector){
		return $$( this.$map(tag => tag.querySelectorAll(selector)) ).unique();
	}
});

/**
 * return element or null
 */
function _find(parent, selector){
	return parent.querySelector(selector);
}
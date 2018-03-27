/**
 * find inside element
 */

$$.rootPlugin({
	/**
	 * use brighter selector, slower
	 */
	find	: function(selector){ return $$(document.querySelector(selector)); },
	findAll	: function(selector){ return $$(document.querySelectorAll(selector)); },

	/**
	 * use native selector, faster
	 */
	query	: function(selector){ return $$(document.querySelector(selector)); },
	queryAll: function(selector){ return $$(document.querySelectorAll(selector)); }
});
$$.plugin({
	find	: function(selector){
		return $$( this.map(tag => tag.querySelector(selector)) ).unique();
	},
	findAll	: function(selector){
		return $$( this.map(tag => tag.querySelectorAll(selector)) ).unique();
	},

	query	: function(selector){
		return $$( this.map(tag => tag.querySelector(selector)) ).unique();
	},
	queryAll: function(selector){
		return $$( this.map(tag => tag.querySelectorAll(selector)) ).unique();
	}
});
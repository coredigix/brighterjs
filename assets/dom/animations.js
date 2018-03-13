$$.plugin({
	/**
	 * 
	 */
	transition	: function(){}, //TODO
	transitionP	: function(){}, // transition and returns promise
	/**
	 * 
	 */
	animate		: function(){} //TODO
	animateP	: function(){} //Animate and returns promise

	/**
	 * fade()		: fade toggle
	 * fade(1)		: fadeIn
	 * fade(0)		: fadeOut
	 * fade(0.5)	: fade to 0.5
	 */
	fade		: function(opacity, duration, cb){}, //TODO
	/**
	 * 
	 */
	slide		: function(){}, //TODO
	/**
	 * vertical slide
	 */
	vSlide		: function(){}, //TODO
	/**
	 * stop all animations
	 */
	stop		: function(){}, //TODO
	/**
	 * reset animations
	 */
	reset		: function(){}, //TODO
	/**
	 * skip all animations
	 */
	skip		: function(){} //TODO
});
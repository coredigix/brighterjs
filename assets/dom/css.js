/**
 * uniteless attributes
 */
const CSS_UNITE_LESS= {
	animationIterationCount		: 1,
	'animation-iteration-count'	: 1,
	columnCount					: 1,
	'column-count'				: 1,
	fillOpacity					: 1,
	'fill-opacity'				: 1,
	flexGrow					: 1,
	'flex-grow'					: 1,
	flexShrink					: 1,
	'flex-shrink'				: 1,
	fontWeight					: 1,
	'font-weight'				: 1,
	lineHeight					: 1,
	'line-height'				: 1,
	opacity						: 1,
	order						: 1,
	orphans						: 1,
	widows						: 1,
	zIndex						: 1,
	zoom						: 1
};


/**
 * modify the style of the selected items
 * 	.css()				// get computed style of the first tag
 *  .all.css()			// return a list mapping all elements with previous options
 *  .css(':before')		// get before or after style
 * 	.css({key: value})	// set thos attributes to all selected tags
 */
$$.plugin({
	css	: function(css){
		var computedStyle;
		// get computed style
		if(arguments.length === 0)
			computedStyle = this.get(ele => window.getComputedStyle(ele));
		// get pseudo element style
		else if(typeof css === 'string'){
			css	= css.toLowerCase();
			if(css != ':after' && css != ':before')
				throw new Error('Illegal arguments');
			computedStyle = this.get(ele => window.getComputedStyle(ele, css));
		}
		// set style
		else
			computedStyle = this.style(css);
		return computedStyle;
	},
	/**
	 * the difference between style and css, is when returns values, style returns reel value in element style attributes
	 * and do not use window.computed style, style do not access pseudo elements styles too
	 * 	.style()			// get element style
	 *  .all.style()		// return a list mapping all elements with previous options
	 * 
	 * 	.style({key: value})	// set thos attributes to all selected tags
	 */
	style	: function(arg){
		var stl, i;
		// get style
		if(arguments.length === 0)
			stl	= this.get(ele => ele.style);
		
		// set style
		else {
			// fix style
			for(i in arg){
				if((typeof arg[i] === 'number') && !CSS_UNITE_LESS.hasOwnProperty(i))
					arg[i]	+= 'px';
			}
			// apply for all elements
			this.forEach(ele => {
				for(i in arg)
					ele.style[i] = arg[i];
			});
			stl	= this;
		}
		return stl;
	},
	/**
	 * remove css property
	 * .removeStyle('style')
	 * .removeStyle('style1', 'style2', ...)
	 */
	removeStyle	: function(){
		var i, len = arguments.length;
		this.forEach(ele => {
			for(i=0; i<len; ++i)
				ele.style.removeProperty(arguments[i]);
		});
		return this;
	},
	/**
	 * width()
	 * all.width()
	 * width(width)
	 * all.width(width)
	 */
	width	: function(width){
		if(arguments.length === 0)
			return this.css().width;
		else return this.style({width: width});
	},
	/**
	 * height()
	 * all.height()
	 * height(height)
	 * all.height(height)
	 */
	height	: function(height){
		if(arguments.length === 0)
			return this.css().height;
		else return this.style({height: height});
	},
	/**
	 * offsetWidth()
	 * all.offsetWidth()
	 */
	get offsetWidth(){ return this.property('offsetWidth') },
	/**
	 * offsetHeight()
	 * all.offsetHeight()
	 */
	get offsetHeight(){ return this.property('offsetHeight') },
	/**
	 * get the position relative to the document
	 */
	position	: function(position){
		return this.get(ele => {
			var result	= {
				top	: 0,
				left: 0
			};
			do{
				if(!isNaN(ele.offsetTop))
					result.top	+= ele.offsetTop;
				if(!isNaN(ele.offsetLeft))
					result.left	+= ele.offsetLeft;
			} while(ele = ele.offsetParent);
			return result;
		});
	},
	/**
	 * get coordination relative to the offset parent
	 * all.offset()
	 */
	offset		: function(){
		return this.get(ele => ({top: ele.offsetTop, left: ele.offsetLeft}));
	},

	/////
	// SCROLL
	/////
	scrollLeft(value, animDuration){
		if(arguments.length === 0)
			return this.property('scrollLeft');
		else {
			this.property('scrollLeft', value);
			//TODO add animation
			return this;
		}
	},
	scrollTop(value, animDuration){
		if(arguments.length === 0)
			return this.property('scrollTop');
		else {
			this.property('scrollTop', value);
			//TODO add animation
			return this;
		}
	},
	// get scrollWidth(){
	// 	return value === undefined ? this.property('scrollWidth') : this.property('scrollWidth', value);
	// },
	// get scrollHeight(){
	// 	return value === undefined ? this.property('scrollHeight') : this.property('scrollHeight', value);
	// },
	/**
	 * see events.scroll
	 * scroll(callBack, optionalBollAnimate)			: listener onscroll
	 * scroll(y, optionalBollAnimate)					: equivalent to scrollTop(y)
	 * scroll(x, y, optionalBollAnimate)				: scroll to (x, y)
	 * scroll({top: y, left: x}, optionalBollAnimate)	: scroll to (x, y)
	 */
});
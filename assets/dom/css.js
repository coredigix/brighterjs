/**
 * uniteless attributes
 */
const _cssUniteLess= {
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
 * 	.css('styleAttr')	// returns the computed value of the first tag, if "all" is set, return a list of all elements
 *  .all.css(...)		// return a list mapping all elements with previous options
 * 
 * 	.css({key: value})	// set thos attributes to all selected tags
 */
$$.plugin({
	css	: function(arg, arg2){
		var i, ele, computedStyle;
		// if get the computed style
			if(arguments.length === 0 || (typeof arg === 'string')){
				// if we want the element or its pseudo-element
					if(!arg)
						arg	= null;
					else if(arg.charAt(0) != ':'){
						arg2	= arg;
						arg		= null;
					}
				// op
				var op	= (ele => {
					var result	= window.getComputedStyle(ele, arg);// on peu ajouter le pseudo aussi
				});
				// if "all" is specified, get all computed styles inside a list
				if(this._op('all')){
					computedStyle	= this.mapTags(ele => {
						var result	= window.getComputedStyle(ele, arg);// on peu ajouter le pseudo aussi
						//get specifique property if required
							if(arg2)
								result	= result.getPropertyValue(arg2);
						return result;
					});
				}else{
					var ele	= this.getFirstTag();
					if(ele){
						computedStyle	= window.getComputedStyle(ele, arg);// on peu ajouter le pseudo aussi
						//get specifique property if required
							if(arg2)
								computedStyle	= computedStyle.getPropertyValue(arg2);
					}
				}
				return computedStyle;
			}
		// else if set style attribute
			else{
				// add px if required
					for(i in arg){
						if((typeof arg[i] === 'number') && !_cssUniteLess.hasOwnAttribute(i))
							arg[i]	+= 'px';
					}
				// apply to all elements
				this.eachTag(ele =>{
					for(i in arg)
						ele.style[i]	= arg[i];
				});
			}
		return this;
	},
	/**
	 * the difference between style and css, is when returns values, style returns reel value in element style attributes
	 * and do not use window.computed style, style do not access pseudo elements styles too
	 * 	.style()				// get element style
	 * 	.style('styleAttr')	// returns the computed value of the first tag, if "all" is set, return a list of all elements
	 *  .all.style(...)		// return a list mapping all elements with previous options
	 * 
	 * 	.style({key: value})	// set thos attributes to all selected tags
	 */
	style	: function(arg){
		var result;
		if(!arg || typeof arg == 'string'){
			if(this._all)
				result	= this.mapTags(arg ?
					(ele => { return ele.style[arg]; })
					:(ele => { return ele.style; })
				);
			else{
				result	= this.getFirstTag();
				if(result)
					result	= arg ? result.style[arg] : result.style;
			}
		}
		else
			result	= this.css(arg); // use css to insert values
		return result;
	},
	// remove css property
	rmStyle	: function(){
		var i, c= arguments.length;
		return this.eachTag(ele => {
			for(i=0; i<c; ++i)
				ele.style.removeProperty(arguments[i]);
		});
	},
	/**
	 * width()
	 * all.width()
	 * width(width)
	 * all.width(width)
	 */
	width	: function(width){ return this.css(width && {width: width} || 'width'); },
	/**
	 * height()
	 * all.height()
	 * height(height)
	 * all.height(height)
	 */
	height	: function(height){ return this.css(height && {height: height} || 'height'); },
	/**
	 * offsetWidth()
	 * all.offsetWidth()
	 */
	offsetWidth: function(){ return _elementsAttr.call(this, 'offsetWidth'); },
	/**
	 * offsetHeight()
	 * all.offsetHeight()
	 */
	offsetHeight: function(){ return _elementsAttr.call(this, 'offsetHeight'); },
	/**
	 * set/get the style.position
	 */
	position	: function(position){ return this.css(position && {position: position} || 'position'); },
	/**
	 * get coordination relative to the offset parent or to the document
	 * offset(true?)
	 * all.offset(true?)
	 */
	offset		: function(isRelativeToDocument){
		var result, ele;
		if(this._all){
			result	= this.mapTags(ele => _getElementOffset(ele, isRelativeToDocument));
		}else{
			ele	= this.getFirstTag();
			if(ele)
				result	= _getElementOffset(ele, isRelativeToDocument);
		}
		return result;
	},
	offsetLeft	: function(isRelativeToDocument){ _offsetTopLeft.call(this, 'offsetLeft', isRelativeToDocument); },
	offsetTop	: function(isRelativeToDocument){ _offsetTopLeft.call(this, 'offsetTop', isRelativeToDocument); },

	/////
	// SCROLL
	/////
	scrollTop	: function(value, animate){
		//TODO animation
		return _elementsAttr.call(this, 'scrollTop', value);
	},
	scrollTop	: function(value, animate){
		//TODO animation
		return _elementsAttr.call(this, 'scrollLeft', value);
	},
	scrollHeight: function(){ return _elementsAttr.call(this, 'scrollHeight'); },
	scrollWidth	: function(){ return _elementsAttr.call(this, 'scrollWidth'); },
	/**
	 * see events.scroll
	 * scroll(callBack, optionalBollAnimate)			: listener onscroll
	 * scroll(y, optionalBollAnimate)					: equivalent to scrollTop(y)
	 * scroll(x, y, optionalBollAnimate)				: scroll to (x, y)
	 * scroll({top: y, left: x}, optionalBollAnimate)	: scroll to (x, y)
	 */
});
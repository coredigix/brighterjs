;(function(){
	'use strict';
	/**
	 * this contains main function of brighter that creates HTML and SVG elements
	 *
	 * 	- $$()						: create an empty brighter object
	 * 	- $$(HTML or SVG element or $$element or jQuery or arrayLike)	: add it
	 * 	- $$(elementName)			: create HTML element
	 * 	- $$(function)				: add this function to be executed when the window is loaded
	 *
	 */
	function $$(arg){
		var result, ele;
		// create empty list
		if(arguments.length === 0)
			result = [];
		else if(arguments.length !== 1) // debug
			throw new Error('this API accepts only one argument');
		// add this function to window load
		else if(typeof arg === 'function')
			$$.document.load(arg); // execute this when the window is loaded
		else {
			result = [];
			_makeElements(arg, result);
		}
		return result;
	}
	const $$prototype  = $$.prototype	= $$Collection.prototype;
	function _makeElements(arg, result){
		// create element
		if(typeof arg === 'string'){
			arg		= createElement(arg);
			if(arg.nodeType === 11) // Node.DOCUMENT_FRAGMENT_NODE
				arg.childNodes.forEach(ele => result.push(ele));
			else result.push(arg);
		}
		// HTMLElement or SVG element
		else if(Reflect.has(arg, 'nodeType') === true)
			result.push(arg);
		// brighterjs object, ArrayLike, jQuery, ...
		else if(Reflect.has(arg, 'length') === true){
			flattenArray(arg).forEach(ele => _makeElements(ele, result) );
			result = Array.prototype.filter.call(arg, ele => _isValidElement);
		}
		else 
			throw new Error('Illegal argument');
	}
	/**
	 * thos functions add plugins to brighter
	 */
	Object.defineProperties($$, {
		rootPlugin	: { value : plugins => _addPlugin(plugins, true), },
		plugin		: { value : plugins => _addPlugin(plugins, false) }
	});
	function _addPlugin(plugins, isRoot){
		var i, dscptr;
		plugins	= Object.getOwnPropertyDescriptors(plugins);
		for(i in plugins){
			dscptr	= plugins[i];
			dscptr.configurable	= false;
			dscptr.enumerable	= false;
			dscptr.writable		= false;
		}
		Object.defineProperties(isRoot ? $$ : $$.prototype, dscptr);
	}
	/**
	 * this function returns true if an element is accepted to be added to the collection
	 */
	const VALID_ELEMENTS = [
		Node.ELEMENT_NODE,
		Node.DOCUMENT_NODE,
		Node.DOCUMENT_FRAGMENT_NODE
	];
	function _isValidElement(element){
		return  VALID_ELEMENTS.indexOf(element.nodeType) !== -1;
	}
		/**
	 * extends element match
	 * elementMatch(htmlElement, 'div.cc')								element matches this selector
	 * elementMatch(htmlElement, function(element) => {return true}) 	element matches this function
	 * elementMatch(htmlElement, HTMLElement) 										match only this element
	 * elementMatch(htmlElement, [HTMLElement])										matches if inside this array
	 */
	function elementMatch(ele, condition){ //TODO add matche css selector
		// match selector
		if(typeof condition === 'string'){}
		// match function
		else if(typeof condition === 'function')
			return condition(ele) === true;
		else if(condition.length){
			// we didn't use "indexOf" because this needs to be applied to ArrayLike lists too
			for(var i =0, len = condition.length; i < len; ++i){
				if(condition[i] === ele)
					return true
			}
			return false;
		}
		else
			return ele === condition;
	}
	/**
	 * matches css selector
	 */
	function matcheSelector(element, selector){}
		$$.plugin({
	/**
	 * filter(selector)							// keep only elements that matches this selector
	 * filter(function)							// keep only elements matched by this function
	 * filter(HTMLElement)						// keep onl this tag if exits
	 * filter([HTMLElement])					// return intersection of this array and current array
	 * filter($$Object | jQuery | arrayLike)	// return intersection of this array and current array
	 * 
	 * not.filter			// inverse the result of the filter
	 */
		filter		: function(condition){
			var fx;
			if(arguments.length !== 1)
				throw new Error('Needs exactly one argument');
			// create filter fx
			if(typeof condition === 'string')
				fx	= ( ele => matcheSelector(ele, condition));
			// match function
			else if(typeof condition === 'function')
				fx	= condition;
			else if(Reflect.has(condition, 'length') === true)
				fx	= (ele => {
					// we didn't use "indexOf" because this needs to be applied to ArrayLike lists too
					for(var i = 0, len = condition.length; i < len; ++i){
						if(condition[i] === ele)
							return true
					}
					return false;
				});
			else
				fx = (ele => ele === condition);
			return Array.prototype.filter.call(this, this._op('not') === true ? (ele => !fx(ele)) : fx);
		},
		/**
		 * get first element that matches a condition
		 * first()							get the first element
		 * first(ele => true|false) 		get the first element that matches this condition
		 * first('div.cc')					get the first element that matches this selector
		 */
		first(condition){
			var len	= this.length;
			var result	= $$();
			if(len > 0){
				if(arguments.length === 0)
					result.push(this[ this._op('rtl') === true ? len - 1 : 0]);
				else
					this.each(ele => {
						if(elementMatch(ele, condition) === true){
							result.push(ele);
							return false;
						}
					});
			}
			return result;
		},
		/**
		 * get the last element that matches a condition
		 * last()						get the last element
		 * last(ele => true|false) 		get the last element that matches this condition
		 * last('div.cc')				get the last element that matches this selector
		 */
		last(condition){
			this.rtl.first(condition);
		},
		/**
		 * do someting on a tag or throw error if not a tag or other errors
		 * @return cb return value
		 */
		// doTag	: function(index, cb, notSilentError){
		// 	var tag	= this.eq(index);
		// 	try{
		// 		if(tag.nodeType !== 1)
		// 			throw new Error('Not a tag');
		// 		return cb(tag);
		// 	} catch(err){
		// 		if(notSilentError === true)
		// 			throw err;
		// 	}
		// }
		// doFirstTag	: function(cb, preventSilentError){
		// 	var tag	= this[0];
		// 	try{
		// 		if(tag.nodeType !== 1)
		// 			throw new Error('Not a tag');
		// 		return cb(tag);
		// 	} catch(err){
		// 		if(preventSilentError === true)
		// 			throw err;
		// 	}
		// },
		/**
		 * .get(int)		get this element
		 * .get(cb) 		execute operation on the first element and returns it's value
		 * .all.get(cb)		equivalent to .map(cb)
		 */
		get	: function(cb){
			if(this.length === 0){} // return undefined
			// do some operation and get result
			else if(typeof cb === 'function'){
				if(this._op('all') === true)
					return this.map(cb);
				else 
					return cb(this[0]);
			}
			// int
			else if(typeof cb === 'number'){
				if(cb < 0)
					cb += this.length;
				return this[cb];
			}
			// 
			else throw new Error('Illegal argument');
		},
		/**
		 * matches elements that contains some childrens
		 * .has(selector)		: select elements that has some childs
		 * .has(ArrayLike)		: Array, $$Object, HTMLElements or even jQuery object
		 * .not.has	: inverse of has
		 */
		has			: function(selector){
			if(arguments.length !== 1)
				throw new Error('Illegal arguments length');
			return this.filter(ee => _find(ele, selector) !== undefined); // "not" is implemented inside "filter" function
		},
		/**
		 * filter to get only visible items
		 * visible		// filter visible items
		 * not.visible	// filter hidden items
		 */
		 get visible(){ return this.filter(_elementIsVisible); },// "not" is implemented inside "filter" function
		/**
		 * filter to get only visible items in the view port (visible to the user)
		 * visible		// filter visible items
		 * not.visible	// filter hidden items
		 */
		 get userVisible(){ return this.filter(_elementIsUserVisible); },
		/**
		 * get only elements attached to DOM
		 * get only elements not attached to DOM
		 */
		 get attached(){ return this.filter(_elementIsAttached); },
		/**
		* isVisible()		: is the first tag is visible
		* or.isVisible()	: is at least one tag is visible
		* all.isVisible()	: is all tags are visible
		*/
		isVisible		: function(){ return this.predicate(_elementIsVisible); },
		isUserVisible	: function(){ return this.predicate(_elementIsUserVisible); },
		isAttached		: function(){ return this.predicate(_elementIsAttached); }
	});
	function _elementIsVisible(ele){
		return ele.offsetWidth || ele.offsetHeight || ele.getClientRects().length > 0;
	}
	function _elementIsUserVisible(ele){
		throw new Error('unimplemented');
		//TODO
	}
	function _elementIsAttached(ele){
		throw new Error('unimplemented');
		//TODO
	}
		/**
	 * flatten array
	 * recursive function is faster when level < 5
	 */
	const FLATTEN_ARRAY_MAX_LEVEL = 5;
	function flattenArray(arr){
		var result	= [];
		makeFlat(arr, result, 0);
		return result;
	}
	function makeFlat(arr, target, level){
		if(level === FLATTEN_ARRAY_MAX_LEVEL)throw new Error('Max array level!');
		++level;
		if(Reflect.has(arr, 'length')){// array like
			for(var i=0, len = arr.length; i < len; ++i)
				makeFlat(arr[i], target, level);
		}
		else target.push(arr);
	}
	class $$Collection extends Array {
		get [Symbol.isConcatSpreadable](){ return true; }
		// make array concat spreadable
		// get [ArrayUtils.spreadable](){ return true; }
		// get [ArrayUtils.preProcess](ele){
		// 	if(!Reflect.has(ele, 'nodeType'))
		// 		ele	= $$(ele)[0];
		// 	return ele;
		// }
		// get [ArrayUtils.control](ele){
		// 	if(!Reflect.has(ele, 'nodeType'))
		// 		ele	= $$(ele)[0];
		// 	return this.indexOf(ele) === -1;
		// }
		/**
		 * clone the collection
		 * we use "for" instead of "slice" and "push.apply" because it's faster
		 */
		duplicate(){
			// var lst	= [];
			// for(var i = 0, len = this.length; i < len; ++i)
			// 	lst.push(this[i]);
			// return lst;
			//we do not need this speed, so we use slice
			return this.slice(0);
		}
		/** remove all elemnts */
		clear(){
			this.splice(0);
			return this;
		}
		/**
		 * each			iterate on the list
		 * rtl.each	iterate right to left
		 */
		each(cb){
			var i, len = this.length;
			if(this._op('rtl') === true)
				for(i = len - 1; i >= 0; --i){
					if(cb(this[i], i) === false)
						break;
				}
			else
				for(i=0; i < len; ++i){
					if(cb(this[i], i) === false)
						break;
				}
			return this;
		}
		/**
		 * forEach
		 * rtl.forEach	iterate right to left
		 */
		forEach(cb){
			var i, len = this.length;
			if(this._op('rtl') === true)
				for(i = len - 1; i >= 0; --i)
					cb(this[i], i);
			else
				for(i=0; i < len; ++i)
					cb(this[i], i);
			return this;
		}
		/**
		 * get new collection without duplicates
		 */
		unique(){
			return this.filter((ele, indx) => {
				return this.indexOf(ele) === indx;
			});
		}
		/**
		 * Alternative of [*] that accepts negative values
		 * -1 referer to the last element in the collection
		 */
		eq(index){
			if(index < 0)
				index += this.length;
			return this[index];
		}
		concat(){ super.concat($$(arguments))}
		splice(start, rmCount){
			if(arguments.length > 2){
				var args = $$(Array.slice.call(arguments, 2));
				super.unshift.call(args, start, rmCount);
				super.splice.apply(this, args);
			}
			else super.splice(start, rmCount);
		}
		push(){
			var lst	= $$(arguments).filter(ele => this.indexOf(ele) === -1);
			if(lst.length > 0)
				super.push.apply(this, lst);
			return this;
		}
		unshift(){
			var lst	= $$(arguments).filter(ele => this.indexOf(ele) === -1);
			if(lst.length > 0)
				super.unshift.apply(this, lst);
			return this;
		}
	}
		const _COLLECTIONOP	= {
		all	: Symbol(),
		not	: Symbol(),
		or	: Symbol(),
		rtl	: Symbol() // fx each will begin from right to left
	};
	$$.plugin({
		/**
		 * execute a predicat on the collection
		 * used as backend for somme functions like: hasAttr
		 * .predicate(condition)		returns true if the first element matches the predicate
		 * .all.predicate(condition)	returns true if all elements matches the predicate
		 * .or.predicate(condition)		returns true if somme element matches the predicate
		 * .not.predicate(condition)	invert the condition state
		 */
		predicate	: function(predicat){
			var result;
			if(this._op('all') === true)
				result = this.every(predicat);
			else if(this._op('or') === true)
				result = this.some(predicat);
			else if(this.length === 0)
				result = false;
			else
				result = predicat(this[0]);
			if(this._op('not') === true)
				result = !result;
			return result;
		},
		// operators
		get all(){
			this[_COLLECTIONOP.all]	= true;
			this[_COLLECTIONOP.or] 	= false;
			return this;
		},
		get or(){
			this[_COLLECTIONOP.or]	= true;
			this[_COLLECTIONOP.all]	= false;
			return this;
		},
		get not(){
			this[_COLLECTIONOP.not] = true;
			return this;
		},
		get rtl(){
			this[_COLLECTIONOP.rtl] = true;
			return this;
		},
		_op(op){
			var flag = this[_COLLECTIONOP[op]];
			this[_COLLECTIONOP[op]] = false;
			return flag;
		}
	});
	$$.plugin({
		/**
		 * 
		 */
		transition	: function(){}, //TODO
		transitionP	: function(){}, // transition and returns promise
		/**
		 * 
		 */
		animate		: function(){}, //TODO
		animateP	: function(){}, //Animate and returns promise
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
		$$.plugin({
		// get or set attributes
		// attr()				// returns list of all attributes names
		// attr('attrName')		// get attribute value
		// all.attr('attrName')
		// attr({key: value})	// set attributes
		attr	: function(attrs){
			var ele, result;
			if(arguments.length === 1){
				// get values
				if(typeof attrs === 'string')
					result	= this.get(ele => ele.getAttribute(attrs)) // .all. is supported inside "get" method
				// set attributes
				else {
					this.forEach(ele => {
						for(ele in attrs)
							ele.setAttribute(ele, attrs[ele]);
					});
					result = this;
				}
			}
			// return attributes name list
			else if(arguments.length === 0)
				result	= this.get(ele => ele.getAttributeNames()); // .all. is supported inside "get" method
			else throw new Error('uncorrect arguments length');
			return result;
		},
		/**
		 * if elements has this attribute
		 * .hasAttr('attrName')			if the first element has this attribute
		 * .all.hasAttr('attrName')		if the all elements have this attribute
		 * .or.hasAttr('attrName')		if the some element has this attribute
		 * .not.hasAttr('attrName')		has not this attribute
		 */
		// hasAttr('attrName')
		// .or.hasAttr('attrName')
		hasAttr	: function(attrName){
			return this.predicate(ele => ele.hasAttribute(attrName));
		},
		removeAttr: function(attrName){
			this.forEach(tag => {
				tag.removeAttribute(attrName);
			});
			return this;
		},
		// .property('href')		get property value of the first element
		// .all.property('href')	get property value of all elements
		property	: function(propName){
			return this.get(tag => tag[propName]);
		}
	});
		$$.plugin({
		/**
		 * .className()				: get the className of the fist eleemnt
		 * .className(className)	: set the className of all elements
		 * .all.className()			: get all elements className as a list
		 */
		className		: function(className){
			return arguments.length === 0 ? this.attr('class') : this.attr({'class' : className});
		},
		/**
		 * .addClass('cl1', 'cl2')
		 * .addClass(['cl1', 'cl2'])
		 */
		addClass	: function(cl){
			if(!Array.isArray(cls))
				cls	= Array.from(arguments);
			this.forEach(tag => tag.classList.add.apply(tag.classList, cls));
		},
		/**
		 * removeClass('cl1', 'cl2')
		 * removeClass(['cl1', 'cl2'])
		 */
		removeClass	: function(cls){
			if(!Array.isArray(cls))
				cls	= Array.from(arguments);
			this.forEach(tag => tag.classList.remove.apply(tag.classList, cls));
		},
		/**
		 * .hasClass('cl')				if the first element has this class
		 * .hasClass('cl1', 'cl2')		if the first element has those classes
		 * .hasClass(['cl1', 'cl2'])	if the first element has those classes
		 * .all.hasClass('cl')			if all elements has this class
		 * .or.hasClass('cl')			if some element has this class
		 * .not.hasClass				inverse
		 */
		hasClass	: function(cls){
			if(!Array.isArray(cls))
				cls	= Array.from(arguments);
			return this.predicate( ele => cls.every( c => ele.classList.contains(c) ) );
		},
		/**
		 * .toggleClass('className', force)
		 * .toggleClass(['cl1', 'cl2'], force)
		 * .
		 */
		toggleClass	: function(className, force){
			if(Array.isArray(className)){
				this.forEach(tag => {
					className.forEach( tag => tag.classList.toggle(className, force) );
				});
			}
			else this.forEach( tag => tag.classList.toggle(className, force) );
		 	return this;
		}
	});
		$$.plugin({
		/**
		 * .clone()		clone object deeply and with data events
		 * .clone(boolean) // all options to this boolean value
		 * .clone({
		 * 		events	: boolean, // default true
		 * 		data	: true, false, 'deep', // default true
		 * })
		 */
		clone	: function(options){
			this.map(element => {
				// clone node deeply
					element	= element.cloneNode(true);
				//TODO clone events and data
				// return
					return element;
			});
		}
	});
		/**
	 * create element
	 * createElement('div')
	 * createElement('div#id.class text')
	 * createElement(template)
	 * @return { HTMLElement }
	 * @return { HTMLDocumentFragment }
	 */
	function createElement(template){
		var result;
		try{
			if(template.length > 20) throw 't'; // use template gen
			result	= document.createElement(template);
		} catch(err) {
			return _createElementFromTemplate(template);
		}
	}
	function _createElementFromTemplate(template){
		var rootNode	= document.createDocumentFragment(),
		parentNode	= rootNode,
		currentNode,
		currentLevel= 0,
		lastLevel   = 0,
		lastPos     = 0,
		line		= 0,
		col			= 0,
		state       = 0,
		quote       = false,
		attrSymbol  = false,
		attrName    = false,
		attrV       = '',
		char ='';
		// set attribute or create element
		var processEle = ((name, value) => {
		if(name === false){ // create TAG
			if(currentLevel === lastLevel + 1)
				parentNode = currentNode;
			else if(currentLevel === lastLevel){}
				else if(currentLevel < lastLevel){
					var i = lastLevel - currentLevel ;
					for(; i> 0; --i)
						parentNode = parentNode.parentNode;
				}
				else throw new Error('Uncorrect code level at position: ' + pos + ', line: ' + line + ', col: ' + col);
		// create new Node
		currentNode = document.createElement(value || 'div');
		parentNode.appendChild(currentNode);
		lastLevel = currentLevel;
		currentLevel = 0;
		}
		// add class
		else if(name === '.')
			currentNode.classList.add(value);
		else if(name === '#')
			currentNode.setAttribute('id', value);
		else if(name!=null) currentNode.setAttribute(name, value);
		// 
		lastPos = pos+1;
		});
		var fixAttr     = (name => {
			name = name.trim()
		});
		// loop
		for(var pos =0, len = template.length; pos < len; ++pos){
			char    = template.charAt(pos);
		++col; // debug
		switch(state){
		case 0: // level
		if(char === '|'){
			if(currentLevel> lastLevel )
				throw new Error("TEXT ERROR : error at position " + pos + ', line: ' + line + ', col: ' + col);
			else if(currentLevel < lastLevel){
				var i = lastLevel - currentLevel;
				for(; i> 0; --i)
					currentNode = currentNode.parentNode;
				parentNode=currentNode.parentNode;    
			}
			lastLevel = currentLevel;
			currentLevel= 0;
			state = 3;
			lastPos = pos + 1;
		}
		else if(/\s/.test(char)===true)
			++currentLevel;
		else{
			state = 1;
			lastPos = pos;
		}
		break;
		// div.cc#id
		case 1: // tag name
		if(char === '#' || char === '.'){
			processEle(attrSymbol, template.substring(lastPos, pos));
			attrSymbol = char;
		}
		else if(char === '('){
			processEle(attrSymbol, template.substring(lastPos, pos));
			attrSymbol = null;
			state = 2;
		}
		else if(char === '\n'){
			state       = 0;
			processEle(attrSymbol, template.substring(lastPos, pos));
			attrSymbol   = false;
			currentLevel = 0;
		// debug
		++line;
		col=0;
		}
		else if(/\s/.test(char)){
			processEle(attrSymbol, template.substring(lastPos, pos));
		state = 3; // text
		}
		break;
		//(attr = value, ...)    
		case 2:
		if(quote !== false){
			if('\\' === char){
		attrV += template.substring(lastPos, pos);//???????????
		lastPos = pos +1;
		++pos;
		}
		else if(quote === char){
			quote = false;
			attrV = template.substring(lastPos, pos);
			lastPos = pos + 1;
		//processEle(attrName, attrV);
		}
		}
		else if(char === ')'){
			state = 1;
			if(attrName !== false){
				processEle(attrName, attrV);
				attrV = '';
			}
		}
		else if(char === '"' || char === "'" && template.substring(lastPos, pos).trim() === ''){
			quote = char;
			lastPos = pos +1;
		}
		else if(char === '='){
			attrName = attrV + template.substring(lastPos, pos).trim();
			attrV = '';
		}
		else if(char === ','){
			processEle(attrName, attrV + template.substring(lastPos, pos));
			attrV = '';
			attrName = false;
		}
		break;
		case 3:
		if(char === "\n"){
			state       = 0;
			attrSymbol  = false;
			currentLevel = 0;
			parentNode = currentNode;
			currentNode= document.createTextNode(template.substring(lastPos, pos));
			++lastLevel;
			parentNode.appendChild(currentNode);
		// debug
		++line;
		col = 0;
		}
		break;
		}
		}
		if(lastPos<len){
			currentNode.appendChild(document.createTextNode(template.substring(lastPos)));
		}
		return rootNode;
	}
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
		$$.plugin({
		/**
		 * .append(HTMLElement, ...)
		 * .append(ArryLike, ...)
		 * .append(this => this.fx(), ...)	// append elements based on current ones in the collection
		 * .append('div')
		 * .append('div#id...')
		 *
		 * .all.append		// append clones to each element
		 */
		append		: _appendPrepend((parent, ele) => parent.appendChild(ele)),
		/**
		 * .append(HTMLElement, ...)
		 * .append(ArryLike, ...)
		 * .append(this => this.fx(), ...)	// append elements based on current ones in the collection
		 * .append('div')
		 * .append('div#id...')
		 *
		 * .all.append		// append clones to each element
		 */
		append		: _appendPrepend((parent, ele) => parent.appendChild(ele)),
		/**
		 * appendTo(HTMLElement,...)
		 * // for those, the first tag will be selected
		 * appendTo($$Element)
		 * appendTo(jQueryElement)
		 * appendTo(ArrayLike)
		 * appendTo(selector)
		 *
		 * all.appendTo(...)		// append clones to each element
		 */
		appendTo	: _appendTo_prependTo((parent, ele) => parent.appendChild(ele)),
		/**
		 *
		 * all.prepend		// clone and insert copie to each element
		 */
		prepend		: _appendPrepend(_prepend),
		/**
		 *
		 * all.prependTo	// prepend clones
		 */
		prependTo	: _appendTo_prependTo(_prepend),
		/**
		 * .before(elementToInsert)
		 * .all.before		// insert clone before each element in the collection
		 */
		before		: _appendPrepend((targetElement, ele) => targetElement.insertAdjacentElement('beforebegin', ele)),
		/**
		 *
		 * after(elementsToInsert)
		 * .all.after		// insert clone before each element in the collection
		 */
		after		: _appendPrepend((targetElement, ele) => targetElement.insertAdjacentElement('afterend', ele)),
		/**
		 * insert after or before selected item
		 * insertBefore(HTMLElement)
		 * insertBefore(ArrayLike)
		 *
		 * all.insertAfter		// insert clones after
		 */
		insertAfter	: _appendTo_prependTo((targetElement, ele) => targetElement.insertAdjacentElement('afterend', ele)),
		/**
		 *
		 * all.insertBefore		// insert clones before
		 */
		insertBefore: _appendTo_prependTo((targetElement, ele) => targetElement.insertAdjacentElement('beforebegin', ele)),
		/**
		 * up element in the parent children list
		 */
		// up			: function(n){}, //TODO
		/**
		 * down element in the parent children list
		 */
		// down		: function(n){}, //TODO
		/**
		 * .replaceWidth(HTMLElement, ...)
		 * .replaceWidth(ArryLike, ...)
		 * .replaceWidth(this => this.fx())	// append elements based on current ones in the collection
		 * .replaceWidth('div')
		 * .replaceWidth('div#id...')
		 *
		 * .all.replaceWidth		// replace each node with clones
		 */
		replaceWith	: function(arg){
			var $$arg, element;
			// function
			if(typeof arg	== 'function')
				this.forEach(node => {
					element	= arg(node);
					if(!element){}
					else if(element.nodeType)
						node.parentNode.replaceChild(element, node);
					else {
						element	= ( element instanceof $$ ? element : $$(element) );
						node.parentNode.replaceChild(element.toFragment, node);
					}
				});
			// not function
			else{
				$$arg	= $$(arguments);
				// replace with copies
				if(this._op('all'))
					this.forEach(node => {
						node.parentNode.replaceChild($$arg.clone(true).toFragment(), node);
					});
				// replace first tag
				else
					this.get(tag => ele.parentNode.replaceChild($$arg.toFragment, ele));
			}
			return this;
		},
		/**
		 * empty each element
		 */
		empty		: function(){
			this.forEach(node => {
				while(node.firstChild)
					node.removeChild(node.firstChild);
			});
			return this;
		},//-----------------------------------------------------------------------------------------------------------------------
		/**
		 * remove all elements from the DOM and destroy theme
		 */
		remove		: function(){
			return this.forEach(node => node.remove());
		},
		/**
		 * detach all elements from the DOM
		 */
		detach		: function(){
			return this.forEach(node => node.remove());
		},
		/**
		 * remove parents and append elements to perents of parents
		 */
		unwrap		: function(filter){}, //TODO
		/**
		 * wrap first tag with given parent
		 * wrap('div')	// create div and wrap each tag with it
		 * wrap('div#id.cl1.cl2[attr1=value1][att2=value2]')
		 */
		wrap		: function(parent){}, //TODO
		wrapInner	: function(parent){} //TODO
	});
	// append & prepend methods
	function _appendPrepend(addFx){
		return function(arg){
			var element, $$arg;
			// if is a function
			if(typeof arg	=== 'function')
				this.forEach(ele => {
					if('appendChild' in ele){
						element	= arg(ele);
						if(!element){}
						else if(element.nodeType)
							addFx(ele, element);
						else{
							$$arg	= element instanceof $$ ? element : $$(element);
							addFx(ele, $$arg.toFragment);
						}
					}
				});
			// insert theme
			else if(arguments.length !== 0){
				$$arg	= $$(arguments);
				// append clones to all tags
				if(this._op('all'))
					this.forEach(ele => {
						if('appendChild' in ele)
							addFx(ele, $$arg.clone(true).toFragment);
					});
				// append to first tag
				else
					this.get(e => addFx(ele, $$arg.toFragment), true);
			}
			return this;
		}
	}
	// appendTo & prependTo
	function _appendTo_prependTo(addFx){
		return function(arg){
			var list, $$arg, parent;
			// if is a function
			if(typeof arg	== 'function')
				this.forEach(ele => {
					parent	= arg(ele);
					if(!parent){}
					else if('appendChild' in parent)
						addFx(parent, ele);
					else{
						parent	= parent instanceof $$ ? parent : $$(parent);
						parent.each(a => { addFx(a, ele); });
					}
				});
			//not function
				else{
					list	= $$(arguments);
					if(list.length){
						// make copies and add to each parent
						if(this._op('all')){
							list.forEach(parent => {
								if('appendChild' in parent)
									addFx(parent, this.clone(true).toFragment);
							});
						}
						// add to first parent
						else
							list.get(parent => addFx(parent, this.toFragment), true);
					}
				}
			return this;
		}
	}
	// prepend
	function _prepend(parent, child){
		if(parent.firstChild)
			parent.insertBefore(child, parent.firstChild);
		else
			parent.appendChild(child);
	}
		/**
	 * map namespaces
	 */
	const MAP_NS	= {
		'svg'	: 'http://www.w3.org/2000/svg'
	};
	 function _mapNS(ns){
	 	return MAP_NS[ns] || ns;
	 }
		$$.plugin({
		/**
		 * get a new collection with parents of current elements
		 */
		get parent(){
			return this.map(ele => ele.parentNode).unique();
		},
		// get a new collection with offsetParents of current elments
		get offsetParent(){
			return this.map(ele => ele.offsetParent).unique();
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
		$$.plugin({
		/**
		 * is(selector)			// returns true if the first element matches the selector
		 * is(HTMLELement)
		 * is(ArrayLike of HTMLElements)
		 * is(function)
		 * all.is(selector)		// returns true if all elements matches the selector
		 * or.is(selector)		// returns true if at least one element matches the selector
		 */
		is			: function(selector){
			return this.predicate(ele => elementMatch(ele, selector));
		}
	});
		$$.plugin({
		/**
		 * get text
		 * .text()				// get first element text
		 * .all.text()			// get all elements text as array
		 * .text('some text')	// set all elements text
		 */
		text	: function(text){
			if(arguments.length === 0)
				return this.get(tag => tag.innerText);
			else
				return this.forEach(tag => tag.innerText = text);
		},
		/**
		 * see "get" method for all alternatives
		 * html
		 * .all.html
		 */
		html	: function(html){
			if(arguments.length === 0)
				return this.get(tag => tag.innerHTML);
			else
				return this.forEach(tag => tag.innerHTML = html);
		},
		/**
		 * see "get" method for all alternatives
		 * outerHTML
		 * .all.outerHTML
		 */
		get outerHTML(){ return this.get(tag => tag.outerHTML) }
	});
		$$.plugin({
		/**
		 * immediately following subling elements in the DOM
		 * .all.next					// get all next elements
		 */
		next	: function(selector){
			return _sibling(this, 'nextSibling', selector);
		},
		/**
		 * immediately following subling elements in the DOM
		 * .all.prev					// get all next elements
		 */
		prev	: function(selector){
			return _sibling(this, 'previousSibling', selector);
		},
		/**
		 * get next elements until somme selected one
		 * nextUntil(selector)
		 * nextUntil(function)	// until this function returns false
		 * nextUntil(HTMLElement)
		 * nextUntil(ArrayLikeOfHTMLElements)	// $$Object, jQueryObject, list, ...
		 *
		 * .all.nextUntil		// include the target element
		 * .not.nextUntil		// get elements others than selected ones (after selected ones)
		 */
		nextUntil	: _siblingUntil('nextSibling'), //TODO
		/**
		 * get next elements until somme selected one
		 * prevUntil(selector)
		 * prevUntil(function)	// until this function returns false
		 * prevUntil(HTMLElement)
		 * prevUntil(ArrayLikeOfHTMLElements)	// $$Object, jQueryObject, list, ...
		 *
		 * .all.prevUntil		// include target element
		 * .not.prevUntil		// get elements others than selected ones (before selected ones)
		 */
		prevUntil	: _siblingUntil('previousSibling'), //TODO
		/**
		 * get siblings elements
		 */
		siblings	: function(selector) {
			return this.parent.children(selector);
			// return this.tags.children()map(ele => {
			// 	return ele.parentNode && ele.parentNode.firstChild;
			// }).next(selector);
		},
		/**
		 * concatination of nextUntil et prevUntil
		 */
		siblingsUntil	: function(selector){
			return this
					.prevUntil(selector) // previous elements
					.push(
						this.nextUntil(selector) // next elements
					);
		}
	});
	/**
	 * next	: nextSibling
	 * prev	: previousSibling
	 */
	function _sibling($this, attrName){
		var nodes	= [];
		if($this._op('all'))
			$this.forEach(tag => {
				while(tag = tag[attrName]){
					if(nodes.indexOf(tag) === -1)
						nodes.push(tag);
				}
			});
		else
			$this.forEach(tag => {
				tag	= tag[attrName];
				if(tag && nodes.indexOf(tag) === -1)
					nodes.push(tag);
			});
		// filter
		nodes	= $$(nodes);
		if(selector)
			nodes = nodes.filter(selector);
		return nodes;
	}
	/**
	 * sibling until
	 */
	function _siblingUntil(attr){
		return function(selector){
			var result,
				elements,
				includeTargetElement	= this._op('all'),
				returnsAfterTarget		= this._op('not'); // return elements after targetElement instead of before it
			// if no selector, just execute "next"
				if(!selector)
					result	= this.all[attr	=== 'nextSibling' ? 'next' : 'prev']();
			// else
				else{
					result	= $$(this.map(
						returnsAfterTarget ?
						(ele => {
							elements	= [];
							// escape unwanted elements
								while((ele = ele[attr]) && !_extendedMatches(ele, selector)){}
							// if include the target element
								if(includeTargetElement && ele)
									elements.push(ele);
							// got other elements
								if(ele){
									ele = ele[attr];
									while(ele = ele[attr])
										elements.push(ele);
								}
							return elements;
						})
						:(ele => {
							elements	= [];
							while((ele = ele[attr]) && !_extendedMatches(ele, selector))
								elements.push(ele);
							// if include target element
							if(includeTargetElement && ele)
								elements.push(ele);
							return elements;
						})
					));
				}
			return result;
		}
	}
	function assert(predicat, errMsg){
		if(!predicat){ // predicat === false || predicat === 0 || predicat === '' ||  predicat === undefined || predicat === null
			if(arguments.length <= 1)
				throw new Error('Assertion fails');
			else if(typeof errMsg === 'string')
				throw new Error(errMsg);
			else throw errMsg;
		}
	}
	$$.rootPlugin({
		assert	: assert
	});
	// make it global
	window.$$ = window.BrighterJS = $$;
})();
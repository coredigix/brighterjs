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
	var result;
	// create empty list
	if(arguments.length === 0)
		result = [];
	else if(arguments.length !== 1) // debug
		throw new Error('this API accepts only one argument');
	// create element
	else if(typeof arg === 'string')
		result = _cra
	// add this function to window load
	else if(typeof arg === 'function')
		$$.document.load(arg); // execute this when the window is loaded
	// HTMLElement or SVG element
	else if(Reflect.has(arg,'nodeType') === true)
		result = [arg];
	// brighterjs object
	else if(arg instanceof $$)
		result = arg.duplicate();
	// ArrayLike, jQuery, ...
	else if(Reflect.has(arg, 'length') === true){
		result = [];

	}
	else 
		throw new Error('Illegal argument');
	// make list as brighter object
		Object.setPrototypeOf(result, $$prototype);
	return result;
}

const $$prototype  = $$.prototype	= $$Collection.prototype;
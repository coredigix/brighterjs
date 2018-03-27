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
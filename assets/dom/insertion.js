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
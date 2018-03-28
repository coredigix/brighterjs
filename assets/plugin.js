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
		if(dscptr.hasOwnProperty('dscptr') === true)
			dscptr.writable		= false;
	}
	Object.defineProperties(isRoot ? $$ : $$.prototype, plugins);
}
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
		result	= _createElementFromTemplate(template);
	}
	return result;
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
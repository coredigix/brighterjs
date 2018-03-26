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
/**
 * map namespaces
 */
const MAP_NS	= {
	'svg'	: 'http://www.w3.org/2000/svg';
};
 function _mapNS(ns){
 	return MAP_NS[ns] || ns;
 }
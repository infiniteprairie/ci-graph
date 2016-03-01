/**
 * let's see if we can build some object-based representations
 * (not database backed)
 */
function Interface(_key, _name) {
	this.interfaceKey = _key;
	this.interfaceName = _name;
	this.fromNode = new IntegrationNode();
	this.toNode = new IntegrationNode();
}

Interface.prototype.setFromNode = function(_from) {
	this.fromNode = _from;
}
Interface.prototype.setToNode = function(_to) {
	this.toNode = _to;
}

Interface.prototype.toString = function() {
	  return ">> Interface key: " + this.interfaceKey + "|| name: " + this.interfaceName + "|| from: [[ " + this.fromNode.toString()  + " ]] || to: [[ " + this.toNode.toString() + " ]]"; 
	}



function IntegrationNode(_key, _name) {
	this.integrationNodeKey = _key;
	this.integrationNodeName = _name;
	this.integrationNodeType = null;

// the following doesn't really work...
//	function toString() {
//		return "key: " + this.integrationNodeKey + "|| name: " + this.integrationNodeName + "|| nodeType: " + this.integrationNodeType ;  
//	}
}

IntegrationNode.prototype.toString = function() {
	  return "key: " + this.integrationNodeKey + "|| name: " + this.integrationNodeName + "|| nodeType: " + this.integrationNodeType ; 
	}

var IntegrationNodeType = {
	APPLICATION: 'APPLICATION',
	SERVICE_ENDPOINT: 'SERVICE_ENDPONT',
	QUEUE: 'QUEUE'
}


function IntegrationNodeFactory() {
	var _integrationNodes = new Array();
	function nodeInitializer(_nodekey, _nodeName, _nodeType) {
		var node = new IntegrationNode(_nodekey, _nodeName);
		node.integrationNodeType = _nodeType;
		if ( node instanceof IntegrationNode ) { 
			console.log ("OK: node is an instance of IntegrationNode... type="+get_type(node)); 
		} else {
			console.log ("WARN: we seem to have typing challenges"); 
		}
		return node;
	}
	_integrationNodes.push(nodeInitializer('_integration_node_00001', 'PoolingManager', IntegrationNodeType.APPLICATION)); 
	console.log(">> IntegrationNode added: " + _integrationNodes[0].toString());
	_integrationNodes.push(nodeInitializer('_integration_node_00002', 'SecurityCoordinator', IntegrationNodeType.APPLICATION));
	console.log(">> IntegrationNode added: " + _integrationNodes[1].toString());
	return _integrationNodes;
}

var integrationNodes = IntegrationNodeFactory();

// this needs to be converted into a proper function (as soon as I figure out how it works)
// example taken from: http://stackoverflow.com/questions/7364150/find-object-by-id-in-an-array-of-javascript-objects
var lookupNodeById = {}; // lookupNodeById is an empty object
for (var i = 0, len = integrationNodes.length; i < len; i++) {
	lookupNodeById[integrationNodes[i].integrationNodeKey] = integrationNodes[i];
}

//let's test our lookup function...
console.log("let's test our lookup function... \n lookupNodeById['_integration_node_00002'] = " + lookupNodeById['_integration_node_00002']);

function InterfaceReferenceFactory() {
	var Interfaces = new Array();
	function InterfaceInitializer(_ifKey, _ifName, _fromNodeKey, _toNodeKey) {
		var vertex = new Interface(_ifKey, _ifName);
		// locate _fromNode in the node array (add to vertex)
		vertex.setFromNode(lookupNodeById[_fromNodeKey]);
		// locate _toNode in the node array (add to vertex)
		vertex.setToNode(lookupNodeById[_toNodeKey]);
		
		return vertex;
	}
	
	Interfaces.push(InterfaceInitializer('_interface_00001', 'broadcastSecurity', '_integration_node_00001', '_integration_node_00002'));
	
	console.log(">> Interface added: " + Interfaces[0].toString());

	
	return Interfaces;
}

var graph = InterfaceReferenceFactory();

/*
var interfaceTable = [
                      new Interface('_interface_00001', 'broadcastSecurity').setFromNode(integrationNodes['_integration_node_00001']).setToNode(integrationNodes['_integration_node_00002']),
                      {},
                      {}
                      ];
*/

function get_type(thing) {
    if ( thing===null ) return "[object Null]"; // special case
    return Object.prototype.toString.call(thing);
}


/**
 * InterfaceTable: array of Interface objects
 * 
 * Interface object: 
 * 	contains:
 * 		interfaceKey: String
 * 		interfaceName: String
 * 		interfaceType: InterfaceType enumeration
 * 		linkFrom: IntegrationNode
 * 		linkTo: IntegrationNode
 *
 * IntegrationNode object:
 * 	contains:
 * 		integrationNodeKey: String
 * 		integrationNodeName: String
 * 		integrationNodeType: IntegrationNodeType enumeration - denotes the nature of the IntegrationNode itself
 */

// console.log("interfaceTable contains: \n" + interfaceTable);
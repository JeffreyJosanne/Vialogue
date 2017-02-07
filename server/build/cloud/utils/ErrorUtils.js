'use strict';

// ParseClass.js
var INTERFACE_NOT_IMPLEMENTED_ERROR = function INTERFACE_NOT_IMPLEMENTED_ERROR(interfaceName, functionNotFoundName) {
	return new Error('interface \"' + interfaceName + '\" not implemented correctly. Expected ' + 'implementation of function \"' + functionNotFoundName + '\"');
};

// Reject Error Strings
var NOT_VALID_JSON_ERROR = function NOT_VALID_JSON_ERROR() {
	return new Error('JSON schema not valid');
};
var FIELD_NOT_PRESENT_ERROR = function FIELD_NOT_PRESENT_ERROR(id, className) {
	return new Error('Could not find the field : \"' + id + '\" in the JSON for \"' + className + '\" class');
};
var TYPE_NOT_CORRECT_ERROR = function TYPE_NOT_CORRECT_ERROR(id, className, foundType, expectedType) {
	return new Error('Incorrect type found for value corresponding to field : \"' + id + '\" for Class : \"' + className + '\"' + ' Expected : \"' + expectedType + '\" but found : \"' + foundType + '\"');
};
var PARSE_OBJECT_NOT_FOUND_ERROR = function PARSE_OBJECT_NOT_FOUND_ERROR(id, className) {
	return new Error('Parse Object with id : \"' + id + '\" for Class : \"' + className + '\" not found');
};

var NOT_VALID_VALUE_ERROR = function NOT_VALID_VALUE_ERROR(fieldName, className, possibleValuesArray) {
	var str = 'Incorrect value found for field : \"' + fieldName + '\" of class : \"' + className + '\". ';
	str += 'acceptable values include : ';
	for (var i = 0; i < possibleValuesArray.length; i++) {
		str += possibleValuesArray[i] + '| ';
	}
	return new Error(str);
};

// Throw Error Strings
var CANNOT_SET_OBJECT_PROPERTY_ERROR = function CANNOT_SET_OBJECT_PROPERTY_ERROR(object, property) {
	return new Error('Property \"' + property + '\" of object \"' + object + '\" cannot be set');
};
var CONSTRUCTOR_INVALID_ARGUMENTS_ERROR = function CONSTRUCTOR_INVALID_ARGUMENTS_ERROR(givenArguments) {
	var str = 'Invalid Arguments given to "ParseClass" constructor. ' + 'Expected className, jsonString | parseObject. ' + 'Given ';
	if (givenArguments.length === 0) {
		str += '[]';
	} else {
		for (var i = 0; i < givenArguments.length; i++) {
			str += givenArguments[i] + ', ';
		}
	}
	return new Error(str);
};

module.exports = {
	// ParseClass
	INTERFACE_NOT_IMPLEMENTED_ERROR: INTERFACE_NOT_IMPLEMENTED_ERROR,

	// Project
	NOT_VALID_JSON_ERROR: NOT_VALID_JSON_ERROR,
	FIELD_NOT_PRESENT_ERROR: FIELD_NOT_PRESENT_ERROR,
	TYPE_NOT_CORRECT_ERROR: TYPE_NOT_CORRECT_ERROR,
	PARSE_OBJECT_NOT_FOUND_ERROR: PARSE_OBJECT_NOT_FOUND_ERROR,
	NOT_VALID_VALUE_ERROR: NOT_VALID_VALUE_ERROR,

	// Throw Error Strings
	CANNOT_SET_OBJECT_PROPERTY_ERROR: CANNOT_SET_OBJECT_PROPERTY_ERROR,
	CONSTRUCTOR_INVALID_ARGUMENTS_ERROR: CONSTRUCTOR_INVALID_ARGUMENTS_ERROR
};
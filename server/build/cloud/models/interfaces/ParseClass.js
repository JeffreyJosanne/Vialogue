'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// imports
var fs = require('fs');
var path = require('path');
var validate = require('validate.js');

var ErrorUtils = require('../../utils/ErrorUtils.js');
var JsonUtils = require('../../utils/JsonUtils.js');

var interface_ = require('../../../lib/interface.js');

// read and validate configuration files
var cloudConfigDir = path.join(__dirname, '..', '..', '..', '..', 'config', 'cloud-config');
var projectConfig = JsonUtils.tryParseJSON(fs.readFileSync(path.join(cloudConfigDir, 'models', 'projectConfig.json'))) || function () {
	throw 'projectConfig.json is corrupted';
}();
var slideConfig = JsonUtils.tryParseJSON(fs.readFileSync(path.join(cloudConfigDir, 'models', 'slideConfig.json'))) || function () {
	throw 'slideConfig.json is corrupted';
}();
var imageConfig = JsonUtils.tryParseJSON(fs.readFileSync(path.join(cloudConfigDir, 'models', 'imageConfig.json'))) || function () {
	throw 'imageConfig.json is corrupted';
}();
var videoConfig = JsonUtils.tryParseJSON(fs.readFileSync(path.join(cloudConfigDir, 'models', 'videoConfig.json'))) || function () {
	throw 'videoConfig.json is corrupted';
}();
var questionConfig = JsonUtils.tryParseJSON(fs.readFileSync(path.join(cloudConfigDir, 'models', 'questionConfig.json'))) || function () {
	throw 'questionConfig.json is corrupted';
}();
var audioConfig = JsonUtils.tryParseJSON(fs.readFileSync(path.join(cloudConfigDir, 'models', 'audioConfig.json'))) || function () {
	throw 'audioConfig.json is corrupted';
}();
var categoryConfig = JsonUtils.tryParseJSON(fs.readFileSync(path.join(cloudConfigDir, 'models', 'categoryConfig.json'))) || function () {
	throw 'categoryConfig.json is corrupted';
}();
var languageConfig = JsonUtils.tryParseJSON(fs.readFileSync(path.join(cloudConfigDir, 'models', 'languageConfig.json'))) || function () {
	throw 'languageConfig.json is corrupted';
}();
var userConfig = JsonUtils.tryParseJSON(fs.readFileSync(path.join(cloudConfigDir, 'models', 'userConfig.json'))) || function () {
	throw 'userConfig.json is corrupted';
}();

/**
 * This class is an interface that, that defines provides some methods that
 * are commonly used by all the Parse Classes that are implemented in this
 * project, and also defines some constraints that need to be implemented by
 * any class that extends this class.
 *
 * Since this class is meant to be used as an interface, and not a class by
 * regular standards, any class that extends this class has to implemente then
 * following methods :
 *
 *      constructorFromParseObject :
 *          TODO: write the description of this method
 *          This method is supposed to initialize ...
 *          @param {ParseObject} parseObject
 *          @return {Promise} : fulfilled if initialization is successfull, or else rejected
 *
 *      constructorFromJsonString :
 *          TODO: write the description of this method
 *          @param {String} jsonString : a JSON string that ...
 *          TODO: write this too
 *
 * 		TODO write
 *		constructor() {
 *	 		super(CLASS_NAME, parameter);
 *		}
 *
 * This class implements the following methods :
 * 		TODO write
 * 		validateIdField
 *
 * This class also defines the following parameters
 * 		className
 *
 */

var ParseClass = function (_Parse$Object) {
	_inherits(ParseClass, _Parse$Object);

	/**
 * @param {String} className : the class name of the Parse Object in the database
 * @param {String} jsonString : JSON To parse
 * OR
 * @param {Project} projectParseObject : already generated Project {ParseObject} instance
 *
 * @return {Promise} :
 * 		fulfilled iff
 * 			no validation requested or
 * 			validation successfull
 * 		rejected if
 * 			number of arguments not equal 1 or 2
 * 			arguments don't match required argument types
 * 			validation errors
 * @throws
 * 			ErrorUtils.CONSTRUCTOR_INVALID_ARGUMENTS_ERROR : if incorrect arguments passed
 * 			ErrorUtils.INTERFACE_NOT_IMPLEMENTED_ERROR : if all the methods of the interface
 *	 			have note been implemented
 */
	function ParseClass(className, parameter) {
		_classCallCheck(this, ParseClass);

		// validate arguments
		if (!validate.isString(className) || !(validate.isString(parameter) || parameter.className === className)) {
			throw ErrorUtils.CONSTRUCTOR_INVALID_ARGUMENTS_ERROR(arguments);
		}

		// pass the classname to Parse.Object constructor

		// validate the implementation of the interface :

		// constructorFromParseObject
		var _this = _possibleConstructorReturn(this, (ParseClass.__proto__ || Object.getPrototypeOf(ParseClass)).call(this, className));

		if (!_this.constructorFromParseObject) {
			throw ErrorUtils.INTERFACE_NOT_IMPLEMENTED_ERROR('ParseClass', 'constructorFromParseObject');
		}

		// constructorFromJsonString
		if (!_this.constructorFromJsonString) {
			throw ErrorUtils.INTERFACE_NOT_IMPLEMENTED_ERROR('ParseClass', 'constructorFromJsonString');
		}

		if (validate.isString(parameter)) {
			var _ret;

			// generate Project instance from a given json string
			return _ret = _this.constructorFromJsonString(parameter), _possibleConstructorReturn(_this, _ret);
		} else {
			var _ret2;

			// generate instance from a given Parse Object
			return _ret2 = _this.constructorFromParseObject(parameter), _possibleConstructorReturn(_this, _ret2);
		}
		return _this;
	}

	/**
  * @param {String} fieldName : id field in the JSON String, to be validated
  * @param {String} className : Parse Class name pertaining to the saved Parse Object,
  * 							   whose id is the value to this field
  * @return {Promise} :
  * 		fulfilled iff fieldName field exists in the JSON and
  * 			value is null or
  * 			value is String and corresponds to a parse object in the "className" class of
  * 			in the database
  * 		rejected otherwise, returning the error message
  */


	_createClass(ParseClass, [{
		key: 'validateIdField',
		value: function validateIdField(fieldName, className) {
			var _this2 = this;

			return new Promise(function (fulfill, reject) {

				var id = _this2.object[fieldName];

				// no such field
				if (id === undefined) {
					reject(ErrorUtils.FIELD_NOT_PRESENT_ERROR(fieldName, className));
				}

				// if null, then valid
				if (id === null) {
					_this2.id = id;
					fulfill();
				}

				// if type is not String, then invalid
				if (!validate.isString(id)) {
					reject(ErrorUtils.TYPE_NOT_CORRECT_ERROR(fieldName, className, typeof id === 'undefined' ? 'undefined' : _typeof(id), 'String'));
				}

				// if object does not exist in the database, then invalid
				var obj = Parse.Object.extend(className);
				var query = new Parse.Query(obj);
				query.get(id).then(function (result) {
					fulfill(result);
				}, function (error) {
					if (error.code === 101) {
						// object with id "id" not found
						reject(ErrorUtils.PARSE_OBJECT_NOT_FOUND_ERROR(id, className));
					} else {
						reject(Error(error));
					}
				});
			});
		}

		// TODO: add documentation

	}, {
		key: 'validateIsEdited',
		value: function validateIsEdited(fieldName, className) {
			var _this3 = this;

			return new Promise(function (fulfill, reject) {

				var isEdited = _this3.object[fieldName];

				// no such field
				if (isEdited === undefined) {
					reject(ErrorUtils.FIELD_NOT_PRESENT_ERROR(fieldName, className));
				}

				// not a boolean, invalid
				if (!validate.isBoolean(isEdited)) {
					reject(ErrorUtils.TYPE_NOT_CORRECT_ERROR(fieldName, className, typeof isEdited === 'undefined' ? 'undefined' : _typeof(isEdited), 'boolean'));
				}

				fulfill(isEdited);
			});
		}
	}]);

	return ParseClass;
}(Parse.Object);

module.exports = {
	ParseClass: ParseClass,
	projectConfig: projectConfig,
	slideConfig: slideConfig,
	imageConfig: imageConfig,
	videoConfig: videoConfig,
	questionConfig: questionConfig,
	audioConfig: audioConfig,
	categoryConfig: categoryConfig,
	languageConfig: languageConfig,
	userConfig: userConfig
};
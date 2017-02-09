// imports
var fs = require('fs');
var path = require('path');
var validate = require('validate.js');

var ErrorUtils = require('../../util/ErrorUtils.js');
var JsonUtils = require('../../util/JsonUtils.js');

var interface_ = require('../../../lib/interface.js');

// read and validate configuration files
var cloudConfigDir = path.join(__dirname, '..', '..', '..', '..', 'config', 'cloud-config');
const projectConfig = JsonUtils.tryParseJSON(fs.readFileSync(path.join(cloudConfigDir, 'models', 'projectConfig.json'))) || (() => {throw 'projectConfig.json is corrupted'})();
const slideConfig = JsonUtils.tryParseJSON(fs.readFileSync(path.join(cloudConfigDir, 'models', 'slideConfig.json'))) || (() => {throw 'slideConfig.json is corrupted'})();
const imageConfig = JsonUtils.tryParseJSON(fs.readFileSync(path.join(cloudConfigDir, 'models', 'imageConfig.json'))) || (() => {throw 'imageConfig.json is corrupted'})();
const videoConfig = JsonUtils.tryParseJSON(fs.readFileSync(path.join(cloudConfigDir, 'models', 'videoConfig.json'))) || (() => {throw 'videoConfig.json is corrupted'})();
const questionConfig = JsonUtils.tryParseJSON(fs.readFileSync(path.join(cloudConfigDir, 'models', 'questionConfig.json'))) || (() => {throw 'questionConfig.json is corrupted'})();
const audioConfig = JsonUtils.tryParseJSON(fs.readFileSync(path.join(cloudConfigDir, 'models', 'audioConfig.json'))) || (() => {throw 'audioConfig.json is corrupted'})();
const categoryConfig = JsonUtils.tryParseJSON(fs.readFileSync(path.join(cloudConfigDir, 'models', 'categoryConfig.json'))) || (() => {throw 'categoryConfig.json is corrupted'})();
const languageConfig = JsonUtils.tryParseJSON(fs.readFileSync(path.join(cloudConfigDir, 'models', 'languageConfig.json'))) || (() => {throw 'languageConfig.json is corrupted'})();
const userConfig = JsonUtils.tryParseJSON(fs.readFileSync(path.join(cloudConfigDir, 'models', 'userConfig.json'))) || (() => {throw 'userConfig.json is corrupted'})();
const resourceConfig = JsonUtils.tryParseJSON(fs.readFileSync(path.join(cloudConfigDir, 'models', 'resourceConfig.json'))) || (() => {throw 'resourceConfig.json is corrupted'})();


const _tempParameter = new WeakMap();

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
 *      getObject :
 *          TODO: write description
 *          @return {Object}
 *
 *      toJsonStringWithIds() :
 *          TODO: write description
 *
 *      toJsonStringWithObjects() :
 *          TODO: write description
 *
 *      save
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
class ParseClass extends Parse.Object {

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
	 * 			ErrorUtils.INTERFACE_NOT_IMPLEMENTED_ERROR : if all the methods of the interface
	 *	 			have note been implemented
	 */
	constructor(className: string, parameter: string | Parse.Object) {
		// pass the classname to Parse.Object constructor
		super(className);

		/**
         * validate the implementation of the interface :
         */

		// constructorFromParseObject
		if (!this.constructorFromParseObject) {
			throw ErrorUtils.INTERFACE_NOT_IMPLEMENTED_ERROR('ParseClass', 'constructorFromParseObject');
		}

		// constructorFromJsonString
		if (!this.constructorFromJsonString) {
			throw ErrorUtils.INTERFACE_NOT_IMPLEMENTED_ERROR('ParseClass', 'constructorFromJsonString');
		}

        // getObject
        if(!this.getObject) {
            throw ErrorUtils.INTERFACE_NOT_IMPLEMENTED_ERROR('ParseClass', 'getObject');
        }

        // save
        if(!this.save) {
            throw ErrorUtils.INTERFACE_NOT_IMPLEMENTED_ERROR('ParseClass', 'save');
        }

        // toJsonStringWithIds
        if(!this.toJsonStringWithIds) {
            throw ErrorUtils.INTERFACE_NOT_IMPLEMENTED_ERROR('ParseClass', 'toJsonStringWithIds');
        }

        // toJsonStringWithObjects
        if(!this.toJsonStringWithObjects) {
            throw ErrorUtils.INTERFACE_NOT_IMPLEMENTED_ERROR('ParseClass', 'toJsonStringWithObjects');
        }

        _tempParameter.set(this, parameter);
	}

    init(): Promise {
        console.log('initialize called');
        // TODO TODO//
        //
        //
        // TODO TODO//
        // test this
        var parameter = _tempParameter.get(this);
        console.log(parameter);
        if(validate.isString(parameter)) {
			// generate Project instance from a given json string
			return this.constructorFromJsonString(parameter);
		} else {
            // generate instance from a given Parse Object
            if(parameter.constructor.name === this.className) {
			    return this.constructorFromParseObject(parameter);
            } else {
                // different class name
                return new Promise((fulfill, reject) => {
                    reject(ErrorUtils.CLASS_NOT_CORRECT_ERROR(this.className, parameter.constructor.name));
                });
            }
        }
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
	validateIdField(fieldName: string, className: string): Promise {
		return new Promise((fulfill, reject) => {

			var id = this.getObject()[fieldName];

			// no such field
			if(id === undefined) {
				reject(ErrorUtils.FIELD_NOT_PRESENT_ERROR(fieldName, className));
			}

			// if null, then valid
			if(id === null) {
				fulfill(id);
			}

			// if type is not String, then invalid
			if(!validate.isString(id)) {
				reject(ErrorUtils.TYPE_NOT_CORRECT_ERROR(fieldName, className, typeof(id), 'String'));
			}

			// if object does not exist in the database, then invalid
			var obj = Parse.Object.extend(className);
			var query = new Parse.Query(obj);
			query.get(id).then(
				(result) => {
					fulfill(result);
				}, (error) => {
					if(error.code === 101) {
						// object with id "id" not found
						reject(ErrorUtils.PARSE_OBJECT_NOT_FOUND_ERROR(id, className));
					} else {
						reject(Error(error));
					}
				}
			);

		});

	}

	// TODO: add documentation
	validateIsEdited(fieldName: string, className: string): Promise {
		return new Promise((fulfill, reject) => {

			var isEdited = this.getObject()[fieldName];

			// no such field
			if(isEdited === undefined) {
				reject(ErrorUtils.FIELD_NOT_PRESENT_ERROR(fieldName, className));
			}

			// not a boolean, invalid
			if(!validate.isBoolean(isEdited)) {
				reject(ErrorUtils.TYPE_NOT_CORRECT_ERROR(fieldName, className, typeof(isEdited), 'boolean'));
			}

			fulfill(isEdited);

		});
	}
}

module.exports = {
    ParseClass,
    projectConfig,
    slideConfig,
    imageConfig,
    videoConfig,
    questionConfig,
    audioConfig,
    categoryConfig,
    languageConfig,
    userConfig,
    resourceConfig
}

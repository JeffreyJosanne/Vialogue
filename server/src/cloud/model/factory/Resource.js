/**
 * TODO: add documentation
 * {
 *      id {string}: ...,
 *      type {string}: ...,
 *      url {string}: ...,
 *      children_resources {string} : [{Resource}, ...]
 *      is_edited {boolean}: ...
 * }
 */

var validate = require('validate.js');

var ParseClass = require('../interface/ParseClass.js');
var JsonUtils = require('../../util/JsonUtils.js');
var ErrorUtils = require('../../util/ErrorUtils.js');

const _audioId = new WeakMap();
const _type = new WeakMap();
const _url = new WeakMap();
const _childrenResources = new WeakMap();
const _isEdited = new WeakMap();

const ID_FIELD = ParseClass.resourceConfig.ID_FIELD;
const TYPE_FIELD = ParseClass.resourceConfig.TYPE_FIELD;
const URL_FIELD = ParseClass.resourceConfig.URL_FIELD;
const CHILDREN_RESOURCES_FIELD = ParseClass.resourceConfig.CHILDREN_RESOURCES_FIELD;
const IS_EDITED_FIELD = ParseClass.resourceConfig.IS_EDITED_FIELD;
var CLASS_NAME;

const VALID_TYPES = [
    ParseClass.imageConfig,
    ParseClass.videoConfig,
    ParseClass.questionConfig,
    ParseClass.audioConfig
]

const REJECTION_PROMISE = new WeakMap();

class Resource extends ParseClass.ParseClass {

    constructor(parameter: string | Parse.Object) {

        var type = null;
        var rejectionPromise = null;
        if(validate.isString(parameter)) {
			// generate Project instance from a given json string
            var object = JsonUtils.tryParseJSON(parameter) || null;

            if(object === null) {
                // json string not valid
                rejectionPromise = new Promise((fulfill, reject) => {
                    reject(ErrorUtils.NOT_VALID_JSON_ERROR());
                });
            }

            type = object[TYPE_FIELD];
		} else if(parameter.constructor.name === Parse.Object.className) {
			// generate instance from a given Parse Object
            try {
                type = parameter.get(TYPE_FIELD);
            } catch (error) {
                rejectionPromise = new Promise((fulfill, reject) => {
                    reject(error);
                });
            }
		}

        // value is null, or field not present, etc. ... (type value is falsey)
        if(!rejectionPromise) {
        } {
            if(!type) {
                rejectionPromise = new Promise((fulfill, reject) => {
                    reject(ErrorUtils.FIELD_NOT_PRESENT_ERROR('TYPE_FIELD', 'Resource'));
                });
            }

            if(!rejectionPromise) {
                var config;
                for(var i=0; i<VALID_TYPES.length; i++) {
                    if(type === VALID_TYPES[i].CLASS_NAME) {
                        config = VALID_TYPES[i];
                        break;
                    }
                }

                // config is still falsey
                if(!config) {
                    rejectionPromise = new Promise((fulfill, reject) => {
                        var validTypesArray = [];
                        for(var i=0; i<VALID_TYPES.length; i++) {
                            validTypesArray.push(VALID_TYPES[i].CLASS_NAME);
                        }
                        reject(ErrorUtils.NOT_VALID_VALUE_ERROR(TYPE_FIELD, 'Resource', validTypesArray));
                    });
                }

                if(!rejectionPromise) {
                    CLASS_NAME = config.CLASS_NAME;
                }

            }
        }

        if(rejectionPromise) {
            super('', parameter);
            REJECTION_PROMISE.set(this, rejectionPromise);
        } else {
            console.log('not rejecting');
            super(CLASS_NAME, parameter);
        }
    }

    getObject() {
        return this.object;
    }

    toJsonStringWithIds() {

    }

    toJsonStringWithObjects() {

    }

    constructorFromParseObject(parseObject: Parse.Object): Promise {

        if(REJECTION_PROMISE.get(this)) {
            // rejection when constructor was run
            return REJECTION_PROMISE.get(this);
        }

        return new Promise((fulfill, reject) => {
            try {
                this.id = parseObject.get(ID_FIELD);
                _type.set(this, parseObject.get(TYPE_FIELD));
                _url.set(this, parseObject.get(URL_FIELD));
                _childrenResources.set(this, parseObject.get(CHILDREN_RESOURCES_FIELD));
                _isEdited.set(this, parseObject.get(IS_EDITED_FIELD));
                fulfill(this);
            } catch (error) {
                reject(error);
            }
        });
    }

    constructorFromJsonString(jsonString: string): Promise {

        if(REJECTION_PROMISE.get(this)) {
            // rejection when constructor was run
            return REJECTION_PROMISE.get(this);
        }

        this.jsonString = jsonString;
        this.object = JsonUtils.tryParseJSON(jsonString) || null;

        if(this.object === null) {
            // json string not valid
            return new Promise((fulfill, reject) => {
                reject(ErrorUtils.NOT_VALID_JSON_ERROR());
            });
        }

        return new Promise((fulfill, reject) => {
            this.parseJson().then(
                () => {
                    // return initialized object
                    fulfill(this);
                }, (error) => {
                    reject(error);
                }
            )

        });
    }

    parseJson(): Promise {
        return new Promise((fulfill, reject) => {
            this.validateId()
            .then(() => { return this.validateType()})
            .then(() => { return this.validateUrl()})
            .then(() => { return this.validateChildrenResources()})
            .then(() => { return this.validateIsEdited()})
            .then(() => { fulfill(this)})
            .catch((error) => { reject(Error(error))});
        });
    }

    validateId(): Promise {
        return new Promise((fulfill, reject) => {
            this.validateIdField(ID_FIELD, CLASS_NAME).then(
                () => {
                    this.id = this.object[ID_FIELD];
                    fulfill();
                }, (error) => {
                    console.log(error);
                    reject(error);
                }
            )

        });
    }

    validateType(): Promise {
        return new Promise((fulfill, reject) => {

            var type = this.object[TYPE_FIELD];

            // no such field
            if(type === undefined) {
                reject(ErrorUtils.FIELD_NOT_PRESENT_ERROR(TYPE_FIELD, CLASS_NAME));
            }

            // if not a string, reject
            if(!validate.isString(type)) {
                reject(ErrorUtils.TYPE_NOT_CORRECT_ERROR(TYPE_FIELD, CLASS_NAME, typeof(type), 'String'));
            }

            // if value is not "CLASS_NAME", reject
            if(type !== CLASS_NAME) {
                reject(ErrorUtils.NOT_VALID_VALUE_ERROR(TYPE_FIELD, CLASS_NAME, [CLASS_NAME]));
            }

            _type.set(this, type);
            fulfill();

        });
    }

    validateUrl() {
        return new Promise((fulfill, reject) => {

            var url = this.object[URL_FIELD];

            // no such field
            if(url === undefined) {
                reject(ErrorUtils.FIELD_NOT_PRESENT_ERROR(URL_FIELD, CLASS_NAME));
            }

            // if not string, then invalid
            if(!validate.isString(url)) {
                reject(ErrorUtils.TYPE_NOT_CORRECT_ERROR(URL_FIELD, CLASS_NAME, typeof(url), 'String'));
            }

            // TODO: check if the URL is actually validate
            _url.set(this, url);
            fulfill();

        });
    }

    validateChildrenResources(): Promise {
        return new Promise((fulfill, reject) => {

            var childrenResources = this.object[CHILDREN_RESOURCES_FIELD];

            // no such field
            if(childrenResources === undefined) {
                reject(ErrorUtils.FIELD_NOT_PRESENT_ERROR(CHILDREN_RESOURCES_FIELD, CLASS_NAME));
            }

            // if not an array, undefined
            if(!validate.isArray(childrenResources)) {
                reject(ErrorUtils.TYPE_NOT_CORRECT_ERROR(CHILDREN_RESOURCES_FIELD, CLASS_NAME, typeof(childrenResources), 'Array'));
            }

            var _childrenResources_ = [];
            new Promise((fulfill, reject) => {

                // if no children resources, then fulfill
                console.log(childrenResources);
                if(childrenResources.length === 0) {
                    console.log('length 0 : fulfilling');
                    fulfill();
                }

                var numFulfilled = 0;
                for(var i=0; i<childrenResources.length; i++) {
                    var childResource = childrenResources[i];
                    new Resource(JSON.stringify(childResource)).then(
                        (result) => {
                            // successfully initialized Resource Object
                            _childrenResources_.push(result);
                            numFulfilled += 1;
                            if(numFulfilled === childrenResources.length) {
                                // this was the last child Resource
                                fulfill();
                            }
                        }, (error) => {
                            reject(error);
                        }
                    );
                }
            }).then(
                () => {
                    console.log('before');
                    _childrenResources.set(this, _childrenResources_);
                    console.log('after');
                    fulfill();
                }, (error) => {
                    reject(error);
                }
            );

        });
    }

    validateIsEdited(): Promise {
		return new Promise((fulfill, reject) => {

            super.validateIsEdited(IS_EDITED_FIELD, CLASS_NAME).then(
                (result) => {
                    _isEdited.set(this, result);
                    fulfill();
                }, (error) => {
                    reject(error);
                }
            );

		});
	}

}

module.exports = {
    Resource
}

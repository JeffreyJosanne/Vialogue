/**
 * TODO: add documentation
 * {
 *      id {string}: ...,
 *      type {string}: ...,
 *      url {string}: ...,
 *      is_edited {boolean}: ...
 * }
 */

var validate = require('validate.js');

var ParseClass = require('./interfaces/ParseClass.js');
var JsonUtils = require('../utils/JsonUtils.js');
var ErrorUtils = require('../utils/ErrorUtils.js');

const _type = new WeakMap();
const _url = new WeakMap();
const _isEdited = new WeakMap();

const CLASS_NAME = ParseClass.questionConfig.CLASS_NAME;
const ID_FIELD = ParseClass.questionConfig.ID_FIELD;
const TYPE_FIELD = ParseClass.questionConfig.TYPE_FIELD;
const URL_FIELD = ParseClass.questionConfig.URL_FIELD;
const IS_EDITED_FIELD = ParseClass.questionConfig.IS_EDITED_FIELD;

var Resource = require('./interfaces/Resource.js').Resource;
var ParseClass = require('./interfaces/ParseClass.js');

class Question extends Resource {

    constructor(parameter: string | Resource): Promise {
        return super(ParseClass.questionConfig.CLASS_NAME, parameter);
    }

    constructorFromParseObject(parseObject: Parse.Object): Promise {

        return new Promise((fulfill, reject) => {

            try {
                this.id = parseObject.get(ID_FIELD);
                _type.set(this, parseObject.get(TYPE_FIELD));
                _url.set(this, parseObject.get(URL_FIELD));
                _isEdited.set(this, parseObject.get(IS_EDITED_FIELD));
                fulfill(this);
            } catch (error) {
                reject(error);
            }

        });

    }

    constructorFromJsonString(jsonString: string): Promise {
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

    validateUrl(): Promise {
        return new Promise((fulfill, reject) => {

            super.validateUrl(URL_FIELD, CLASS_NAME).then(
                (result) => {
                    _url.set(this, result);
                    fulfill();
                }, (error) => {
                    reject(error);
                }
            );

        });
    }

    validateIsEdited(): Promise {
		return new Promise((fulfill, reject) => {

			var isEdited = this.object[IS_EDITED_FIELD];

			// no such field
			if(isEdited === undefined) {
				reject(ErrorUtils.FIELD_NOT_PRESENT_ERROR(IS_EDITED_FIELD, CLASS_NAME));
			}

			// not a boolean, invalid
			if(!validate.isBoolean(isEdited)) {
				reject(ErrorUtils.TYPE_NOT_CORRECT_ERROR(IS_EDITED_FIELD, CLASS_NAME, typeof(isEdited), 'boolean'));
			}

			_isEdited.set(this, isEdited);
			fulfill();

		});
	}

}

module.exports = {
    Question
}

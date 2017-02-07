/**
 * This class {Slide} represents an extension of the {ParseObject}.
 * The following JSON represents the schema of this {ParseObject}
 *
 * {
 *      id {String}: ...,
 * 		project_slide_id {int}: ...,
 * 		layering_objects {String Array}: [...],
 * 		hyperlinks {String Array}: [...],
 * 		type {String}: ...,
 * 		resource {Image | Video | Question}: ...,
 *      is_edited {boolean}: ...
 * }
 */

var fs = require('fs');
var validate = require('validate.js');

var JsonUtils = require('../utils/JsonUtils.js');
var ErrorUtils = require('../utils/ErrorUtils.js');
var ParseClass = require('./interfaces/ParseClass.js')
var Image = require('./Image.js').Image;
var Video = require('./Video.js').Video;
var Question = require('./Question.js').Question;

/* private variables to this class are stored in the form of this WeakMaps
 * (where the key is the instance object "this", and the value is the value
 * of the variable). These can only be accessed through the getters and setters
 * in the Project class, and so we (as a programmer) can control how much can
 * another class access these variables
 */
const _projectSlideId = new WeakMap();
const _layeringObjects = new WeakMap();
const _hyperLinks = new WeakMap();
const _type = new WeakMap();
const _resource = new WeakMap();
const _isEdited = new WeakMap();

const CLASS_NAME = ParseClass.slideConfig.CLASS_NAME;
const ID_FIELD = ParseClass.slideConfig.ID_FIELD;
const PROJECT_SLIDE_ID_FIELD = ParseClass.slideConfig.PROJECT_SLIDE_ID_FIELD;
const LAYERING_OBJECTS_FIELD = ParseClass.slideConfig.LAYERING_OBJECTS_FIELD;
const HYPERLINKS_FIELD = ParseClass.slideConfig.HYPERLINKS_FIELD;
const TYPE_FIELD = ParseClass.slideConfig.TYPE_FIELD;
const RESOURCE_FIELD = ParseClass.slideConfig.RESOURCE_FIELD;
const IS_EDITED_FIELD = ParseClass.slideConfig.IS_EDITED_FIELD;

const IMAGE_TYPE_NAME = ParseClass.imageConfig.CLASS_NAME;
const VIDEO_TYPE_NAME = ParseClass.videoConfig.CLASS_NAME;
const QUESTION_TYPE_NAME = ParseClass.questionConfig.CLASS_NAME;
// this order should not be changed. You can only add more
// types in here
const POSSIBLE_SEGMENT_TYPES = [
	IMAGE_TYPE_NAME,       // first : Image
	VIDEO_TYPE_NAME,       // second : Video
	QUESTION_TYPE_NAME     // third : Question
]

/**
 * A {ParseObject} that represents a row in the {Slide} class of the database
 *
 */

class Slide extends ParseClass.ParseClass {

    constructor(parameter) {
        return super(CLASS_NAME, parameter);
    }

    constructorFromParseObject(ParseObject) {
        console.log('Slide : constructorFromParseObject : called');
        return new Promise((fulfill, reject) => {

            try {
                this.id = ParseObject.get(ID_FIELD);
                _projectSlideId.set(this, ParseObject.get(PROJECT_SLIDE_ID_FIELD));
                _layeringObjects.set(this, ParseObject.get(LAYERING_OBJECTS_FIELD));
                _hyperLinks.set(this, ParseObject.get(HYPERLINKS_FIELD));
                _type.set(this, ParseObject.get(TYPE_FIELD));
                _resource.set(this, ParseObject.get(RESOURCE_FIELD));
                _isEdited.set(this, ParseObject.get(IS_EDITED_FIELD));
            } catch (error) {
                reject(error);
            }

        });
    }

    constructorFromJsonString(jsonString) {
        console.log('Slide : constructorFromJsonString : initializing');

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

    parseJson() {
        return new Promise((fulfill, reject) => {

            this.validateId()
            .then(() => { return this.validateProjectSlideId()})
            .then(() => { return this.validateLayeringObjects()})
            .then(() => { return this.validateHyperlinks()})
            .then(() => { return this.validateType()})
            .then(() => { return this.validateResource()})
            .then(() => { return this.validateIsEdited()})
            .then(() => { fulfill(this)})
            .catch((error) => { reject(Error(error))});
        });
    }

    /**
	 * validates the ID_FIELD field
	 * look at "validateIdField" method for description
	 */
	validateId() {
		return new Promise((fulfill, reject) => {
			this.validateIdField(ID_FIELD, CLASS_NAME).then(
				() => {
					// CANNOT MAKE ID NOT SETTABLE BECAUSE WHEN USING THE ParseObject.set METHOD,
					// PARSE REASSIGNS THE ID FIELD.
					// FOR EVERY OTHER FIELD, PARSE CREATES A NEW ARRAY WITH KEY-VALUE PAIRS
					// TO BE SAVED / UPDATED IN THE DATABASE (WIERD!)

					this.id = this.object[ID_FIELD];
					fulfill();
				}, (error) => {
					reject(error);
				}
			);

		});
	}

    validateProjectSlideId() {
        var this_ = this;
        return new Promise((fulfill, reject) => {

            var projectSlideId = this.object[PROJECT_SLIDE_ID_FIELD];

            // no such field name
            if(projectSlideId === undefined) {
                reject(ErrorUtils.FIELD_NOT_PRESENT_ERROR(PROJECT_SLIDE_ID_FIELD, CLASS_NAME));
            }

            // type is not integer, invalid
            if(!validate.isInteger(projectSlideId)) {
                reject(ErrorUtils.TYPE_NOT_CORRECT_ERROR(PROJECT_SLIDE_ID_FIELD, CLASS_NAME, typeof(projectSlideId), 'int'));
            }

            _projectSlideId.set(this, projectSlideId);
            fulfill();

        });
    }

    validateLayeringObjects() {
        return new Promise((fulfill, reject) => {
            // TODO: implement
            _layeringObjects.set(this, []);
            fulfill();
        });
    }

    validateHyperlinks() {
        return new Promise((fulfill, reject) => {

            var hyperlinks = this.object[HYPERLINKS_FIELD];

            // no such field name
            if(hyperlinks === undefined) {
                reject(ErrorUtils.FIELD_NOT_PRESENT_ERROR(HYPERLINKS_FIELD, CLASS_NAME));
            }

            // if not array, invalid
            if(!validate.isArray(hyperlinks)) {
                reject(ErrorUtils.TYPE_NOT_CORRECT_ERROR(HYPERLINKS_FIELD, CLASS_NAME, typeof(hyperlinks), 'Array'));
            }

            // if elements of array not strings, not valid
            for(var i=0; i<hyperlinks.length; i++) {
                if(!validate.isString(hyperlinks[i])) {
                    reject(ErrorUtils.TYPE_NOT_CORRECT_ERROR(HYPERLINKS_FIELD + ' : ELEMENT : ', CLASS_NAME, typeof(hyperlinks[i]), 'String'));
                }
            }

            // TODO check if each value in the above array points to a slide object
            return new Promise((fulfill, reject) => {

                // if no hyperlinks, fulfill
                if(hyperlinks.length === 0) {
                    fulfill();
                }

                var numHyperlinks = 0;
                for(var i=0; i<hyperlinks.length; i++) {
                    var obj = Parse.Object.extend(CLASS_NAME);
                    var query = new Parse.Query(obj);
                    query.get(hyperlinks[i]).then(
                        (result) => {
                            numHyperlinks += 1;
                            if(numHyperlinks === hyperlinks.length) {
                                fulfill();
                            }
                        }, (error) => {
                            if(error.code === 101) {
        						// object with id "id" not found
        						reject(ErrorUtils.PARSE_OBJECT_NOT_FOUND_ERROR(hyperlinks[numHyperlinks], CLASS_NAME));
        					} else {
        						reject(Error(error));
        					}
                        }
                    );
                }
            }).then(
                (result) => {
                    _hyperLinks.set(this, hyperlinks);
                    fulfill();
                }, (error) => {
                    reject(error);
                }
            )

        });
    }

    validateType() {
        return new Promise((fulfill, reject) => {

            var type = this.object[TYPE_FIELD];

            // no such field name
            if(type === undefined) {
                reject(ErrorUtils.FIELD_NOT_PRESENT_ERROR(TYPE_FIELD, CLASS_NAME));
            }

            // if not String, invalid
            if(!validate.isString(type)) {
                reject(ErrorUtils.TYPE_NOT_CORRECT_ERROR(TYPE_FIELD, CLASS_NAME, typeof(type), 'String'));
            }

            // if type not one of previously decided, invalid
            var typeValid = false;
            for(var i=0; i<POSSIBLE_SEGMENT_TYPES.length; i++) {

                if(POSSIBLE_SEGMENT_TYPES[i] === type) {
                    typeValid = true;
                    break;
                }
            }
            if(!typeValid) {
                reject(ErrorUtils.NOT_VALID_VALUE_ERROR(TYPE_FIELD, CLASS_NAME, POSSIBLE_SEGMENT_TYPES));
            }

            _type.set(this, type);
            fulfill();

        });
    }

    // TODO: write comments
    // This should be called only after the validateType() method is called
    validateResource() {
        return new Promise((fulfill, reject) => {

            var resource = this.object[RESOURCE_FIELD];

            // no such field
            if(resource === undefined) {
                reject(ErrorUtils.FIELD_NOT_PRESENT_ERROR(RESOURCE_FIELD, CLASS_NAME));
            }

            // Image Resource
            if((this.object[TYPE_FIELD] === IMAGE_TYPE_NAME)) {
                new Image(JSON.stringify(resource)).then(
                    (result) => {
                        if(result.constructor.name === IMAGE_TYPE_NAME) {
                            _resource.set(this, result);
                        } else {
                            reject(ErrorUtils.TYPE_NOT_CORRECT_ERROR(RESOURCE_FIELD, CLASS_NAME, result.constructor.name, 'image'));
                        }
                    }, (error) => {
                        reject(error);
                    }
                );
            }

            // Video Resource
            if((this.object[TYPE_FIELD] === VIDEO_TYPE_NAME)) {
                new Video(JSON.stringify(resource)).then(
                    (result) => {
                        if(result.constructor.name === VIDEO_TYPE_NAME) {
                            _resource.set(this, result);
                        } else {
                            reject(ErrorUtils.TYPE_NOT_CORRECT_ERROR(RESOURCE_FIELD, CLASS_NAME, result.constructor.name, 'Video'));
                        }
                    }, (error) => {
                        reject(error);
                    }
                );
            }

            // Question Resource
            if((this.object[TYPE_FIELD] === QUESTION_TYPE_NAME)) {
                new Question(JSON.stringify(resource)).then(
                    (result) => {
                        if(result.constructor.name === QUESTION_TYPE_NAME) {
                            _resource.set(this, result);
                        } else {
                            reject(ErrorUtils.TYPE_NOT_CORRECT_ERROR(RESOURCE_FIELD, CLASS_NAME, result.constructor.name, 'Question'));
                        }
                    }, (error) => {
                        reject(error);
                    }
                );
            }

            fulfill();

        });
    }

    validateIsEdited() {
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
    Slide
}

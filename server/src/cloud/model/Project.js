/**
 * This class {Project} represents a an extension of the {Parse.Object}
 * class, which will be the highest level class in our database.
 * All other classes in the database will be directly or indirectly
 * referenced by this object.
 * The following JSON represents the schema of this {Parse.Object}
 *
 * {
 * 		id {String}: ...,
 * 		parent {String}: ...,
 * 		original_parent {String}: ...,
 * 		name {String}: ...,
 * 		description {String}: ...,
 * 		tags {String Array}: [...],
 * 		is_dubbed {boolean}: ...,
 * 		category {String}: ...,
 * 		language {String}: ...,
 * 		author {String}: ...,
 * 		resolution_x {int}: ...,
 * 		resolution_y {int}: ...,
 * 		slide_ordering_sequence {int Array}: [...],
 * 		slides {Slide Array}: [...]
 * }
 */

// imports
var fs = require('fs');
var validate = require('validate.js');

var JsonUtils = require('../util/JsonUtils.js');
var ErrorUtils = require('../util/ErrorUtils.js');
// var Slide = require('./Slide.js').Slide;
var ParseClass = require('./interface/ParseClass.js');

/* private variables to this class are stored in the form of these WeakMaps
 * (where the key is the instance object "this", and the value is the value
 * of the variable). These can only be accessed through the getters and setters
 * in the instance object using these variables, and so we (as a programmer)
 * can control how much can another class access these variables. This is one of
 * the best (and easiest!) ways to implement private variables in JavaScript
 */
const _parent = new WeakMap();
const _originalParent = new WeakMap();
const _category = new WeakMap();
const _language = new WeakMap();
const _author = new WeakMap();
const _name = new WeakMap();
const _description = new WeakMap();
const _tags = new WeakMap();
const _isDubbed = new WeakMap();
const _isEdited = new WeakMap();
const _resolutionX = new WeakMap();
const _resolutionY = new WeakMap();
const _slideOrderingSequence = new WeakMap();
const _slides = new WeakMap();

/*
 * constants
 */
const CLASS_NAME = ParseClass.projectConfig.CLASS_NAME;
const ID_FIELD = ParseClass.projectConfig.ID_FIELD;
const PARENT_FIELD = ParseClass.projectConfig.PARENT_FIELD;
const ORIGINAL_PARENT_FIELD = ParseClass.projectConfig.ORIGINAL_PARENT_FIELD;
const CATEGORY_FIELD = ParseClass.projectConfig.CATEGORY_FIELD;
const LANGUAGE_FIELD = ParseClass.projectConfig.LANGUAGE_FIELD;
const AUTHOR_FIELD = ParseClass.projectConfig.AUTHOR_FIELD;
const NAME_FIELD = ParseClass.projectConfig.NAME_FIELD;
const DESCRIPTION_FIELD = ParseClass.projectConfig.DESCRIPTION_FIELD;
const TAGS_FIELD = ParseClass.projectConfig.TAGS_FIELD;
const IS_DUBBED_FIELD = ParseClass.projectConfig.IS_DUBBED_FIELD;
const IS_EDITED_FIELD = ParseClass.projectConfig.IS_EDITED_FIELD;
const RESOLUTION_X_FIELD = ParseClass.projectConfig.RESOLUTION_X_FIELD;
const RESOLUTION_Y_FIELD = ParseClass.projectConfig.RESOLUTION_Y_FIELD;
const SLIDE_ORDERING_SEQUENCE_FIELD = ParseClass.projectConfig.SLIDE_ORDERING_SEQUENCE_FIELD;
const SLIDES_FIELD = ParseClass.projectConfig.SLIDES_FIELD;

/**
 * A {Parse.Object} that represents a row in the {Project} class of the database
 *
 * public methods
 * 		constructor
 * 		constructFromParse.Object
 * 		constructFromJsonString
 * 		parseJson
 * 		validateId
 * 		validateParentId
 * 		validateOriginalParentId
 * 		validateCategoryId
 * 		validateLanguageId
 * 		validateAuthorId
 * 		validateName
 * 		validateDescription
 *		validateTags
 * 		validateIsDubbed
 * 		validateResolution
 * 		validateResolutionX
 * 		validateResolutionY
 * 		validateSlideOrderingSequence
 * 		validateSlides
 * 		save
 *
 * public attributes
 * 		id (gettable, settable)
 * 		parent (gettable)
 * 		originalParent (gettable)
 * 		name (gettable)
 *		description (gettable)
 * 		tags (gettable)
 * 		isDubbed (gettable)
 * 		category (gettable)
 * 		language (gettable)
 * 		author (gettable)
 * 		resolutionX (gettable)
 * 		resolutionY (gettable)
 * 		slideOrderingSequence (gettable) : consists "Slide.project_slide_id" values
 * 		slides (gettable)
 */
class Project extends ParseClass.ParseClass {

	/*
	 * Implement the ParseClass.ParseClass interface
	 * ---------------------------------------------
	 */

	constructor(parameter: string | Project): Promise {
		super(CLASS_NAME, parameter);
	}

	getObject() {
		return this.object;
	}

	/**
	 * if Parse.Object is provided as input, then we just have to
	 * read the required fields from the provided Object
	 */
	constructorFromParseObject(parseObject: Parse.Object): Promise {
		return new Promise((fulfill, reject) => {

			try {
				this.id = parseObject.get(ID_FIELD);
				_parent.set(this, parseObject.get(PARENT_FIELD));
				_originalParent.set(this, parseObject.get(ORIGINAL_PARENT_FIELD));

				_name.set(this, parseObject.get(NAME_FIELD));
				_description.set(this, parseObject.get(DESCRIPTION_FIELD));
				_tags.set(this, parseObject.get(TAGS_FIELD));
				_isDubbed.set(this, parseObject.get(IS_DUBBED_FIELD));
				_isEdited.set(this, parseObject.get(IS_EDITED_FIELD));
				_category.set(this, parseObject.get(CATEGORY_FIELD));
				_langauge.set(this, parseObject.get(LANGUAGE_FIELD));
				_author.set(this, parseObject.get(AUTHOR_FIELD));
				_resolutionX.set(this, parseObject.get(RESOLUTION_X_FIELD));
				_resolutionY.set(this, parseObject.get(RESOLUTION_Y_FIELD));
				_slideOrderingSequence.set(this, parseObject.get(SLIDE_ORDERING_SEQUENCE_FIELD));
				_slides.set(this, parseObject.get(SLIDES_FIELD));
			} catch (error) {
				reject(error);
			}

		});
	}

	/**
	 * if JSON string is provided as input, then we will have to parse
	 * the JSON and generate a new Parse.Object
	 */
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
					// return the initialized object
					fulfill(this);
				}, (error) => {
					reject(error);
				}
			);
		});
	}

	toJsonStringWithIds(): string {
		return '{}'
	}

	toJsonStringWithObjects(): string {
		return '{}'
	}

	/*
	 * Implement the methods specific to Project Class
	 * -----------------------------------------------
	 */

	/**
	 * validates and parses this.jsonString according to the expected JSON schema
	 * (look at the module description for the expected JSON schema)
	 *
	 * @return {Promise} :
	 * 		fulfilled iff the JSON schema is correct (as per the above schema), returning
	 * 			this Project instance, with all variables initialized according to the values
	 * 			in the JSON
	 * 		rejected if any errors caught or schema invalid, returning the error message
	 */
	parseJson(): Promise {
		return new Promise((fulfill, reject) => {
								 this.validateId()
			.then(() => { return this.validateParentId()})
			.then(() => { return this.validateOriginalParentId()})
			.then(() => { return this.validateCategoryId()})
			.then(() => { return this.validateLanguageId()})
			.then(() => { return this.validateAuthorId()})
			.then(() => { return this.validateName()})
			.then(() => { return this.validateDescription()})
			.then(() => { return this.validateTags()})
			.then(() => { return this.validateIsDubbed()})
			.then(() => { return this.validateIsEdited()})
			.then(() => { return this.validateResolutionX()})
			.then(() => { return this.validateResolutionY()})
			.then(() => { return this.validateSlides()})
			.then(() => { return this.validateSlideOrderingSequence()})
			.then(() => {
				delete this.jsonString;
				delete this.object;
				fulfill(this);
			})
			.catch((error) => { console.log(error); reject(Error(error))});
		});
	}

	/**
	 * validates the ID_FIELD field
	 * look at "validateIdField" method for description
	 */
	validateId(): Promise {
		return new Promise((fulfill, reject) => {
			this.validateIdField(ID_FIELD, CLASS_NAME).then(
				() => {

					// CANNOT MAKE ID NOT SETTABLE BECAUSE WHEN USING THE Parse.Object.set METHOD,
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

	/**
	 * validates the PARENT_FIELD field
	 * look at "validateIdField" method for description
	 */
	validateParentId(): Promise {
		return new Promise((fulfill, reject) => {

			this.validateIdField(PARENT_FIELD, CLASS_NAME).then(
				(result) => {
					_parent.set(this, result);
					fulfill();
				}, (error) => {
					reject(error);
				}
			);

		});
	}

	/**
	 * validates the ORIGINAL_PARENT_FIELD field
	 * look at "validateIdField" method for description
	 */
	validateOriginalParentId(): Promise {
		return new Promise((fulfill, reject) => {

			this.validateIdField(ORIGINAL_PARENT_FIELD, CLASS_NAME).then(
				(result) => {
					_originalParent.set(this, result);
					fulfill();
				}, (error) => {
					reject(error);
				}
			);

		});
	}

	/**
	 * validates the CATEGORY_FIELD field
	 * look at "validateIdField" method for description
	 */
	validateCategoryId(): Promise {
		return new Promise((fulfill, reject) => {

			this.validateIdField(CATEGORY_FIELD, ParseClass.categoryConfig.CLASS_NAME).then(
				(result) => {
					_category.set(this, result);
					fulfill()
				}, (error) => {
					reject(error);
				}
			)

		});
	}

	/**
	 * validates the LANGUAGE_FIELD field
	 * look at "validateIdField" method for description
	 */
	validateLanguageId(): Promise {
		return new Promise((fulfill, reject) => {

			this.validateIdField(LANGUAGE_FIELD, ParseClass.languageConfig.CLASS_NAME).then(
				(result) => {
					_language.set(this, result);
					fulfill();
				}, (error) => {
					reject(error);
				}
			);

		});
	}

	/**
	 * validates the AUTHOR_FIELD field
	 * look at "validateIdField" method for description
	 */
	validateAuthorId(): Promise {
		return new Promise((fulfill, reject) => {

			this.validateIdField(AUTHOR_FIELD, ParseClass.userConfig.CLASS_NAME).then(
				(result) => {
					_author.set(this, result);
					fulfill();
				}, (error) => {
					reject(error);
				}
			);

		});
	}

	/**
	 * validates the NAME_FIELD field
	 * @return {Promise} :
	 * 		fulfilled iff NAME_FIELD field exists in the JSON and
	 * 		value is String
	 * 		rejected otherwise, returning the error message
	 */
	validateName(): Promise {
		return new Promise((fulfill, reject) => {

			var name = this.object[NAME_FIELD];

			// no such field
			if(name === undefined) {
				reject(ErrorUtils.FIELD_NOT_PRESENT_ERROR(NAME_FIELD, CLASS_NAME));
			}

			// if not string, invalid
			if(!validate.isString(name)) {
				reject(ErrorUtils.TYPE_NOT_CORRECT_ERROR(NAME_FIELD, CLASS_NAME, typeof(name), 'String'));
			}

			// TODO: CHECK FOR SPECIAL CHARACTERS IN THE STRING
			// use validate.js and RegEx for doing this

			_name.set(this, name);
			fulfill();

		});
	}

	/**
	 * validates the DESCRIPTION_FIELD field
	 * @return {Promise} :
	 * 		fulfilled iff DESCRIPTION_FIELD field exists in the JSON and
	 * 		value is String
	 *		rejected otherwise
	 */
	validateDescription(): Promise {
		return new Promise((fulfill, reject) => {

			var description = this.object[DESCRIPTION_FIELD];

			// no such field
			if(description === undefined) {
				reject(ErrorUtils.FIELD_NOT_PRESENT_ERROR(DESCRIPTION_FIELD, CLASS_NAME));
			}

			// if not string, invalid
			if(!validate.isString(description)) {
				reject(ErrorUtils.TYPE_NOT_CORRECT_ERROR(DESCRIPTION_FIELD, CLASS_NAME, typeof(description), 'String'));
			}

			// TODO: validate description length
			_description.set(this, description);
			fulfill();

		});
	}

	/**
	 * validates the DESCRIPTION_FIELD field
	 * @return {Promise} :
	 * 		fulfilled iff DESCRIPTION_FIELD field exists in the JSON and
	 * 		value is Array and
	 * 		value of each element in the Array is String
	 *		rejected otherwise
	 */
	validateTags(): Promise {
		return new Promise((fulfill, reject) => {

			var tags = this.object[TAGS_FIELD];

			// no such field
			if(tags === undefined) {
				reject(ErrorUtils.FIELD_NOT_PRESENT_ERROR(TAGS_FIELD, CLASS_NAME));
			}

			// if not array, invalid
			if(!validate.isArray(tags)) {
				reject(ErrorUtils.TYPE_NOT_CORRECT_ERROR(TAGS_FIELD, CLASS_NAME, typeof(tags), 'Array'));
			}

			// TODO: decide if tags should be Strings, or Parse.Objects
			// if array elements not string, invalid
			for(var i=0; i<tags.length; i++) {
				var element = tags[i];
				if(!validate.isString(element)) {
					reject(ErrorUtils.TYPE_NOT_CORRECT_ERROR(TAGS_FIELD, CLASS_NAME, typeof(tags), 'StringArray'));
				}
			}

			_tags.set(this, tags);
			fulfill();

		});
	}

	/**
	 * validates the IS_DUBBED_FIELD field
	 * @return {Promise} :
	 * 		fulfilled iff IS_DUBBED_FIELD field exists in the JSON and
	 * 		value is boolean
	 * 		rejected otherwise, returning the error message
	 */
	validateIsDubbed(): Promise {
		return new Promise((fulfill, reject) => {

			var isDubbed = this.object[IS_DUBBED_FIELD];

			// no such field
			if(isDubbed === undefined) {
				reject(ErrorUtils.FIELD_NOT_PRESENT_ERROR(IS_DUBBED_FIELD, CLASS_NAME));
			}

			// not a boolean, invalid
			if(!validate.isBoolean(isDubbed)) {
				reject(ErrorUtils.TYPE_NOT_CORRECT_ERROR(IS_DUBBED_FIELD, CLASS_NAME, typeof(isDubbed), 'boolean'));
			}

			_isDubbed.set(this, isDubbed);
			fulfill();

		});

	}

	/**
	 * validates the IS_EDITED_FIELD field
	 * @return {Promise} :
	 * 		fulfilled iff IS_EDITED_FIELD field exists in the JSON and
	 * 		value is boolean
	 */
	validateIsEdited(): Promise {
		return new Promise((fulfill, reject) => {

			super.validateIsEdited(IS_EDITED_FIELD, CLASS_NAME).then(
				(result) => {
					_isEdited.set(this, result);
					fulfill();
				}, (error) => {
					reject(error);
				}
			)
		});

	}

	/**
	 * validates the ParseClass.projectConfig.RESOLUTION_*_FIELD fields
	 * @param {String} resolutionField : name of the field to be validated
	 * @param {String} instanceVariableName : the name of instance variable of this class
	 * 		to which the resolution value is assigned
	 *
	 * @return {Promise} :
	 * 		fulfilled iff resolutionField field exists in the JSON and
	 * 		value is integer
	 * 		rejected otherwise, returning the error message
	 */
	validateResolution(resolutionField: string, instanceVariableName: string): Promise {

		return new Promise((fulfill, reject) => {

			var resolution = this.object[resolutionField];

			// no such field
			if(resolution === undefined) {
				reject(ErrorUtils.FIELD_NOT_PRESENT_ERROR(resolutionField, CLASS_NAME));
			}

			// if not integer, invalid
			if(!validate.isInteger(resolution)) {
				reject(ErrorUtils.TYPE_NOT_CORRECT_ERROR(resolutionField, CLASS_NAME, typeof(resolution), 'boolean'));
			}

			// TODO: CHECK IF RESOLUTION IS VALID (i.e not negative, ...)

			fulfill(resolution);

		});
	}

	/**
	 * validates the ParseClass.projectConfig.RESOLUTION_X field
	 * look at "validateResolution" method for description
	 */
	validateResolutionX(): Promise {

		return new Promise((fulfill, reject) => {

			this.validateResolution(RESOLUTION_X_FIELD, 'resolutionX').then(
				(result) => {
					_resolutionX.set(this, result);
					fulfill();
				}, (error) => {
					reject(error);
				}
			);

		});
	}

	/**
	 * validates the ParseClass.projectConfig.RESOLUTION_Y field
	 * look at "validateResolution" method for description
	 */
	validateResolutionY(): Promise {

		return new Promise((fulfill, reject) => {

			this.validateResolution(RESOLUTION_Y_FIELD, 'resolutionY').then(
				(result) => {
					_resolutionY.set(this, result);
					fulfill();
				}, (error) => {
					reject(error);
				}
			);

		});
	}

	/**
	 * validates each slide in the array corresponding to the SLIDES_FIELD field
	 * @return {Promise} :
	 * 		fulfilled if value is an array and
	 * 		every element in the array represents a valid {Slide} object
	 * 		(look at the Slide.js module for more information on what represents
  	 * 		a valid Slide object)
	 */
	validateSlides(): Promise {

		// TODO: uncomment
		// return new Promise((fulfill, reject) => {
		//
		// 	var slides = this.object[SLIDES_FIELD];
		//
		// 	// no such field
		// 	if(slides === undefined) {
		// 		reject(ErrorUtils.FIELD_NOT_PRESENT_ERROR(SLIDES_FIELD, CLASS_NAME));
		// 	}
		//
		// 	// if not array, invalid
		// 	if(!validate.isArray(slides)) {
		// 		reject(ErrorUtils.TYPE_NOT_CORRECT_ERROR(SLIDES_FIELD, CLASS_NAME, typeof(slides), 'Array'));
		// 	}
		//
		// 	var _slides_ = [];
		// 	// if any element is not a Slide Object, then invalid
		// 	new Promise((fulfill, reject) => {
		//
		// 		// if no slides, then fulfill
		// 		if(slides.length === 0) {
		// 			fulfill();
		// 		}
		//
		// 		var numFulfilled = 0;
		// 		for(var i=0; i<slides.length; i++) {
		// 			var slide = slides[i];
		// 			new Slide(JSON.stringify(slide)).then(
		// 				(result) => {
		// 					// successfully initialized Slide Object
		// 					_slides_.push(result);
		// 					numFulfilled += 1;
		// 					if(numFulfilled === slides.length) {
		// 						// this was the last slide to fulfill its promise
		// 						fulfill();
		// 					}
		// 				}, (error) => {
		// 					// not valid Slide Object
		// 					reject(error);
		// 				}
		// 			);
		// 		}
		// 	}).then(
		// 		() => {
		// 			_slides.set(this, _slides_);
		// 			fulfill();
		// 		}, (error) => {
		// 			reject(error);
		// 		}
		// 	);
		// });

		return new Promise((fulfill, reject) => {
			fulfill();
		});
	}

	/**
	 * validates the SLIDE_ORDERING_SEQUENCE_FIELD field
	 * @return {Promise} :
	 * 		fulfilled iff SLIDE_ORDERING_SEQUENCE_FIELD field exists in JSON and
	 * 		the value is an integer Array
	 * 		rejected otherwise, returning the error message
	 */
	validateSlideOrderingSequence(): Promise {
		return new Promise((fulfill, reject) => {

			var slideOrderingSequence = this.object[SLIDE_ORDERING_SEQUENCE_FIELD];

			// no such field
			if(slideOrderingSequence === undefined) {
				reject(ErrorUtils.FIELD_NOT_PRESENT_ERROR(SLIDE_ORDERING_SEQUENCE_FIELD, CLASS_NAME));
			}

			// if not array, invalid
			if(!validate.isArray(slideOrderingSequence)) {
				reject(ErrorUtils.TYPE_NOT_CORRECT_ERROR(SLIDE_ORDERING_SEQUENCE_FIELD, CLASS_NAME, typeof(slideOrderingSequence), 'Integer Array'));
			}

			// if any element is not an integer, then invalid
			for(var i=0; i<slideOrderingSequence.length; i++) {
				if(!validate.isInteger(slideOrderingSequence[i])) {
					reject(ErrorUtils.TYPE_NOT_CORRECT_ERROR(SLIDE_ORDERING_SEQUENCE_FIELD + ' : ELEMENT : ', CLASS_NAME, typeof(slideOrderingSequence[i]), 'Integer'));
				}
			}

			// TODO: check if all the corresponding slides present

			_slideOrderingSequence.set(this, slideOrderingSequence);
			fulfill();
		});
	}

	/**
	 * saves the parse object to the databaes
	 * @return {Promise} fulfilled when object is saved successfully to the database
	 */
	save(): Promise {
		this.set('id', this.id);
		this.set('parent', this.parent);
		this.set('original_parent', this.originalParent);
		this.set('name', this.name);
		this.set('description', this.description);
		this.set('tags', this.tags);
		this.set('is_dubbed', this.isDubbed);
		this.set('is_edited', this.isEdited);
		this.set('category', this.category);
		this.set('language', this.language);
		this.set('author', this.author);
		this.set('resolution_x', this.resolutionX);
		this.set('resolution_y', this.resolutionY);
		this.set('slide_ordering_sequence', this.slideOrderingSequence);
		this.set('slides', this.slides);

		return super.save();
	}

	/*
	 * getters and setters for private / public class variables
	 * --------------------------------------------------------
	 */

	get parent() {
		return _parent.get(this);
	}

	get originalParent() {
		return _parent.get(this);
	}

	get category() {
		return _category.get(this);
	}

	get language() {
		return _language.get(this);
	}

	get author() {
		return _author.get(this);
	}

	get name() {
		return _name.get(this);
	}

	get description() {
		return _description.get(this);
	}

	get tags() {
		return _tags.get(this);
	}

	get isDubbed() {
		return _isDubbed.get(this);
	}

	get isEdited() {
		return _isEdited.get(this);
	}

	get resolutionX() {
		return _resolutionX.get(this);
	}

	get resolutionY() {
		return _resolutionY.get(this);
	}

	get slideOrderingSequence() {
		return _slideOrderingSequence.get(this);
	}

	get slides() {
		return _slides.get(this);
	}

	set parent(val) {
		var error = ErrorUtils.CANNOT_SET_OBJECT_PROPERTY_ERROR(CLASS_NAME, 'parent');
		console.log(error);
		throw error;
	}

	set originalParent(val) {
		var error = ErrorUtils.CANNOT_SET_OBJECT_PROPERTY_ERROR(CLASS_NAME, 'originalParent');
		console.log(error);
		throw error;
	}

	set category(val) {
		var error = ErrorUtils.CANNOT_SET_OBJECT_PROPERTY_ERROR(CLASS_NAME, 'category');
		console.log(error);
		throw error;
	}

	set language(val) {
		var error = ErrorUtils.CANNOT_SET_OBJECT_PROPERTY_ERROR(CLASS_NAME, 'language');
		console.log(error);
		throw error;
	}

	set author(val) {
		var error = ErrorUtils.CANNOT_SET_OBJECT_PROPERTY_ERROR(CLASS_NAME, 'author');
		console.log(error);
		throw error;
	}

	set name(val) {
		var error = ErrorUtils.CANNOT_SET_OBJECT_PROPERTY_ERROR(CLASS_NAME, 'name');
		console.log(error);
		throw error;
	}

	set description(val) {
		var error = ErrorUtils.CANNOT_SET_OBJECT_PROPERTY_ERROR(CLASS_NAME, 'description');
		console.log(error);
		throw error;
	}

	set tags(val) {
		var error = ErrorUtils.CANNOT_SET_OBJECT_PROPERTY_ERROR(CLASS_NAME, 'tags');
		console.log(error);
		throw error;
	}

	set isDubbed(val) {
		var error = ErrorUtils.CANNOT_SET_OBJECT_PROPERTY_ERROR(CLASS_NAME, 'isDubbed');
		console.log(error);
		throw error;
	}

	set isEdited(val) {
		var error = ErrorUtils.CANNOT_SET_OBJECT_PROPERTY_ERROR(CLASS_NAME, 'isEdited');
		console.log(error);
		throw error;
	}

	set resolutionX(val) {
		var error = ErrorUtils.CANNOT_SET_OBJECT_PROPERTY_ERROR(CLASS_NAME, 'resolutionX');
		console.log(error);
		throw error;
	}

	set resolutionY(val) {
		var error = ErrorUtils.CANNOT_SET_OBJECT_PROPERTY_ERROR(CLASS_NAME, 'resolutionY');
		console.log(error);
		throw error;
	}

	set slideOrderingSequence(val) {
		var error = ErrorUtils.CANNOT_SET_OBJECT_PROPERTY_ERROR(CLASS_NAME, 'slideOrderingSequence');
		console.log(error);
		throw error;
	}

	set slides(val) {
		var error = ErrorUtils.CANNOT_SET_OBJECT_PROPERTY_ERROR(CLASS_NAME, 'slides');
		console.log(error);
		throw error;
	}
}

// when using extends, the SDK is not automatically aware of the subclass
// so have to do it manually
Parse.Object.registerSubclass(CLASS_NAME, Project);

module.exports = {
	Project
}

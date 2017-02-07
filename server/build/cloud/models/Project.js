'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

var JsonUtils = require('../utils/JsonUtils.js');
var ErrorUtils = require('../utils/ErrorUtils.js');
var Slide = require('./Slide.js').Slide;
var ParseClass = require('./interfaces/ParseClass.js');

/* private variables to this class are stored in the form of these WeakMaps
 * (where the key is the instance object "this", and the value is the value
 * of the variable). These can only be accessed through the getters and setters
 * in the instance object using these variables, and so we (as a programmer)
 * can control how much can another class access these variables. This is one of
 * the best (and easiest!) ways to implement private variables in JavaScript
 */
var _parent = new WeakMap();
var _originalParent = new WeakMap();
var _category = new WeakMap();
var _language = new WeakMap();
var _author = new WeakMap();
var _name = new WeakMap();
var _description = new WeakMap();
var _tags = new WeakMap();
var _isDubbed = new WeakMap();
var _isEdited = new WeakMap(); // TODO
var _resolutionX = new WeakMap();
var _resolutionY = new WeakMap();
var _slideOrderingSequence = new WeakMap();
var _slides = new WeakMap();

/*
 * constants
 */
var CLASS_NAME = ParseClass.projectConfig.CLASS_NAME;
var ID_FIELD = ParseClass.projectConfig.ID_FIELD;
var PARENT_FIELD = ParseClass.projectConfig.PARENT_FIELD;
var ORIGINAL_PARENT_FIELD = ParseClass.projectConfig.ORIGINAL_PARENT_FIELD;
var CATEGORY_FIELD = ParseClass.projectConfig.CATEGORY_FIELD;
var LANGUAGE_FIELD = ParseClass.projectConfig.LANGUAGE_FIELD;
var AUTHOR_FIELD = ParseClass.projectConfig.AUTHOR_FIELD;
var NAME_FIELD = ParseClass.projectConfig.NAME_FIELD;
var DESCRIPTION_FIELD = ParseClass.projectConfig.DESCRIPTION_FIELD;
var TAGS_FIELD = ParseClass.projectConfig.TAGS_FIELD;
var IS_DUBBED_FIELD = ParseClass.projectConfig.IS_DUBBED_FIELD;
var IS_EDITED_FIELD = ParseClass.projectConfig.IS_EDITED_FIELD;
var RESOLUTION_X_FIELD = ParseClass.projectConfig.RESOLUTION_X_FIELD;
var RESOLUTION_Y_FIELD = ParseClass.projectConfig.RESOLUTION_Y_FIELD;
var SLIDE_ORDERING_SEQUENCE_FIELD = ParseClass.projectConfig.SLIDE_ORDERING_SEQUENCE_FIELD;
var SLIDES_FIELD = ParseClass.projectConfig.SLIDES_FIELD;

/**
 * A {Parse.Object} that represents a row in the {Project} class of the database
 *
 * // TODO: if time persists, make methods private
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

var Project = function (_ParseClass$ParseClas) {
	_inherits(Project, _ParseClass$ParseClas);

	/*
  * Implement the ParseClass.ParseClass interface
  * ---------------------------------------------
  */

	function Project(parameter) {
		var _this, _ret;

		_classCallCheck(this, Project);

		return _ret = (_this = _possibleConstructorReturn(this, (Project.__proto__ || Object.getPrototypeOf(Project)).call(this, CLASS_NAME, parameter)), _this), _possibleConstructorReturn(_this, _ret);
	}

	/**
  * if Parse.Object is provided as input, then we just have to
  * read the required fields from the provided Object
  */


	_createClass(Project, [{
		key: 'constructorFromParseObject',
		value: function constructorFromParseObject(parseObject) {
			var _this2 = this;

			return new Promise(function (fulfill, reject) {

				try {
					_this2.id = parseObject.get(ID_FIELD);
					_parent.set(_this2, parseObject.get(PARENT_FIELD));
					_originalParent.set(_this2, parseObject.get(ORIGINAL_PARENT_FIELD));
					_name.set(_this2, parseObject.get(NAME_FIELD));
					_description.set(_this2, parseObject.get(DESCRIPTION_FIELD));
					_tags.set(_this2, parseObject.get(TAGS_FIELD));
					_isDubbed.set(_this2, parseObject.get(IS_DUBBED_FIELD));
					_isEdited.set(_this2, parseObject.get(IS_EDITED_FIELD));
					_category.set(_this2, parseObject.get(CATEGORY_FIELD));
					_langauge.set(_this2, parseObject.get(LANGUAGE_FIELD));
					_author.set(_this2, parseObject.get(AUTHOR_FIELD));
					_resolutionX.set(_this2, parseObject.get(RESOLUTION_X_FIELD));
					_resolutionY.set(_this2, parseObject.get(RESOLUTION_Y_FIELD));
					_slideOrderingSequence.set(_this2, parseObject.get(SLIDE_ORDERING_SEQUENCE_FIELD));
					_slides.set(_this2, parseObject.get(SLIDES_FIELD));
				} catch (error) {
					reject(error);
				}
			});
		}

		/**
   * if JSON string is provided as input, then we will have to parse
   * the JSON and generate a new Parse.Object
   */

	}, {
		key: 'constructorFromJsonString',
		value: function constructorFromJsonString(jsonString) {
			var _this3 = this;

			this.jsonString = jsonString;
			this.object = JsonUtils.tryParseJSON(jsonString) || null;

			if (this.object === null) {
				// json string not valid
				return new Promise(function (fulfill, reject) {
					reject(ErrorUtils.NOT_VALID_JSON_ERROR());
				});
			}

			return new Promise(function (fulfill, reject) {
				_this3.parseJson().then(function () {
					// return the initialized object
					fulfill(_this3);
				}, function (error) {
					reject(error);
				});
			});
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

	}, {
		key: 'parseJson',
		value: function parseJson() {
			var _this4 = this;

			return new Promise(function (fulfill, reject) {
				_this4.validateId().then(function () {
					return _this4.validateParentId();
				}).then(function () {
					return _this4.validateOriginalParentId();
				}).then(function () {
					return _this4.validateCategoryId();
				}).then(function () {
					return _this4.validateLanguageId();
				}).then(function () {
					return _this4.validateAuthorId();
				}).then(function () {
					return _this4.validateName();
				}).then(function () {
					return _this4.validateDescription();
				}).then(function () {
					return _this4.validateTags();
				}).then(function () {
					return _this4.validateIsDubbed();
				}).then(function () {
					return _this4.validateIsEdited();
				}).then(function () {
					return _this4.validateResolutionX();
				}).then(function () {
					return _this4.validateResolutionY();
				}).then(function () {
					return _this4.validateSlideOrderingSequence();
				}).then(function () {
					return _this4.validateSlides();
				}).then(function () {
					fulfill(_this4);
				}).catch(function (error) {
					reject(Error(error));
				});
			});
		}

		/**
   * validates the ID_FIELD field
   * look at "validateIdField" method for description
   */

	}, {
		key: 'validateId',
		value: function validateId() {
			var _this5 = this;

			return new Promise(function (fulfill, reject) {
				_this5.validateIdField(ID_FIELD, CLASS_NAME).then(function () {

					// CANNOT MAKE ID NOT SETTABLE BECAUSE WHEN USING THE Parse.Object.set METHOD,
					// PARSE REASSIGNS THE ID FIELD.
					// FOR EVERY OTHER FIELD, PARSE CREATES A NEW ARRAY WITH KEY-VALUE PAIRS
					// TO BE SAVED / UPDATED IN THE DATABASE (WIERD!)

					_this5.id = _this5.object[ID_FIELD];
					fulfill();
				}, function (error) {
					reject(error);
				});
			});
		}

		/**
   * validates the PARENT_FIELD field
   * look at "validateIdField" method for description
   */

	}, {
		key: 'validateParentId',
		value: function validateParentId() {
			return this.validateIdField(PARENT_FIELD, CLASS_NAME);
		}

		/**
   * validates the ORIGINAL_PARENT_FIELD field
   * look at "validateIdField" method for description
   */

	}, {
		key: 'validateOriginalParentId',
		value: function validateOriginalParentId() {
			return this.validateIdField(ORIGINAL_PARENT_FIELD, CLASS_NAME);
		}

		/**
   * validates the CATEGORY_FIELD field
   * look at "validateIdField" method for description
   */

	}, {
		key: 'validateCategoryId',
		value: function validateCategoryId() {
			return this.validateIdField(CATEGORY_FIELD, ParseClass.categoryConfig.CLASS_NAME);
		}

		/**
   * validates the LANGUAGE_FIELD field
   * look at "validateIdField" method for description
   */

	}, {
		key: 'validateLanguageId',
		value: function validateLanguageId() {
			return this.validateIdField(LANGUAGE_FIELD, ParseClass.languageConfig.CLASS_NAME);
		}

		/**
   * validates the AUTHOR_FIELD field
   * look at "validateIdField" method for description
   */

	}, {
		key: 'validateAuthorId',
		value: function validateAuthorId() {
			return this.validateIdField(AUTHOR_FIELD, ParseClass.userConfig.CLASS_NAME);
		}

		/**
   * validates the NAME_FIELD field
   * @return {Promise} :
   * 		fulfilled iff NAME_FIELD field exists in the JSON and
   * 		value is String
   * 		rejected otherwise, returning the error message
   */

	}, {
		key: 'validateName',
		value: function validateName() {
			var _this6 = this;

			return new Promise(function (fulfill, reject) {

				var name = _this6.object[NAME_FIELD];

				// no such field
				if (name === undefined) {
					reject(ErrorUtils.FIELD_NOT_PRESENT_ERROR(NAME_FIELD, CLASS_NAME));
				}

				// if not string, invalid
				if (!validate.isString(name)) {
					reject(ErrorUtils.TYPE_NOT_CORRECT_ERROR(NAME_FIELD, CLASS_NAME, typeof name === 'undefined' ? 'undefined' : _typeof(name), 'String'));
				}

				// TODO: CHECK FOR SPECIAL CHARACTERS IN THE STRING
				// use validate.js and RegEx for doing this

				_name.set(_this6, name);
				fulfill();
			});
		}

		// TODO: add documentation

	}, {
		key: 'validateDescription',
		value: function validateDescription() {
			var _this7 = this;

			return new Promise(function (fulfill, reject) {

				var description = _this7.object[DESCRIPTION_FIELD];

				// no such field
				if (description === undefined) {
					reject(ErrorUtils.FIELD_NOT_PRESENT_ERROR(DESCRIPTION_FIELD, CLASS_NAME));
				}

				// if not string, invalid
				if (!validate.isString(description)) {
					reject(ErrorUtils.TYPE_NOT_CORRECT_ERROR(DESCRIPTION_FIELD, CLASS_NAME, typeof description === 'undefined' ? 'undefined' : _typeof(description), 'String'));
				}

				// TODO: validate description length
				_description.set(_this7, description);
				fulfill();
			});
		}

		// TODO: add documentation

	}, {
		key: 'validateTags',
		value: function validateTags() {
			var _this8 = this;

			return new Promise(function (fulfill, reject) {

				var tags = _this8.object[TAGS_FIELD];

				// no such field
				if (tags === undefined) {
					reject(ErrorUtils.FIELD_NOT_PRESENT_ERROR(TAGS_FIELD, CLASS_NAME));
				}

				// if not array, invalid
				if (!validate.isArray(tags)) {
					reject(ErrorUtils.TYPE_NOT_CORRECT_ERROR(TAGS_FIELD, CLASS_NAME, typeof tags === 'undefined' ? 'undefined' : _typeof(tags), 'Array'));
				}

				// TODO: decide if tags should be Strings, or Parse.Objects
				// if array elements not string, invalid
				for (var i = 0; i < tags.length; i++) {
					var element = tags[i];
					if (!validate.isString(element)) {
						reject(ErrorUtils.TYPE_NOT_CORRECT_ERROR(TAGS_FIELD, CLASS_NAME, typeof tags === 'undefined' ? 'undefined' : _typeof(tags), 'StringArray'));
					}
				}

				_tags.set(_this8, tags);
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

	}, {
		key: 'validateIsDubbed',
		value: function validateIsDubbed() {
			var _this9 = this;

			return new Promise(function (fulfill, reject) {

				var isDubbed = _this9.object[IS_DUBBED_FIELD];

				// no such field
				if (isDubbed === undefined) {
					reject(ErrorUtils.FIELD_NOT_PRESENT_ERROR(IS_DUBBED_FIELD, CLASS_NAME));
				}

				// not a boolean, invalid
				if (!validate.isBoolean(isDubbed)) {
					reject(ErrorUtils.TYPE_NOT_CORRECT_ERROR(IS_DUBBED_FIELD, CLASS_NAME, typeof isDubbed === 'undefined' ? 'undefined' : _typeof(isDubbed), 'boolean'));
				}

				_isDubbed.set(_this9, isDubbed);
				fulfill();
			});
		}

		// TODO: add documentation

	}, {
		key: 'validateIsEdited',
		value: function validateIsEdited() {
			var _this10 = this;

			return new Promise(function (fulfill, reject) {

				console.log(_get(Project.prototype.__proto__ || Object.getPrototypeOf(Project.prototype), 'validateIsEdited', _this10));
				_get(Project.prototype.__proto__ || Object.getPrototypeOf(Project.prototype), 'validateIsEdited', _this10).call(_this10, IS_EDITED_FIELD, CLASS_NAME).then(function (result) {
					_isEdited.set(_this10, result);
					fulfill();
				}, function (error) {
					reject(error);
				});
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

	}, {
		key: 'validateResolution',
		value: function validateResolution(resolutionField, instanceVariableName) {
			var _this11 = this;

			return new Promise(function (fulfill, reject) {

				var resolution = _this11.object[resolutionField];

				// no such field
				if (resolution === undefined) {
					reject(ErrorUtils.FIELD_NOT_PRESENT_ERROR(resolutionField, CLASS_NAME));
				}

				// if not integer, invalid
				if (!validate.isInteger(resolution)) {
					reject(ErrorUtils.TYPE_NOT_CORRECT_ERROR(resolutionField, CLASS_NAME, typeof resolution === 'undefined' ? 'undefined' : _typeof(resolution), 'boolean'));
				}

				// TODO: CHECK IF RESOLUTION IS VALID (i.e not negative, ...)

				var str = '_' + instanceVariableName + '.set(this, resolution)';
				eval(str);
				fulfill();
			});
		}

		/**
   * validates the ParseClass.projectConfig.RESOLUTION_X field
   * look at "validateResolution" method for description
   */

	}, {
		key: 'validateResolutionX',
		value: function validateResolutionX() {
			return this.validateResolution(RESOLUTION_X_FIELD, 'resolutionX');
		}

		/**
   * validates the ParseClass.projectConfig.RESOLUTION_Y field
   * look at "validateResolution" method for description
   */

	}, {
		key: 'validateResolutionY',
		value: function validateResolutionY() {
			return this.validateResolution(RESOLUTION_Y_FIELD, 'resolutionY');
		}

		/**
   * validates the SLIDE_ORDERING_SEQUENCE_FIELD field
   * @return {Promise} :
   * 		fulfilled iff SLIDE_ORDERING_SEQUENCE_FIELD field exists in JSON and
   * 		the value is an integer Array
   * 		rejected otherwise, returning the error message
   */

	}, {
		key: 'validateSlideOrderingSequence',
		value: function validateSlideOrderingSequence() {
			var _this12 = this;

			return new Promise(function (fulfill, reject) {

				var slideOrderingSequence = _this12.object[SLIDE_ORDERING_SEQUENCE_FIELD];

				// no such field
				if (slideOrderingSequence === undefined) {
					reject(ErrorUtils.FIELD_NOT_PRESENT_ERROR(SLIDE_ORDERING_SEQUENCE_FIELD, CLASS_NAME));
				}

				// if not array, invalid
				if (!validate.isArray(slideOrderingSequence)) {
					reject(ErrorUtils.TYPE_NOT_CORRECT_ERROR(SLIDE_ORDERING_SEQUENCE_FIELD, CLASS_NAME, typeof slideOrderingSequence === 'undefined' ? 'undefined' : _typeof(slideOrderingSequence), 'Integer Array'));
				}

				// if any element is not an integer, then invalid
				for (var i = 0; i < slideOrderingSequence.length; i++) {
					if (!validate.isInteger(slideOrderingSequence[i])) {
						reject(ErrorUtils.TYPE_NOT_CORRECT_ERROR(SLIDE_ORDERING_SEQUENCE_FIELD + ' : ELEMENT : ', CLASS_NAME, _typeof(slideOrderingSequence[i]), 'Integer'));
					}
				}

				// TODO: check if all the corresponding slides present

				_slideOrderingSequence.set(_this12, slideOrderingSequence);
				fulfill();
			});
		}
	}, {
		key: 'validateSlides',
		value: function validateSlides() {
			var _this13 = this;

			return new Promise(function (fulfill, reject) {

				var slides = _this13.object[SLIDES_FIELD];

				// no such field
				if (slides === undefined) {
					reject(ErrorUtils.FIELD_NOT_PRESENT_ERROR(SLIDES_FIELD, CLASS_NAME));
				}

				// if not array, invalid
				if (!validate.isArray(slides)) {
					reject(ErrorUtils.TYPE_NOT_CORRECT_ERROR(SLIDES_FIELD, CLASS_NAME, typeof slides === 'undefined' ? 'undefined' : _typeof(slides), 'Array'));
				}

				var _slides_ = [];
				// if any element is not a Slide Object, then invalid
				new Promise(function (fulfill, reject) {

					// if no slides, then fulfill
					if (slides.length === 0) {
						fulfill();
					}

					var numFulfilled = 0;
					for (var i = 0; i < slides.length; i++) {
						var slide = slides[i];
						new Slide(JSON.stringify(slide)).then(function (result) {
							// successfully initialized Slide Object
							_slides_.push(result);
							numFulfilled += 1;
							if (numFulfilled === slides.length) {
								// this was the last slide to fulfill its promise
								fulfill();
							}
						}, function (error) {
							// not valid Slide Object
							reject(error);
						});
					}
				}).then(function () {
					_slides.set(_this13, _slides_);
					fulfill();
				}, function (error) {
					reject(error);
				});
			});
		}

		/**
   * saves the parse object to the databaes
   * @return {Promise} fulfilled when object is saved successfully to the database
   */

	}, {
		key: 'save',
		value: function save() {
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
			this.set('slides', this.slides); // TODO: test

			return _get(Project.prototype.__proto__ || Object.getPrototypeOf(Project.prototype), 'save', this).call(this);
		}

		/*
   * getters and setters for private / public class variables
   * --------------------------------------------------------
   */

	}, {
		key: 'parent',
		get: function get() {
			return _parent.get(this);
		},
		set: function set(val) {
			var error = ErrorUtils.CANNOT_SET_OBJECT_PROPERTY_ERROR(CLASS_NAME, 'parent');
			console.log(error);
			throw error;
		}
	}, {
		key: 'originalParent',
		get: function get() {
			return _parent.get(this);
		},
		set: function set(val) {
			var error = ErrorUtils.CANNOT_SET_OBJECT_PROPERTY_ERROR(CLASS_NAME, 'originalParent');
			console.log(error);
			throw error;
		}
	}, {
		key: 'category',
		get: function get() {
			return _category.get(this);
		},
		set: function set(val) {
			var error = ErrorUtils.CANNOT_SET_OBJECT_PROPERTY_ERROR(CLASS_NAME, 'category');
			console.log(error);
			throw error;
		}
	}, {
		key: 'language',
		get: function get() {
			return _language.get(this);
		},
		set: function set(val) {
			var error = ErrorUtils.CANNOT_SET_OBJECT_PROPERTY_ERROR(CLASS_NAME, 'language');
			console.log(error);
			throw error;
		}
	}, {
		key: 'author',
		get: function get() {
			return _author.get(this);
		},
		set: function set(val) {
			var error = ErrorUtils.CANNOT_SET_OBJECT_PROPERTY_ERROR(CLASS_NAME, 'author');
			console.log(error);
			throw error;
		}
	}, {
		key: 'name',
		get: function get() {
			return _name.get(this);
		},
		set: function set(val) {
			var error = ErrorUtils.CANNOT_SET_OBJECT_PROPERTY_ERROR(CLASS_NAME, 'name');
			console.log(error);
			throw error;
		}
	}, {
		key: 'description',
		get: function get() {
			return _description.get(this);
		},
		set: function set(val) {
			var error = ErrorUtils.CANNOT_SET_OBJECT_PROPERTY_ERROR(CLASS_NAME, 'description');
			console.log(error);
			throw error;
		}
	}, {
		key: 'tags',
		get: function get() {
			return _tags.get(this);
		},
		set: function set(val) {
			var error = ErrorUtils.CANNOT_SET_OBJECT_PROPERTY_ERROR(CLASS_NAME, 'tags');
			console.log(error);
			throw error;
		}
	}, {
		key: 'isDubbed',
		get: function get() {
			return _isDubbed.get(this);
		},
		set: function set(val) {
			var error = ErrorUtils.CANNOT_SET_OBJECT_PROPERTY_ERROR(CLASS_NAME, 'isDubbed');
			console.log(error);
			throw error;
		}
	}, {
		key: 'isEdited',
		get: function get() {
			return _isEdited.get(this);
		},
		set: function set(val) {
			var error = ErrorUtils.CANNOT_SET_OBJECT_PROPERTY_ERROR(CLASS_NAME, 'isEdited');
			console.log(error);
			throw error;
		}
	}, {
		key: 'resolutionX',
		get: function get() {
			return _resolutionX.get(this);
		},
		set: function set(val) {
			var error = ErrorUtils.CANNOT_SET_OBJECT_PROPERTY_ERROR(CLASS_NAME, 'resolutionX');
			console.log(error);
			throw error;
		}
	}, {
		key: 'resolutionY',
		get: function get() {
			return _resolutionY.get(this);
		},
		set: function set(val) {
			var error = ErrorUtils.CANNOT_SET_OBJECT_PROPERTY_ERROR(CLASS_NAME, 'resolutionY');
			console.log(error);
			throw error;
		}
	}, {
		key: 'slideOrderingSequence',
		get: function get() {
			return _slideOrderingSequence.get(this);
		},
		set: function set(val) {
			var error = ErrorUtils.CANNOT_SET_OBJECT_PROPERTY_ERROR(CLASS_NAME, 'slideOrderingSequence');
			console.log(error);
			throw error;
		}
	}, {
		key: 'slides',
		get: function get() {
			return _slides.get(this);
		},
		set: function set(val) {
			var error = ErrorUtils.CANNOT_SET_OBJECT_PROPERTY_ERROR(CLASS_NAME, 'slides');
			console.log(error);
			throw error;
		}
	}]);

	return Project;
}(ParseClass.ParseClass);

// when using extends, the SDK is not automatically aware of the subclass
// so have to do it manually


Parse.Object.registerSubclass(CLASS_NAME, Project);

module.exports = {
	Project: Project
};
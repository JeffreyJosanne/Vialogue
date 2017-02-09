'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _dec, _class;

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
var _parent = new WeakMap();
var _originalParent = new WeakMap();
var _category = new WeakMap();
var _language = new WeakMap();
var _author = new WeakMap();
var _name = new WeakMap();
var _description = new WeakMap();
var _tags = new WeakMap();
var _isDubbed = new WeakMap();
var _isEdited = new WeakMap();
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
var Project = (_dec = _flowRuntime2.default.annotate(_flowRuntime2.default.class('Project', _flowRuntime2.default.method('constructor', _flowRuntime2.default.param('parameter', _flowRuntime2.default.union(_flowRuntime2.default.string(), _flowRuntime2.default.ref(Project))), _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise))), _flowRuntime2.default.method('getObject', _flowRuntime2.default.return(_flowRuntime2.default.any())), _flowRuntime2.default.method('constructorFromParseObject', _flowRuntime2.default.param('parseObject', _flowRuntime2.default.ref('Parse')), _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise))), _flowRuntime2.default.method('constructorFromJsonString', _flowRuntime2.default.param('jsonString', _flowRuntime2.default.string()), _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise))), _flowRuntime2.default.method('toJsonStringWithIds', _flowRuntime2.default.return(_flowRuntime2.default.string())), _flowRuntime2.default.method('toJsonStringWithObjects', _flowRuntime2.default.return(_flowRuntime2.default.string())), _flowRuntime2.default.method('parseJson', _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise))), _flowRuntime2.default.method('validateId', _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise))), _flowRuntime2.default.method('validateParentId', _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise))), _flowRuntime2.default.method('validateOriginalParentId', _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise))), _flowRuntime2.default.method('validateCategoryId', _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise))), _flowRuntime2.default.method('validateLanguageId', _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise))), _flowRuntime2.default.method('validateAuthorId', _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise))), _flowRuntime2.default.method('validateName', _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise))), _flowRuntime2.default.method('validateDescription', _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise))), _flowRuntime2.default.method('validateTags', _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise))), _flowRuntime2.default.method('validateIsDubbed', _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise))), _flowRuntime2.default.method('validateIsEdited', _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise))), _flowRuntime2.default.method('validateResolution', _flowRuntime2.default.param('resolutionField', _flowRuntime2.default.string()), _flowRuntime2.default.param('instanceVariableName', _flowRuntime2.default.string()), _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise))), _flowRuntime2.default.method('validateResolutionX', _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise))), _flowRuntime2.default.method('validateResolutionY', _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise))), _flowRuntime2.default.method('validateSlides', _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise))), _flowRuntime2.default.method('validateSlideOrderingSequence', _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise))), _flowRuntime2.default.method('save', _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise))), _flowRuntime2.default.method('parent', _flowRuntime2.default.return(_flowRuntime2.default.any())), _flowRuntime2.default.method('originalParent', _flowRuntime2.default.return(_flowRuntime2.default.any())), _flowRuntime2.default.method('category', _flowRuntime2.default.return(_flowRuntime2.default.any())), _flowRuntime2.default.method('language', _flowRuntime2.default.return(_flowRuntime2.default.any())), _flowRuntime2.default.method('author', _flowRuntime2.default.return(_flowRuntime2.default.any())), _flowRuntime2.default.method('name', _flowRuntime2.default.return(_flowRuntime2.default.any())), _flowRuntime2.default.method('description', _flowRuntime2.default.return(_flowRuntime2.default.any())), _flowRuntime2.default.method('tags', _flowRuntime2.default.return(_flowRuntime2.default.any())), _flowRuntime2.default.method('isDubbed', _flowRuntime2.default.return(_flowRuntime2.default.any())), _flowRuntime2.default.method('isEdited', _flowRuntime2.default.return(_flowRuntime2.default.any())), _flowRuntime2.default.method('resolutionX', _flowRuntime2.default.return(_flowRuntime2.default.any())), _flowRuntime2.default.method('resolutionY', _flowRuntime2.default.return(_flowRuntime2.default.any())), _flowRuntime2.default.method('slideOrderingSequence', _flowRuntime2.default.return(_flowRuntime2.default.any())), _flowRuntime2.default.method('slides', _flowRuntime2.default.return(_flowRuntime2.default.any())), _flowRuntime2.default.method('parent', _flowRuntime2.default.param('val', _flowRuntime2.default.any()), _flowRuntime2.default.return(_flowRuntime2.default.any())), _flowRuntime2.default.method('originalParent', _flowRuntime2.default.param('val', _flowRuntime2.default.any()), _flowRuntime2.default.return(_flowRuntime2.default.any())), _flowRuntime2.default.method('category', _flowRuntime2.default.param('val', _flowRuntime2.default.any()), _flowRuntime2.default.return(_flowRuntime2.default.any())), _flowRuntime2.default.method('language', _flowRuntime2.default.param('val', _flowRuntime2.default.any()), _flowRuntime2.default.return(_flowRuntime2.default.any())), _flowRuntime2.default.method('author', _flowRuntime2.default.param('val', _flowRuntime2.default.any()), _flowRuntime2.default.return(_flowRuntime2.default.any())), _flowRuntime2.default.method('name', _flowRuntime2.default.param('val', _flowRuntime2.default.any()), _flowRuntime2.default.return(_flowRuntime2.default.any())), _flowRuntime2.default.method('description', _flowRuntime2.default.param('val', _flowRuntime2.default.any()), _flowRuntime2.default.return(_flowRuntime2.default.any())), _flowRuntime2.default.method('tags', _flowRuntime2.default.param('val', _flowRuntime2.default.any()), _flowRuntime2.default.return(_flowRuntime2.default.any())), _flowRuntime2.default.method('isDubbed', _flowRuntime2.default.param('val', _flowRuntime2.default.any()), _flowRuntime2.default.return(_flowRuntime2.default.any())), _flowRuntime2.default.method('isEdited', _flowRuntime2.default.param('val', _flowRuntime2.default.any()), _flowRuntime2.default.return(_flowRuntime2.default.any())), _flowRuntime2.default.method('resolutionX', _flowRuntime2.default.param('val', _flowRuntime2.default.any()), _flowRuntime2.default.return(_flowRuntime2.default.any())), _flowRuntime2.default.method('resolutionY', _flowRuntime2.default.param('val', _flowRuntime2.default.any()), _flowRuntime2.default.return(_flowRuntime2.default.any())), _flowRuntime2.default.method('slideOrderingSequence', _flowRuntime2.default.param('val', _flowRuntime2.default.any()), _flowRuntime2.default.return(_flowRuntime2.default.any())), _flowRuntime2.default.method('slides', _flowRuntime2.default.param('val', _flowRuntime2.default.any()), _flowRuntime2.default.return(_flowRuntime2.default.any())), _flowRuntime2.default.extends(ParseClass.ParseClass))), _dec(_class = function (_ParseClass$ParseClas) {
	_inherits(Project, _ParseClass$ParseClas);

	/*
  * Implement the ParseClass.ParseClass interface
  * ---------------------------------------------
  */

	function Project(parameter) {
		_classCallCheck(this, Project);

		var _parameterType = _flowRuntime2.default.union(_flowRuntime2.default.string(), _flowRuntime2.default.ref(Project));

		var _returnType = _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise));

		_flowRuntime2.default.param('parameter', _parameterType).assert(parameter);

		return _possibleConstructorReturn(this, (Project.__proto__ || Object.getPrototypeOf(Project)).call(this, CLASS_NAME, parameter));
	}

	_createClass(Project, [{
		key: 'getObject',
		value: function getObject() {
			return this.object;
		}

		/**
   * if Parse.Object is provided as input, then we just have to
   * read the required fields from the provided Object
   */

	}, {
		key: 'constructorFromParseObject',
		value: function constructorFromParseObject(parseObject) {
			var _this2 = this;

			var _parseObjectType = _flowRuntime2.default.ref('Parse');

			var _returnType2 = _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise));

			_flowRuntime2.default.param('parseObject', _parseObjectType).assert(parseObject);

			return _returnType2.assert(new Promise(function (fulfill, reject) {

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
			}));
		}

		/**
   * if JSON string is provided as input, then we will have to parse
   * the JSON and generate a new Parse.Object
   */

	}, {
		key: 'constructorFromJsonString',
		value: function constructorFromJsonString(jsonString) {
			var _this3 = this;

			var _jsonStringType = _flowRuntime2.default.string();

			var _returnType3 = _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise));

			_flowRuntime2.default.param('jsonString', _jsonStringType).assert(jsonString);

			this.jsonString = jsonString;
			this.object = JsonUtils.tryParseJSON(jsonString) || null;

			if (this.object === null) {
				// json string not valid
				return _returnType3.assert(new Promise(function (fulfill, reject) {
					reject(ErrorUtils.NOT_VALID_JSON_ERROR());
				}));
			}

			return _returnType3.assert(new Promise(function (fulfill, reject) {
				_this3.parseJson().then(function () {
					// return the initialized object
					fulfill(_this3);
				}, function (error) {
					reject(error);
				});
			}));
		}
	}, {
		key: 'toJsonStringWithIds',
		value: function toJsonStringWithIds() {
			var _returnType4 = _flowRuntime2.default.return(_flowRuntime2.default.string());

			return _returnType4.assert('{}');
		}
	}, {
		key: 'toJsonStringWithObjects',
		value: function toJsonStringWithObjects() {
			var _returnType5 = _flowRuntime2.default.return(_flowRuntime2.default.string());

			return _returnType5.assert('{}');
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

			var _returnType6 = _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise));

			return _returnType6.assert(new Promise(function (fulfill, reject) {
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
					return _this4.validateSlides();
				}).then(function () {
					return _this4.validateSlideOrderingSequence();
				}).then(function () {
					delete _this4.jsonString;
					delete _this4.object;
					fulfill(_this4);
				}).catch(function (error) {
					console.log(error);reject(Error(error));
				});
			}));
		}

		/**
   * validates the ID_FIELD field
   * look at "validateIdField" method for description
   */

	}, {
		key: 'validateId',
		value: function validateId() {
			var _this5 = this;

			var _returnType7 = _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise));

			return _returnType7.assert(new Promise(function (fulfill, reject) {
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
			}));
		}

		/**
   * validates the PARENT_FIELD field
   * look at "validateIdField" method for description
   */

	}, {
		key: 'validateParentId',
		value: function validateParentId() {
			var _this6 = this;

			var _returnType8 = _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise));

			return _returnType8.assert(new Promise(function (fulfill, reject) {

				_this6.validateIdField(PARENT_FIELD, CLASS_NAME).then(function (result) {
					_parent.set(_this6, result);
					fulfill();
				}, function (error) {
					reject(error);
				});
			}));
		}

		/**
   * validates the ORIGINAL_PARENT_FIELD field
   * look at "validateIdField" method for description
   */

	}, {
		key: 'validateOriginalParentId',
		value: function validateOriginalParentId() {
			var _this7 = this;

			var _returnType9 = _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise));

			return _returnType9.assert(new Promise(function (fulfill, reject) {

				_this7.validateIdField(ORIGINAL_PARENT_FIELD, CLASS_NAME).then(function (result) {
					_originalParent.set(_this7, result);
					fulfill();
				}, function (error) {
					reject(error);
				});
			}));
		}

		/**
   * validates the CATEGORY_FIELD field
   * look at "validateIdField" method for description
   */

	}, {
		key: 'validateCategoryId',
		value: function validateCategoryId() {
			var _this8 = this;

			var _returnType10 = _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise));

			return _returnType10.assert(new Promise(function (fulfill, reject) {

				_this8.validateIdField(CATEGORY_FIELD, ParseClass.categoryConfig.CLASS_NAME).then(function (result) {
					_category.set(_this8, result);
					fulfill();
				}, function (error) {
					reject(error);
				});
			}));
		}

		/**
   * validates the LANGUAGE_FIELD field
   * look at "validateIdField" method for description
   */

	}, {
		key: 'validateLanguageId',
		value: function validateLanguageId() {
			var _this9 = this;

			var _returnType11 = _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise));

			return _returnType11.assert(new Promise(function (fulfill, reject) {

				_this9.validateIdField(LANGUAGE_FIELD, ParseClass.languageConfig.CLASS_NAME).then(function (result) {
					_language.set(_this9, result);
					fulfill();
				}, function (error) {
					reject(error);
				});
			}));
		}

		/**
   * validates the AUTHOR_FIELD field
   * look at "validateIdField" method for description
   */

	}, {
		key: 'validateAuthorId',
		value: function validateAuthorId() {
			var _this10 = this;

			var _returnType12 = _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise));

			return _returnType12.assert(new Promise(function (fulfill, reject) {

				_this10.validateIdField(AUTHOR_FIELD, ParseClass.userConfig.CLASS_NAME).then(function (result) {
					_author.set(_this10, result);
					fulfill();
				}, function (error) {
					reject(error);
				});
			}));
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
			var _this11 = this;

			var _returnType13 = _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise));

			return _returnType13.assert(new Promise(function (fulfill, reject) {

				var name = _this11.object[NAME_FIELD];

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

				_name.set(_this11, name);
				fulfill();
			}));
		}

		/**
   * validates the DESCRIPTION_FIELD field
   * @return {Promise} :
   * 		fulfilled iff DESCRIPTION_FIELD field exists in the JSON and
   * 		value is String
   *		rejected otherwise
   */

	}, {
		key: 'validateDescription',
		value: function validateDescription() {
			var _this12 = this;

			var _returnType14 = _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise));

			return _returnType14.assert(new Promise(function (fulfill, reject) {

				var description = _this12.object[DESCRIPTION_FIELD];

				// no such field
				if (description === undefined) {
					reject(ErrorUtils.FIELD_NOT_PRESENT_ERROR(DESCRIPTION_FIELD, CLASS_NAME));
				}

				// if not string, invalid
				if (!validate.isString(description)) {
					reject(ErrorUtils.TYPE_NOT_CORRECT_ERROR(DESCRIPTION_FIELD, CLASS_NAME, typeof description === 'undefined' ? 'undefined' : _typeof(description), 'String'));
				}

				// TODO: validate description length
				_description.set(_this12, description);
				fulfill();
			}));
		}

		/**
   * validates the DESCRIPTION_FIELD field
   * @return {Promise} :
   * 		fulfilled iff DESCRIPTION_FIELD field exists in the JSON and
   * 		value is Array and
   * 		value of each element in the Array is String
   *		rejected otherwise
   */

	}, {
		key: 'validateTags',
		value: function validateTags() {
			var _this13 = this;

			var _returnType15 = _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise));

			return _returnType15.assert(new Promise(function (fulfill, reject) {

				var tags = _this13.object[TAGS_FIELD];

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

				_tags.set(_this13, tags);
				fulfill();
			}));
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
			var _this14 = this;

			var _returnType16 = _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise));

			return _returnType16.assert(new Promise(function (fulfill, reject) {

				var isDubbed = _this14.object[IS_DUBBED_FIELD];

				// no such field
				if (isDubbed === undefined) {
					reject(ErrorUtils.FIELD_NOT_PRESENT_ERROR(IS_DUBBED_FIELD, CLASS_NAME));
				}

				// not a boolean, invalid
				if (!validate.isBoolean(isDubbed)) {
					reject(ErrorUtils.TYPE_NOT_CORRECT_ERROR(IS_DUBBED_FIELD, CLASS_NAME, typeof isDubbed === 'undefined' ? 'undefined' : _typeof(isDubbed), 'boolean'));
				}

				_isDubbed.set(_this14, isDubbed);
				fulfill();
			}));
		}

		/**
   * validates the IS_EDITED_FIELD field
   * @return {Promise} :
   * 		fulfilled iff IS_EDITED_FIELD field exists in the JSON and
   * 		value is boolean
   */

	}, {
		key: 'validateIsEdited',
		value: function validateIsEdited() {
			var _this15 = this;

			var _returnType17 = _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise));

			return _returnType17.assert(new Promise(function (fulfill, reject) {

				_get(Project.prototype.__proto__ || Object.getPrototypeOf(Project.prototype), 'validateIsEdited', _this15).call(_this15, IS_EDITED_FIELD, CLASS_NAME).then(function (result) {
					_isEdited.set(_this15, result);
					fulfill();
				}, function (error) {
					reject(error);
				});
			}));
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
			var _this16 = this;

			var _resolutionFieldType = _flowRuntime2.default.string();

			var _instanceVariableNameType = _flowRuntime2.default.string();

			var _returnType18 = _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise));

			_flowRuntime2.default.param('resolutionField', _resolutionFieldType).assert(resolutionField);

			_flowRuntime2.default.param('instanceVariableName', _instanceVariableNameType).assert(instanceVariableName);

			return _returnType18.assert(new Promise(function (fulfill, reject) {

				var resolution = _this16.object[resolutionField];

				// no such field
				if (resolution === undefined) {
					reject(ErrorUtils.FIELD_NOT_PRESENT_ERROR(resolutionField, CLASS_NAME));
				}

				// if not integer, invalid
				if (!validate.isInteger(resolution)) {
					reject(ErrorUtils.TYPE_NOT_CORRECT_ERROR(resolutionField, CLASS_NAME, typeof resolution === 'undefined' ? 'undefined' : _typeof(resolution), 'boolean'));
				}

				// TODO: CHECK IF RESOLUTION IS VALID (i.e not negative, ...)

				fulfill(resolution);
			}));
		}

		/**
   * validates the ParseClass.projectConfig.RESOLUTION_X field
   * look at "validateResolution" method for description
   */

	}, {
		key: 'validateResolutionX',
		value: function validateResolutionX() {
			var _this17 = this;

			var _returnType19 = _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise));

			return _returnType19.assert(new Promise(function (fulfill, reject) {

				_this17.validateResolution(RESOLUTION_X_FIELD, 'resolutionX').then(function (result) {
					_resolutionX.set(_this17, result);
					fulfill();
				}, function (error) {
					reject(error);
				});
			}));
		}

		/**
   * validates the ParseClass.projectConfig.RESOLUTION_Y field
   * look at "validateResolution" method for description
   */

	}, {
		key: 'validateResolutionY',
		value: function validateResolutionY() {
			var _this18 = this;

			var _returnType20 = _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise));

			return _returnType20.assert(new Promise(function (fulfill, reject) {

				_this18.validateResolution(RESOLUTION_Y_FIELD, 'resolutionY').then(function (result) {
					_resolutionY.set(_this18, result);
					fulfill();
				}, function (error) {
					reject(error);
				});
			}));
		}

		/**
   * validates each slide in the array corresponding to the SLIDES_FIELD field
   * @return {Promise} :
   * 		fulfilled if value is an array and
   * 		every element in the array represents a valid {Slide} object
   * 		(look at the Slide.js module for more information on what represents
   	 * 		a valid Slide object)
   */

	}, {
		key: 'validateSlides',
		value: function validateSlides() {
			var _returnType21 = _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise));

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

			return _returnType21.assert(new Promise(function (fulfill, reject) {
				fulfill();
			}));
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
			var _this19 = this;

			var _returnType22 = _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise));

			return _returnType22.assert(new Promise(function (fulfill, reject) {

				var slideOrderingSequence = _this19.object[SLIDE_ORDERING_SEQUENCE_FIELD];

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

				_slideOrderingSequence.set(_this19, slideOrderingSequence);
				fulfill();
			}));
		}

		/**
   * saves the parse object to the databaes
   * @return {Promise} fulfilled when object is saved successfully to the database
   */

	}, {
		key: 'save',
		value: function save() {
			var _returnType23 = _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise));

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

			return _returnType23.assert(_get(Project.prototype.__proto__ || Object.getPrototypeOf(Project.prototype), 'save', this).call(this));
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
}(ParseClass.ParseClass)) || _class);

// when using extends, the SDK is not automatically aware of the subclass
// so have to do it manually

Parse.Object.registerSubclass(CLASS_NAME, Project);

module.exports = {
	Project: Project
};
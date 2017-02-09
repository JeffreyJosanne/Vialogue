'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _class;

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
 * 		resource {Resource}: ...,
 *      is_edited {boolean}: ...
 * }
 */

var fs = require('fs');
var validate = require('validate.js');

var JsonUtils = require('../util/JsonUtils.js');
var ErrorUtils = require('../util/ErrorUtils.js');
var ParseClass = require('./interface/ParseClass.js');
var Resource = require('./factory/Resource.js').Resource;

/* private variables to this class are stored in the form of this WeakMaps
 * (where the key is the instance object "this", and the value is the value
 * of the variable). These can only be accessed through the getters and setters
 * in the Project class, and so we (as a programmer) can control how much can
 * another class access these variables
 */
var _projectSlideId = new WeakMap();
var _layeringObjects = new WeakMap();
var _hyperLinks = new WeakMap();
var _type = new WeakMap();
var _resource = new WeakMap();
var _isEdited = new WeakMap();

var CLASS_NAME = ParseClass.slideConfig.CLASS_NAME;
var ID_FIELD = ParseClass.slideConfig.ID_FIELD;
var PROJECT_SLIDE_ID_FIELD = ParseClass.slideConfig.PROJECT_SLIDE_ID_FIELD;
var LAYERING_OBJECTS_FIELD = ParseClass.slideConfig.LAYERING_OBJECTS_FIELD;
var HYPERLINKS_FIELD = ParseClass.slideConfig.HYPERLINKS_FIELD;
var TYPE_FIELD = ParseClass.slideConfig.TYPE_FIELD;
var RESOURCE_FIELD = ParseClass.slideConfig.RESOURCE_FIELD;
var IS_EDITED_FIELD = ParseClass.slideConfig.IS_EDITED_FIELD;

var IMAGE_TYPE_NAME = ParseClass.imageConfig.CLASS_NAME;
var VIDEO_TYPE_NAME = ParseClass.videoConfig.CLASS_NAME;
var QUESTION_TYPE_NAME = ParseClass.questionConfig.CLASS_NAME;
// this order should not be changed. You can only add more
// types in here
var POSSIBLE_SEGMENT_TYPES = [IMAGE_TYPE_NAME, // first : Image
VIDEO_TYPE_NAME, // second : Video
QUESTION_TYPE_NAME // third : Question
];

/**
 * A {ParseObject} that represents a row in the {Slide} class of the database
 *
 */

var Slide = (_dec = _flowRuntime2.default.annotate(_flowRuntime2.default.class('Slide', _flowRuntime2.default.method('constructor', _flowRuntime2.default.param('parameter', _flowRuntime2.default.union(_flowRuntime2.default.string(), _flowRuntime2.default.ref(Slide))), _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise))), _flowRuntime2.default.method('getObject', _flowRuntime2.default.return(_flowRuntime2.default.any())), _flowRuntime2.default.method('toJsonStringWithIds', _flowRuntime2.default.return(_flowRuntime2.default.any())), _flowRuntime2.default.method('toJsonStringWithObjects', _flowRuntime2.default.return(_flowRuntime2.default.any())), _flowRuntime2.default.method('constructorFromParseObject', _flowRuntime2.default.param('ParseObject', _flowRuntime2.default.ref('Parse')), _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise))), _flowRuntime2.default.method('constructorFromJsonString', _flowRuntime2.default.param('jsonString', _flowRuntime2.default.string()), _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise))), _flowRuntime2.default.method('parseJson', _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise))), _flowRuntime2.default.method('validateId', _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise))), _flowRuntime2.default.method('validateProjectSlideId', _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise))), _flowRuntime2.default.method('validateLayeringObjects', _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise))), _flowRuntime2.default.method('validateHyperlinks', _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise))), _flowRuntime2.default.method('validateType', _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise))), _flowRuntime2.default.method('validateResource', _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise))), _flowRuntime2.default.method('validateIsEdited', _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise))), _flowRuntime2.default.extends(ParseClass.ParseClass))), _dec(_class = function (_ParseClass$ParseClas) {
    _inherits(Slide, _ParseClass$ParseClas);

    function Slide(parameter) {
        _classCallCheck(this, Slide);

        var _parameterType = _flowRuntime2.default.union(_flowRuntime2.default.string(), _flowRuntime2.default.ref(Slide));

        var _returnType = _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise));

        _flowRuntime2.default.param('parameter', _parameterType).assert(parameter);

        return _possibleConstructorReturn(this, (Slide.__proto__ || Object.getPrototypeOf(Slide)).call(this, CLASS_NAME, parameter));
    }

    _createClass(Slide, [{
        key: 'getObject',
        value: function getObject() {
            return this.object;
        }
    }, {
        key: 'toJsonStringWithIds',
        value: function toJsonStringWithIds() {}
    }, {
        key: 'toJsonStringWithObjects',
        value: function toJsonStringWithObjects() {}
    }, {
        key: 'constructorFromParseObject',
        value: function constructorFromParseObject(ParseObject) {
            var _this2 = this;

            var _ParseObjectType = _flowRuntime2.default.ref('Parse');

            var _returnType2 = _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise));

            _flowRuntime2.default.param('ParseObject', _ParseObjectType).assert(ParseObject);

            console.log('Slide : constructorFromParseObject : called');
            return _returnType2.assert(new Promise(function (fulfill, reject) {

                try {
                    _this2.id = ParseObject.get(ID_FIELD);
                    _projectSlideId.set(_this2, ParseObject.get(PROJECT_SLIDE_ID_FIELD));
                    _layeringObjects.set(_this2, ParseObject.get(LAYERING_OBJECTS_FIELD));
                    _hyperLinks.set(_this2, ParseObject.get(HYPERLINKS_FIELD));
                    _type.set(_this2, ParseObject.get(TYPE_FIELD));
                    _resource.set(_this2, ParseObject.get(RESOURCE_FIELD));
                    _isEdited.set(_this2, ParseObject.get(IS_EDITED_FIELD));
                    fulfill(_this2);
                } catch (error) {
                    reject(error);
                }
            }));
        }
    }, {
        key: 'constructorFromJsonString',
        value: function constructorFromJsonString(jsonString) {
            var _this3 = this;

            var _jsonStringType = _flowRuntime2.default.string();

            var _returnType3 = _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise));

            _flowRuntime2.default.param('jsonString', _jsonStringType).assert(jsonString);

            console.log('Slide : constructorFromJsonString : initializing');

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
                    // return initialized object
                    fulfill(_this3);
                }, function (error) {
                    reject(error);
                });
            }));
        }
    }, {
        key: 'parseJson',
        value: function parseJson() {
            var _this4 = this;

            var _returnType4 = _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise));

            return _returnType4.assert(new Promise(function (fulfill, reject) {

                _this4.validateId().then(function () {
                    return _this4.validateProjectSlideId();
                }).then(function () {
                    return _this4.validateLayeringObjects();
                }).then(function () {
                    return _this4.validateHyperlinks();
                }).then(function () {
                    return _this4.validateType();
                }).then(function () {
                    console.log('validateType done');return _this4.validateResource();
                }).then(function () {
                    console.log('validateResource done');return _this4.validateIsEdited();
                }).then(function () {
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

            var _returnType5 = _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise));

            return _returnType5.assert(new Promise(function (fulfill, reject) {
                _this5.validateIdField(ID_FIELD, CLASS_NAME).then(function () {
                    // CANNOT MAKE ID NOT SETTABLE BECAUSE WHEN USING THE ParseObject.set METHOD,
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
    }, {
        key: 'validateProjectSlideId',
        value: function validateProjectSlideId() {
            var _this6 = this;

            var _returnType6 = _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise));

            var this_ = this;
            return _returnType6.assert(new Promise(function (fulfill, reject) {

                var projectSlideId = _this6.object[PROJECT_SLIDE_ID_FIELD];

                // no such field name
                if (projectSlideId === undefined) {
                    reject(ErrorUtils.FIELD_NOT_PRESENT_ERROR(PROJECT_SLIDE_ID_FIELD, CLASS_NAME));
                }

                // type is not integer, invalid
                if (!validate.isInteger(projectSlideId)) {
                    reject(ErrorUtils.TYPE_NOT_CORRECT_ERROR(PROJECT_SLIDE_ID_FIELD, CLASS_NAME, typeof projectSlideId === 'undefined' ? 'undefined' : _typeof(projectSlideId), 'int'));
                }

                _projectSlideId.set(_this6, projectSlideId);
                fulfill();
            }));
        }
    }, {
        key: 'validateLayeringObjects',
        value: function validateLayeringObjects() {
            var _this7 = this;

            var _returnType7 = _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise));

            return _returnType7.assert(new Promise(function (fulfill, reject) {
                // TODO: implement
                _layeringObjects.set(_this7, []);
                fulfill();
            }));
        }
    }, {
        key: 'validateHyperlinks',
        value: function validateHyperlinks() {
            var _this8 = this;

            var _returnType8 = _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise));

            return _returnType8.assert(new Promise(function (fulfill, reject) {

                var hyperlinks = _this8.object[HYPERLINKS_FIELD];

                // no such field name
                if (hyperlinks === undefined) {
                    reject(ErrorUtils.FIELD_NOT_PRESENT_ERROR(HYPERLINKS_FIELD, CLASS_NAME));
                }

                // if not array, invalid
                if (!validate.isArray(hyperlinks)) {
                    reject(ErrorUtils.TYPE_NOT_CORRECT_ERROR(HYPERLINKS_FIELD, CLASS_NAME, typeof hyperlinks === 'undefined' ? 'undefined' : _typeof(hyperlinks), 'Array'));
                }

                // if elements of array not strings, not valid
                for (var i = 0; i < hyperlinks.length; i++) {
                    if (!validate.isString(hyperlinks[i])) {
                        reject(ErrorUtils.TYPE_NOT_CORRECT_ERROR(HYPERLINKS_FIELD + ' : ELEMENT : ', CLASS_NAME, _typeof(hyperlinks[i]), 'String'));
                    }
                }

                // TODO check if each value in the above array points to a slide object
                return new Promise(function (fulfill, reject) {

                    // if no hyperlinks, fulfill
                    if (hyperlinks.length === 0) {
                        fulfill();
                    }

                    var numHyperlinks = 0;
                    for (var i = 0; i < hyperlinks.length; i++) {
                        var obj = Parse.Object.extend(CLASS_NAME);
                        var query = new Parse.Query(obj);
                        query.get(hyperlinks[i]).then(function (result) {
                            numHyperlinks += 1;
                            if (numHyperlinks === hyperlinks.length) {
                                fulfill();
                            }
                        }, function (error) {
                            if (error.code === 101) {
                                // object with id "id" not found
                                reject(ErrorUtils.PARSE_OBJECT_NOT_FOUND_ERROR(hyperlinks[numHyperlinks], CLASS_NAME));
                            } else {
                                reject(Error(error));
                            }
                        });
                    }
                }).then(function (result) {
                    _hyperLinks.set(_this8, hyperlinks);
                    fulfill();
                }, function (error) {
                    reject(error);
                });
            }));
        }
    }, {
        key: 'validateType',
        value: function validateType() {
            var _this9 = this;

            var _returnType9 = _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise));

            return _returnType9.assert(new Promise(function (fulfill, reject) {

                var type = _this9.object[TYPE_FIELD];

                // no such field name
                if (type === undefined) {
                    reject(ErrorUtils.FIELD_NOT_PRESENT_ERROR(TYPE_FIELD, CLASS_NAME));
                }

                // if not String, invalid
                if (!validate.isString(type)) {
                    reject(ErrorUtils.TYPE_NOT_CORRECT_ERROR(TYPE_FIELD, CLASS_NAME, typeof type === 'undefined' ? 'undefined' : _typeof(type), 'String'));
                }

                // if type not one of previously decided, invalid
                var typeValid = false;
                for (var i = 0; i < POSSIBLE_SEGMENT_TYPES.length; i++) {

                    if (POSSIBLE_SEGMENT_TYPES[i] === type) {
                        typeValid = true;
                        break;
                    }
                }
                if (!typeValid) {
                    reject(ErrorUtils.NOT_VALID_VALUE_ERROR(TYPE_FIELD, CLASS_NAME, POSSIBLE_SEGMENT_TYPES));
                }

                _type.set(_this9, type);
                fulfill();
            }));
        }

        // TODO: write comments
        // This should be called only after the validateType() method is called

    }, {
        key: 'validateResource',
        value: function validateResource() {
            var _this10 = this;

            var _returnType10 = _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise));

            console.log('validateResource called');
            return _returnType10.assert(new Promise(function (fulfill, reject) {

                var resource = _this10.object[RESOURCE_FIELD];

                // no such field
                if (resource === undefined) {
                    reject(ErrorUtils.FIELD_NOT_PRESENT_ERROR(RESOURCE_FIELD, CLASS_NAME));
                }

                var resourceInstance = new Resource(JSON.stringify(resource));
                console.log(resourceInstance);
                console.log('hmmmmmmmmmmmmmmmmmm');
                resourceInstance.init().then(function (result) {
                    _resource.set(_this10, resource);
                    fulfill();
                }, function (error) {
                    reject(error);
                });
            }));
        }
    }, {
        key: 'validateIsEdited',
        value: function validateIsEdited() {
            var _this11 = this;

            var _returnType11 = _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise));

            return _returnType11.assert(new Promise(function (fulfill, reject) {

                var isEdited = _this11.object[IS_EDITED_FIELD];

                // no such field
                if (isEdited === undefined) {
                    reject(ErrorUtils.FIELD_NOT_PRESENT_ERROR(IS_EDITED_FIELD, CLASS_NAME));
                }

                // not a boolean, invalid
                if (!validate.isBoolean(isEdited)) {
                    reject(ErrorUtils.TYPE_NOT_CORRECT_ERROR(IS_EDITED_FIELD, CLASS_NAME, typeof isEdited === 'undefined' ? 'undefined' : _typeof(isEdited), 'boolean'));
                }

                _isEdited.set(_this11, isEdited);
                fulfill();
            }));
        }
    }]);

    return Slide;
}(ParseClass.ParseClass)) || _class);


module.exports = {
    Slide: Slide
};
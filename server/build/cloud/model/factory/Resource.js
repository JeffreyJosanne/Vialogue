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

var _audioId = new WeakMap();
var _type = new WeakMap();
var _url = new WeakMap();
var _childrenResources = new WeakMap();
var _isEdited = new WeakMap();

var ID_FIELD = ParseClass.resourceConfig.ID_FIELD;
var TYPE_FIELD = ParseClass.resourceConfig.TYPE_FIELD;
var URL_FIELD = ParseClass.resourceConfig.URL_FIELD;
var CHILDREN_RESOURCES_FIELD = ParseClass.resourceConfig.CHILDREN_RESOURCES_FIELD;
var IS_EDITED_FIELD = ParseClass.resourceConfig.IS_EDITED_FIELD;
var CLASS_NAME;

var VALID_TYPES = [ParseClass.imageConfig, ParseClass.videoConfig, ParseClass.questionConfig, ParseClass.audioConfig];

var REJECTION_PROMISE = new WeakMap();

var Resource = (_dec = _flowRuntime2.default.annotate(_flowRuntime2.default.class('Resource', _flowRuntime2.default.method('constructor', _flowRuntime2.default.param('parameter', _flowRuntime2.default.union(_flowRuntime2.default.string(), _flowRuntime2.default.ref('Parse'))), _flowRuntime2.default.return(_flowRuntime2.default.any())), _flowRuntime2.default.method('getObject', _flowRuntime2.default.return(_flowRuntime2.default.any())), _flowRuntime2.default.method('toJsonStringWithIds', _flowRuntime2.default.return(_flowRuntime2.default.any())), _flowRuntime2.default.method('toJsonStringWithObjects', _flowRuntime2.default.return(_flowRuntime2.default.any())), _flowRuntime2.default.method('constructorFromParseObject', _flowRuntime2.default.param('parseObject', _flowRuntime2.default.ref('Parse')), _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise))), _flowRuntime2.default.method('constructorFromJsonString', _flowRuntime2.default.param('jsonString', _flowRuntime2.default.string()), _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise))), _flowRuntime2.default.method('parseJson', _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise))), _flowRuntime2.default.method('validateId', _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise))), _flowRuntime2.default.method('validateType', _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise))), _flowRuntime2.default.method('validateUrl', _flowRuntime2.default.return(_flowRuntime2.default.any())), _flowRuntime2.default.method('validateChildrenResources', _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise))), _flowRuntime2.default.method('validateIsEdited', _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise))), _flowRuntime2.default.extends(ParseClass.ParseClass))), _dec(_class = function (_ParseClass$ParseClas) {
    _inherits(Resource, _ParseClass$ParseClas);

    function Resource(parameter) {
        _classCallCheck(this, Resource);

        var _parameterType = _flowRuntime2.default.union(_flowRuntime2.default.string(), _flowRuntime2.default.ref('Parse'));

        _flowRuntime2.default.param('parameter', _parameterType).assert(parameter);

        var type = null;
        var rejectionPromise = null;
        if (validate.isString(parameter)) {
            // generate Project instance from a given json string
            var object = JsonUtils.tryParseJSON(parameter) || null;

            if (object === null) {
                // json string not valid
                rejectionPromise = new Promise(function (fulfill, reject) {
                    reject(ErrorUtils.NOT_VALID_JSON_ERROR());
                });
            }

            type = object[TYPE_FIELD];
        } else if (parameter.constructor.name === Parse.Object.className) {
            // generate instance from a given Parse Object
            try {
                type = parameter.get(TYPE_FIELD);
            } catch (error) {
                rejectionPromise = new Promise(function (fulfill, reject) {
                    reject(error);
                });
            }
        }

        // value is null, or field not present, etc. ... (type value is falsey)
        if (!rejectionPromise) {}{
            if (!type) {
                rejectionPromise = new Promise(function (fulfill, reject) {
                    reject(ErrorUtils.FIELD_NOT_PRESENT_ERROR('TYPE_FIELD', 'Resource'));
                });
            }

            if (!rejectionPromise) {
                var config;
                for (var i = 0; i < VALID_TYPES.length; i++) {
                    if (type === VALID_TYPES[i].CLASS_NAME) {
                        config = VALID_TYPES[i];
                        break;
                    }
                }

                // config is still falsey
                if (!config) {
                    rejectionPromise = new Promise(function (fulfill, reject) {
                        var validTypesArray = [];
                        for (var i = 0; i < VALID_TYPES.length; i++) {
                            validTypesArray.push(VALID_TYPES[i].CLASS_NAME);
                        }
                        reject(ErrorUtils.NOT_VALID_VALUE_ERROR(TYPE_FIELD, 'Resource', validTypesArray));
                    });
                }

                if (!rejectionPromise) {
                    CLASS_NAME = config.CLASS_NAME;
                }
            }
        }

        if (rejectionPromise) {
            var _this = _possibleConstructorReturn(this, (Resource.__proto__ || Object.getPrototypeOf(Resource)).call(this, '', parameter));

            REJECTION_PROMISE.set(_this, rejectionPromise);
        } else {
            console.log('not rejecting');

            var _this = _possibleConstructorReturn(this, (Resource.__proto__ || Object.getPrototypeOf(Resource)).call(this, CLASS_NAME, parameter));
        }
        return _possibleConstructorReturn(_this);
    }

    _createClass(Resource, [{
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
        value: function constructorFromParseObject(parseObject) {
            var _this2 = this;

            var _parseObjectType = _flowRuntime2.default.ref('Parse');

            var _returnType = _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise));

            _flowRuntime2.default.param('parseObject', _parseObjectType).assert(parseObject);

            if (REJECTION_PROMISE.get(this)) {
                // rejection when constructor was run
                return _returnType.assert(REJECTION_PROMISE.get(this));
            }

            return _returnType.assert(new Promise(function (fulfill, reject) {
                try {
                    _this2.id = parseObject.get(ID_FIELD);
                    _type.set(_this2, parseObject.get(TYPE_FIELD));
                    _url.set(_this2, parseObject.get(URL_FIELD));
                    _childrenResources.set(_this2, parseObject.get(CHILDREN_RESOURCES_FIELD));
                    _isEdited.set(_this2, parseObject.get(IS_EDITED_FIELD));
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

            var _returnType2 = _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise));

            _flowRuntime2.default.param('jsonString', _jsonStringType).assert(jsonString);

            if (REJECTION_PROMISE.get(this)) {
                // rejection when constructor was run
                return _returnType2.assert(REJECTION_PROMISE.get(this));
            }

            this.jsonString = jsonString;
            this.object = JsonUtils.tryParseJSON(jsonString) || null;

            if (this.object === null) {
                // json string not valid
                return _returnType2.assert(new Promise(function (fulfill, reject) {
                    reject(ErrorUtils.NOT_VALID_JSON_ERROR());
                }));
            }

            return _returnType2.assert(new Promise(function (fulfill, reject) {
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

            var _returnType3 = _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise));

            return _returnType3.assert(new Promise(function (fulfill, reject) {
                _this4.validateId().then(function () {
                    return _this4.validateType();
                }).then(function () {
                    return _this4.validateUrl();
                }).then(function () {
                    return _this4.validateChildrenResources();
                }).then(function () {
                    return _this4.validateIsEdited();
                }).then(function () {
                    fulfill(_this4);
                }).catch(function (error) {
                    reject(Error(error));
                });
            }));
        }
    }, {
        key: 'validateId',
        value: function validateId() {
            var _this5 = this;

            var _returnType4 = _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise));

            return _returnType4.assert(new Promise(function (fulfill, reject) {
                _this5.validateIdField(ID_FIELD, CLASS_NAME).then(function () {
                    _this5.id = _this5.object[ID_FIELD];
                    fulfill();
                }, function (error) {
                    console.log(error);
                    reject(error);
                });
            }));
        }
    }, {
        key: 'validateType',
        value: function validateType() {
            var _this6 = this;

            var _returnType5 = _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise));

            return _returnType5.assert(new Promise(function (fulfill, reject) {

                var type = _this6.object[TYPE_FIELD];

                // no such field
                if (type === undefined) {
                    reject(ErrorUtils.FIELD_NOT_PRESENT_ERROR(TYPE_FIELD, CLASS_NAME));
                }

                // if not a string, reject
                if (!validate.isString(type)) {
                    reject(ErrorUtils.TYPE_NOT_CORRECT_ERROR(TYPE_FIELD, CLASS_NAME, typeof type === 'undefined' ? 'undefined' : _typeof(type), 'String'));
                }

                // if value is not "CLASS_NAME", reject
                if (type !== CLASS_NAME) {
                    reject(ErrorUtils.NOT_VALID_VALUE_ERROR(TYPE_FIELD, CLASS_NAME, [CLASS_NAME]));
                }

                _type.set(_this6, type);
                fulfill();
            }));
        }
    }, {
        key: 'validateUrl',
        value: function validateUrl() {
            var _this7 = this;

            return new Promise(function (fulfill, reject) {

                var url = _this7.object[URL_FIELD];

                // no such field
                if (url === undefined) {
                    reject(ErrorUtils.FIELD_NOT_PRESENT_ERROR(URL_FIELD, CLASS_NAME));
                }

                // if not string, then invalid
                if (!validate.isString(url)) {
                    reject(ErrorUtils.TYPE_NOT_CORRECT_ERROR(URL_FIELD, CLASS_NAME, typeof url === 'undefined' ? 'undefined' : _typeof(url), 'String'));
                }

                // TODO: check if the URL is actually validate
                _url.set(_this7, url);
                fulfill();
            });
        }
    }, {
        key: 'validateChildrenResources',
        value: function validateChildrenResources() {
            var _this8 = this;

            var _returnType6 = _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise));

            return _returnType6.assert(new Promise(function (fulfill, reject) {

                var childrenResources = _this8.object[CHILDREN_RESOURCES_FIELD];

                // no such field
                if (childrenResources === undefined) {
                    reject(ErrorUtils.FIELD_NOT_PRESENT_ERROR(CHILDREN_RESOURCES_FIELD, CLASS_NAME));
                }

                // if not an array, undefined
                if (!validate.isArray(childrenResources)) {
                    reject(ErrorUtils.TYPE_NOT_CORRECT_ERROR(CHILDREN_RESOURCES_FIELD, CLASS_NAME, typeof childrenResources === 'undefined' ? 'undefined' : _typeof(childrenResources), 'Array'));
                }

                var _childrenResources_ = [];
                new Promise(function (fulfill, reject) {

                    // if no children resources, then fulfill
                    console.log(childrenResources);
                    if (childrenResources.length === 0) {
                        console.log('length 0 : fulfilling');
                        fulfill();
                    }

                    var numFulfilled = 0;
                    for (var i = 0; i < childrenResources.length; i++) {
                        var childResource = childrenResources[i];
                        new Resource(JSON.stringify(childResource)).then(function (result) {
                            // successfully initialized Resource Object
                            _childrenResources_.push(result);
                            numFulfilled += 1;
                            if (numFulfilled === childrenResources.length) {
                                // this was the last child Resource
                                fulfill();
                            }
                        }, function (error) {
                            reject(error);
                        });
                    }
                }).then(function () {
                    console.log('before');
                    _childrenResources.set(_this8, _childrenResources_);
                    console.log('after');
                    fulfill();
                }, function (error) {
                    reject(error);
                });
            }));
        }
    }, {
        key: 'validateIsEdited',
        value: function validateIsEdited() {
            var _this9 = this;

            var _returnType7 = _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise));

            return _returnType7.assert(new Promise(function (fulfill, reject) {

                _get(Resource.prototype.__proto__ || Object.getPrototypeOf(Resource.prototype), 'validateIsEdited', _this9).call(_this9, IS_EDITED_FIELD, CLASS_NAME).then(function (result) {
                    _isEdited.set(_this9, result);
                    fulfill();
                }, function (error) {
                    reject(error);
                });
            }));
        }
    }]);

    return Resource;
}(ParseClass.ParseClass)) || _class);


module.exports = {
    Resource: Resource
};
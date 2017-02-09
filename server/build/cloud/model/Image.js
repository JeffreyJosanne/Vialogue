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
 *      is_edited {boolean}: ...
 * }
 */

var validate = require('validate.js');

var ParseClass = require('./interfaces/ParseClass.js');
var JsonUtils = require('../utils/JsonUtils.js');
var ErrorUtils = require('../utils/ErrorUtils.js');

var _type = new WeakMap();
var _url = new WeakMap();
var _isEdited = new WeakMap();

var CLASS_NAME = ParseClass.imageConfig.CLASS_NAME;
console.log(CLASS_NAME);
var ID_FIELD = ParseClass.imageConfig.ID_FIELD;
console.log("image field'):");
console.log(ID_FIELD);
var TYPE_FIELD = ParseClass.imageConfig.TYPE_FIELD;
console.log(TYPE_FIELD);
var URL_FIELD = ParseClass.imageConfig.URL_FIELD;
console.log(URL_FIELD);
var IS_EDITED_FIELD = ParseClass.imageConfig.IS_EDITED_FIELD;
console.log(IS_EDITED_FIELD);

var Resource = require('./interfaces/Resource.js').Resource;
var ParseClass = require('./interfaces/ParseClass.js');

var Image = (_dec = _flowRuntime2.default.annotate(_flowRuntime2.default.class('Image', _flowRuntime2.default.method('constructor', _flowRuntime2.default.param('parameter', _flowRuntime2.default.union(_flowRuntime2.default.string(), _flowRuntime2.default.ref(Resource))), _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise))), _flowRuntime2.default.method('constructorFromParseObject', _flowRuntime2.default.param('parseObject', _flowRuntime2.default.ref('Parse')), _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise))), _flowRuntime2.default.method('constructorFromJsonString', _flowRuntime2.default.param('jsonString', _flowRuntime2.default.string()), _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise))), _flowRuntime2.default.method('parseJson', _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise))), _flowRuntime2.default.method('validateId', _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise))), _flowRuntime2.default.method('validateType', _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise))), _flowRuntime2.default.method('validateUrl', _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise))), _flowRuntime2.default.method('validateIsEdited', _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise))), _flowRuntime2.default.extends(Resource))), _dec(_class = function (_Resource) {
    _inherits(Image, _Resource);

    function Image(parameter) {
        var _this, _ret;

        _classCallCheck(this, Image);

        var _parameterType = _flowRuntime2.default.union(_flowRuntime2.default.string(), _flowRuntime2.default.ref(Resource));

        var _returnType = _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise));

        _flowRuntime2.default.param('parameter', _parameterType).assert(parameter);

        return _ret = _returnType.assert((_this = _possibleConstructorReturn(this, (Image.__proto__ || Object.getPrototypeOf(Image)).call(this, ParseClass.imageConfig.CLASS_NAME, parameter)), _this)), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(Image, [{
        key: 'constructorFromParseObject',
        value: function constructorFromParseObject(parseObject) {
            var _this2 = this;

            var _parseObjectType = _flowRuntime2.default.ref('Parse');

            var _returnType2 = _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise));

            _flowRuntime2.default.param('parseObject', _parseObjectType).assert(parseObject);

            return _returnType2.assert(new Promise(function (fulfill, reject) {

                try {
                    _this2.id = parseObject.get(ID_FIELD);
                    _type.set(_this2, parseObject.get(TYPE_FIELD));
                    _url.set(_this2, parseObject.get(URL_FIELD));
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
                    return _this4.validateType();
                }).then(function () {
                    return _this4.validateUrl();
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

            var _returnType5 = _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise));

            return _returnType5.assert(new Promise(function (fulfill, reject) {
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

            var _returnType6 = _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise));

            return _returnType6.assert(new Promise(function (fulfill, reject) {

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

            var _returnType7 = _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise));

            return _returnType7.assert(new Promise(function (fulfill, reject) {

                _get(Image.prototype.__proto__ || Object.getPrototypeOf(Image.prototype), 'validateUrl', _this7).call(_this7, URL_FIELD, CLASS_NAME).then(function (result) {
                    _url.set(_this7, result);
                    fulfill();
                }, function (error) {
                    reject(error);
                });
            }));
        }
    }, {
        key: 'validateIsEdited',
        value: function validateIsEdited() {
            var _this8 = this;

            var _returnType8 = _flowRuntime2.default.return(_flowRuntime2.default.ref(Promise));

            return _returnType8.assert(new Promise(function (fulfill, reject) {

                var isEdited = _this8.object[IS_EDITED_FIELD];

                // no such field
                if (isEdited === undefined) {
                    reject(ErrorUtils.FIELD_NOT_PRESENT_ERROR(IS_EDITED_FIELD, CLASS_NAME));
                }

                // not a boolean, invalid
                if (!validate.isBoolean(isEdited)) {
                    reject(ErrorUtils.TYPE_NOT_CORRECT_ERROR(IS_EDITED_FIELD, CLASS_NAME, typeof isEdited === 'undefined' ? 'undefined' : _typeof(isEdited), 'boolean'));
                }

                _isEdited.set(_this8, isEdited);
                fulfill();
            }));
        }
    }]);

    return Image;
}(Resource)) || _class);


module.exports = {
    Image: Image
};
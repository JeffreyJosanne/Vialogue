var chai = require('chai');
var expect = chai.expect;
var Parse = require('parse/node').Parse;
var fs = require('fs');

var errorUtils = require('./errorUtils');

Parse.initialize('app', 'id', 'master');
Parse.serverURL = 'http://localhost:1337/parse';
var id = "ZsMHSSftPf";

/**
 * TESTS
 * -----
 * constructor
 *      rejects if
 *          len(arguments) < 1
 *          len(arguments) > 2
 *          argument_1 != {Project} and argument_1 != {string}
 *          argument_2 != {boolean}
 * constructFromParseObject
 *      rejects if
 *          argument_1 is not a valid {Project} object, consisting of the following fields
 *             projectConfig.ID_FIELD
 * 		       projectConfig.PARENT_FIELD
 * 		       projectConfig.ORIGINAL_PARENT_FIELD
 * 		       projectConfig.NAME_FIELD
 * 		       projectConfig.IS_DUBBED_FIELD
 * 		       projectConfig.CATEGORY_FIELD
 * 		       projectConfig.LANGUAGE_FIELD
 * 		       projectConfig.AUTHOR_FIELD
 * 		       projectConfig.RESOLUTION_X_FIELD
 * 		       projectConfig.RESOLUTION_Y_FIELD
 * 		       projectConfig.SLIDE_ORDERING_SEQUENCE_FIELD
 * constructFromJsonString
 *      rejects if
 *          argument_1 does not represent a valid JSON object
 * validateIdField
 *      rejects if 
 *          argument_1 is not a {String}
 *      fulfilled iff fieldName field exists in the JSON and
 * 			value is null or
 * 			value is String and corresponds to a parse object in the "className" class of
 * 			in the database
 * 		rejected otherwise, returning the error message
 *
 * validateName
 * validateIsDubbed
 * validateResolution
 * validateResolutionX
 * validateResolutionY
 * validateSlideOrderingSequence
 * validateSlides
 * save
 */

var upload = (json) => {
    return Parse.Cloud.run('uploadJson', json);
}

var assertReject = (promise, errorMessage) => {
    return promise.then(
        () => {
            expect.fail('exception did not appear to be thrown');
        }, (error) => {
            expect(error.message).to.equal('Error: ' + errorMessage);
        }
    )
}

var asserFulfill = (promise, returnValue) => {
    return promise.then(
        (result) => {
            expect(result).to.equal(returnValue);
        }, () => {
            expect.fail('exception raised, but not expected');
        }
    )
}

describe('project.js', () => {

    describe('should reject if any one field is missing', () => {

        it('rejects json without id', () => {
            var json = {
            	"parent": id,
            	"original_parent": id,
            	"category": "S5i3Ou2206",
            	"language": "s1L99KeQ1z",
            	"author": "FGyRgBiBw5",
            	"name": "hello world",
            	"is_dubbed": true,
            	"resolution_x": 1080,
            	"resolution_y": 721,
            	"slide_ordering_sequence": [1, 2, 3, 3, 4]
            };
            return assertReject(upload(json), errorUtils.FIELD_NOT_PRESENT_ERROR('id').message);
        });

        it('rejects json without parent', () => {
            var json = {
            	"id": id,
            	"original_parent": id,
            	"category": "S5i3Ou2206",
            	"language": "s1L99KeQ1z",
            	"author": "FGyRgBiBw5",
            	"name": "hello world",
            	"is_dubbed": true,
            	"resolution_x": 1080,
            	"resolution_y": 721,
            	"slide_ordering_sequence": [1, 2, 3, 3, 4]
            };
            return assertReject(upload(json), errorUtils.FIELD_NOT_PRESENT_ERROR('parent').message);

        });

        it('rejects json without original_parent', () => {
            var json = {
                "id": id,
            	"parent": id,
            	"category": "S5i3Ou2206",
            	"language": "s1L99KeQ1z",
            	"author": "FGyRgBiBw5",
            	"name": "hello world",
            	"is_dubbed": true,
            	"resolution_x": 1080,
            	"resolution_y": 721,
            	"slide_ordering_sequence": [1, 2, 3, 3, 4]
            };
            return assertReject(upload(json), errorUtils.FIELD_NOT_PRESENT_ERROR('original_parent').message);

        });

        it('rejects json without category', () => {
            var json = {
                "id": id,
            	"parent": id,
            	"original_parent": id,
            	"language": "s1L99KeQ1z",
            	"author": "FGyRgBiBw5",
            	"name": "hello world",
            	"is_dubbed": true,
            	"resolution_x": 1080,
            	"resolution_y": 721,
            	"slide_ordering_sequence": [1, 2, 3, 3, 4]
            };
            return assertReject(upload(json), errorUtils.FIELD_NOT_PRESENT_ERROR('category').message);
        });

        it('rejects json without language', () => {
            var json = {
                "id": id,
            	"parent": id,
            	"original_parent": id,
                "category": "S5i3Ou2206",
            	"author": "FGyRgBiBw5",
            	"name": "hello world",
            	"is_dubbed": true,
            	"resolution_x": 1080,
            	"resolution_y": 721,
            	"slide_ordering_sequence": [1, 2, 3, 3, 4]
            };
            return assertReject(upload(json), errorUtils.FIELD_NOT_PRESENT_ERROR('language').message);
        });

        it('rejects json without author', () => {
            var json = {
                "id": id,
            	"parent": id,
            	"original_parent": id,
            	"category": "S5i3Ou2206",
            	"language": "s1L99KeQ1z",
            	"name": "hello world",
            	"is_dubbed": true,
            	"resolution_x": 1080,
            	"resolution_y": 721,
            	"slide_ordering_sequence": [1, 2, 3, 3, 4]
            };
            return assertReject(upload(json), errorUtils.FIELD_NOT_PRESENT_ERROR('author').message);
        });

        it('rejects json without name', () => {
            var json = {
                "id": id,
            	"parent": id,
            	"original_parent": id,
            	"category": "S5i3Ou2206",
            	"language": "s1L99KeQ1z",
            	"author": "FGyRgBiBw5",
            	"is_dubbed": true,
            	"resolution_x": 1080,
            	"resolution_y": 721,
            	"slide_ordering_sequence": [1, 2, 3, 3, 4]
            };
            return assertReject(upload(json), errorUtils.FIELD_NOT_PRESENT_ERROR('name').message);
        });

        it('rejects json without is_dubbed', () => {
            var json = {
                "id": id,
                "parent": id,
                "original_parent": id,
                "category": "S5i3Ou2206",
                "language": "s1L99KeQ1z",
                "author": "FGyRgBiBw5",
                "name": "hello world",
                "resolution_x": 1080,
                "resolution_y": 721,
                "slide_ordering_sequence": [1, 2, 3, 3, 4]
            };
            return assertReject(upload(json), errorUtils.FIELD_NOT_PRESENT_ERROR('is_dubbed').message);
        });

        it('rejects json without resolution_x', () => {
            var json = {
                "id": id,
            	"parent": id,
            	"original_parent": id,
            	"category": "S5i3Ou2206",
            	"language": "s1L99KeQ1z",
            	"author": "FGyRgBiBw5",
            	"name": "hello world",
            	"is_dubbed": true,
            	"resolution_y": 721,
            	"slide_ordering_sequence": [1, 2, 3, 3, 4]
            };
            return assertReject(upload(json), errorUtils.FIELD_NOT_PRESENT_ERROR('resolution_x').message);
        });

        it('rejects json without resolution_y', () => {
            var json = {
                "id": id,
            	"parent": id,
            	"original_parent": id,
            	"category": "S5i3Ou2206",
            	"language": "s1L99KeQ1z",
            	"author": "FGyRgBiBw5",
            	"name": "hello world",
            	"is_dubbed": true,
            	"resolution_x": 1080,
            	"slide_ordering_sequence": [1, 2, 3, 3, 4]
            };
            return assertReject(upload(json), errorUtils.FIELD_NOT_PRESENT_ERROR('resolution_y').message);
        });

        it('rejects json without slide_ordering_sequence', () => {
            var json = {
                "id": id,
            	"parent": id,
            	"original_parent": id,
            	"category": "S5i3Ou2206",
            	"language": "s1L99KeQ1z",
            	"author": "FGyRgBiBw5",
            	"name": "hello world",
            	"is_dubbed": true,
            	"resolution_x": 1080,
            	"resolution_y": 721,
            };
            return assertReject(upload(json), errorUtils.FIELD_NOT_PRESENT_ERROR('slide_ordering_sequence').message);
        });

    });

    describe('should reject if any field value is of incorrect type', () => {
        // should work for string and null
        // should not work for number, boolean

        ids_array = ['id', 'parent', 'original_parent', 'category', 'language', 'author', 'name'];

        for(var i=0; i<ids_array.length; i++) {
            id_ = ids_array[i];
            describe('rejects when ' + id_ + ' is not a string', () => {

                var json = {
                    "id": id,
                    "parent": id,
                    "original_parent": id,
                    "category": "S5i3Ou2206",
                    "language": "s1L99KeQ1z",
                    "author": "FGyRgBiBw5",
                    "name": "hello world",
                    "is_dubbed": true,
                    "resolution_x": 1080,
                    "resolution_y": 721,
                    "slide_ordering_sequence": [1, 2, 3, 3, 4]
                };

                // check for number
                it('rejects when ' + id_ + ' is a number', () => {
                    json[id_] = 1;
                    return assertReject(upload(json), errorUtils.TYPE_NOT_CORRECT_ERROR(id_, 'number', 'String').message);
                });

                // check for boolean
                it('rejects when ' + id_ + ' is a boolean', () => {
                    json[id_] = true;
                    return assertReject(upload(json), errorUtils.TYPE_NOT_CORRECT_ERROR(id_, 'boolean', 'String').message);
                });

            });
        }

        describe('rejects when is_dubbed is not a boolean', () => {
            // should work for boolean
            // should not work for number, string, null

            var json = {
                "id": id,
                "parent": id,
                "original_parent": id,
                "category": "S5i3Ou2206",
                "language": "s1L99KeQ1z",
                "author": "FGyRgBiBw5",
                "name": "hello world",
                "is_dubbed": true,
                "resolution_x": 1080,
                "resolution_y": 721,
                "slide_ordering_sequence": [1, 2, 3, 3, 4]
            };

            // check for number
            it('rejects when it is a number', () => {
                json['is_dubbed'] = 1;
                return assertReject(upload(json), errorUtils.TYPE_NOT_CORRECT_ERROR('is_dubbed', 'number', 'boolean').message);
            });

            // check for string
            it('rejects when it is a String', () => {
                json['is_dubbed'] = 'hello';
                return assertReject(upload(json), errorUtils.TYPE_NOT_CORRECT_ERROR('is_dubbed', 'string', 'boolean').message);
            });

            // check for null
            it('rejects when it is null', () => {
                json['is_dubbed'] = null;
                return assertReject(upload(json), errorUtils.TYPE_NOT_CORRECT_ERROR('is_dubbed', 'object', 'boolean').message);
            });

        });

        describe('rejects when resolution_x is not a boolean', () => {
            // should work for boolean
            // should not work for number, string, null

            var json = {
                "id": id,
                "parent": id,
                "original_parent": id,
                "category": "S5i3Ou2206",
                "language": "s1L99KeQ1z",
                "author": "FGyRgBiBw5",
                "name": "hello world",
                "is_dubbed": true,
                "resolution_x": 1080,
                "resolution_y": 721,
                "slide_ordering_sequence": [1, 2, 3, 3, 4]
            };

            // check for number
            it('rejects when it is a boolean', () => {
                json['resolution_x'] = true;
                return assertReject(upload(json), errorUtils.TYPE_NOT_CORRECT_ERROR('resolution_x', 'boolean', 'number').message);
            });

            // check for string
            it('rejects when it is a String', () => {
                json['resolution_x'] = 'hello';
                return assertReject(upload(json), errorUtils.TYPE_NOT_CORRECT_ERROR('resolution_x', 'string', 'number').message);
            });

            // check for null
            it('rejects when it is null', () => {
                json['resolution_x'] = null;
                return assertReject(upload(json), errorUtils.TYPE_NOT_CORRECT_ERROR('resolution_x', 'object', 'number').message);
            });

        });

    });

});

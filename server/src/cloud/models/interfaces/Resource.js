// TODO: add documentation

var fs = require('fs');
var validate = require('validate.js');

var ErrorUtils = require('../utils/ErrorUtils.js');
var JsonUtils = require('../utils/JsonUtils.js');

// read and validate configuration files
const resourceConfig = JsonUtils.tryParseJson(fs.readFileSync('./config/resourceConfig.json'));

/**
 * This class is a common class that defines a resource type
 */

// class Resource extends ParseClass {
//
//     constructor(className) {
//
//     }
// }

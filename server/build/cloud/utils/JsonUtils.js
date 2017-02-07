"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var JSON2 = require('JSON2');

/**
 * @param {String} jsonString - some string supposed to represent project JSON
 * @return {boolean} true if jsonString represents a valid JSON
 */
var tryParseJSON = function tryParseJSON(jsonString) {
    try {
        var o = JSON.parse(jsonString);

        // Handle non-exception-throwing cases:

        // Neither JSON.parse(false) or JSON.parse(1234) 
        // throw errors, hence the type-checking 
        // (typeof o === "object"),

        // JSON.parse(null) returns null, and 
        // typeof null === "object", so we must check for that, too. 
        // Thankfully, null is falsey, so this suffices:

        if (o && (typeof o === "undefined" ? "undefined" : _typeof(o)) === "object") {
            return o;
        }
    } catch (e) {
        console.error(e);
    }
    return false;
};

module.exports = {
    tryParseJSON: tryParseJSON
};
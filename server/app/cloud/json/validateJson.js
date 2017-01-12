var jsonUtils = require('./jsonUtils.js');

class jsonObject {

	constructor(jsonString) {
		// initialize instance variables
		this.string = jsonString;
		this.object = jsonUtils.tryParseJSON(jsonString) || null;

		if(this.object === null) {
			// JSON string is not valid
			return;
		}

		// validate jsonString
		if(!this.validate()) {
			this.object = null;
		}
	}

	validate() {
		return true;
	}

	hasField(field) {
		return this.object[field] !== undefined;
	}
}

class projectJsonObject extends jsonObject {
	/**
	 * validates whether the json represents a valid project JSON
	 * @param {String} jsonString - string supposed to represent project JSON
	 * @return {boolean} true if jsonString represents a valid project JSON
	 */
	validate() {
		if(
			// this.validateProjectId() &&						// validate project id
			// this.validateParentProjectId() && 				// validate parent id
			// this.validateOriginalParentProjectId() && 		// validate original parent id
			// this.validateProjectName() && 					// validate project name
			// this.hasField('is_dubbed') &&
			true
		) {
			return true;
		} return false;
	}

	/**
	 * validates the ID field
	 * @param {int} id
	 * @return {boolean} true if id exists and is valid
	 */
	validateId(id) {
		// id field should be available in the JSON
		if(!this.hasField(id)) {
			return false;
		}

		// id should be either null or there should be a project
		// with this id in the database
		if((id !== null) && (!this.projectExists(id))) {
			return false;
		} return true;
	}

	// placeholder method
	// TODO
	// implement actual logic
	projectExists() {
		return true;
	}

	/**
	 * validates project id
	 * @return {boolean} true if valid name
	 */
	validateProjectId() {
		if(!this.validateId('id')) {
			return false;
		}

		// TODO
		// implement logic specific to project id
		return true;
	}

	/**
	 * validates project project id
	 * @return {boolean} true if valid name
	 */
	validateParentProjectId() {
		if(!this.validateId('parent_id')) {
			return false;
		}

		// TODO
		// implement logic specific to parent project id
		return true;
	}

	/**
	 * validates original parent project id
	 * @return {boolean} true if valid name
	 */
	validateOriginalParentProjectId() {
		if(!this.validateId('original_parent_id')) {
			return false;
		}

		// TODO
		// implement logic specific to original parent project id
		return true;
	}

	/**
	 * validates project name
	 * @param {String} name
	 * @return {boolean} true if valid name
	 */
	validateProjectName(name) {
		// name field should be available in the JSON
		if(this.hasField(name)) {
			return false;
		} 

		// TODO
		// implement logic to validate project name
		return true;
	}

}

class userJsonObject extends jsonObject {
	/**
	 * validates whether the json represents a valid user JSON 
	 * @param {String} jsonString - string supposed to represent project JSON
	 * @return {boolean} true if jsonString represents a valid project JSON
	 */
	validate() {
		return true;
	}
}

class appJsonObject extends jsonObject {
	/**
	 * validates whether the json represents a valid app JSON
	 * @param {String} jsonString - string supposed to represent project JSON
	 * @return {boolean} true if jsonString represents a valid project JSON
	 */
	 validate() {
		return true;
	 }
}



module.exports = {
	jsonObject,
	projectJsonObject
}
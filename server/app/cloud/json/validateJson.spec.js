var validateJson = require('./validateJson.js');
var should = require('chai').should();

var trueJson = function(json, clsString, fnString) {
	it('trueJson : should return true for ' + json, function() {
		var commandString = 'new ' + clsString + '(\'' + json + '\')' + '.' + fnString + '(\'id\').should.equal(true)';
		console.log(commandString);
		eval(commandString);
	});
}


describe('validateJson.spec.js', function() {

	describe('jsonObject', function() {

		describe('hasField', function() {
			
			it('should return true for {"id": 10}', function() {
				new validateJson.jsonObject('{"id": 10}').hasField('id').should.equal(true);
			});

			it('should return false for {}', function() {
				new validateJson.jsonObject('{}').hasField('id').should.equal(false);
			});

			trueJson('{"id":10}', 'validateJson.jsonObject', 'hasField');
			
		});
	});
	
	describe('projectJsonObject', function() {

		describe('validateId', function() {

			it('should work for {"id" : 10}', function() {
				new validateJson.projectJsonObject('{"id": 10}').validateId('id').should.equal(true);
			});

			it('should not work for {}', function() {
				new validateJson.projectJsonObject('{}').validateId('id').should.equal(false);
			});

			// TODO
			// add more when logic for validating project with database is implemented

		});

		describe('validateProjectId', function() {
			
			it('should work for {"id": 10}', function() {
				new validateJson.projectJsonObject('{"id" : 10}').validateProjectId().should.equal(true);
			});

			it('should not work for {}', function() {
				new validateJson.projectJsonObject('{}').validateProjectId().should.equal(false);
			});

			it('should not work for {"parent_id": 10}', function() {
				new validateJson.projectJsonObject('{"parent_id": 10}').validateProjectId().should.equal(false);
			});

		});

		describe('validateParentProjectId', function() {
			
			it('should work for {"parent_id": 10}', function() {
				new validateJson.projectJsonObject('{"parent_id" : 10}').validateParentProjectId().should.equal(true);
			});

			it('should not work for {}', function() {
				new validateJson.projectJsonObject('{}').validateParentProjectId().should.equal(false);
			});

			it('should not work for {"id": 10}', function() {
				new validateJson.projectJsonObject('{"id": 10}').validateParentProjectId().should.equal(false);
			});

		});

		describe('validateOriginalParentProjectId', function() {
			
			it('should work for {"original_parent_id": 10}', function() {
				new validateJson.projectJsonObject('{"original_parent_id" : 10}').validateOriginalParentProjectId().should.equal(true);
			});

			it('should not work for {}', function() {
				new validateJson.projectJsonObject('{}').validateOriginalParentProjectId().should.equal(false);
			});

			it('should not work for {"id": 10}', function() {
				new validateJson.projectJsonObject('{"id": 10}').validateOriginalParentProjectId().should.equal(false);
			});

		});
	});
});


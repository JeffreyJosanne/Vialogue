'use strict';

var Project = require('../models/Project').Project;
var JSON2 = require('JSON2');

Parse.Cloud.define('uploadJson', function (request, response) {

	console.log('hullalalala');
	var p;
	new Project(JSON2.stringify(request.params)).then(
	// new Project().then(

	function (result) {
		p = result;
		// console.log(result);
		p.save().then(function () {
			response.success('successfully saved');z;
		}, function (error) {
			console.log(error);
		});
	}, function (error) {
		response.error(error.message);
	});

	var obj = Parse.Object.extend('Project');
	var query = new Parse.Query(obj);

	query.get(request.params['id']).then(function (result) {
		console.log(result);
	}, function (error) {
		console.log(error);
	});
});
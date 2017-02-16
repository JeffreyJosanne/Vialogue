'use strict';

var Project = require('../model/Project.js').Project;
var Slide = require('../model/Slide.js').Slide;
var JSON2 = require('JSON2');

Parse.Cloud.define('uploadProject', function (request, response) {

	var p = new Project(JSON2.stringify(request.params));
	console.log('chummamamama');
	console.log(p);
	p.initialize().then(
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

Parse.Cloud.define('uploadSlide', function (request, response) {
	console.log('chummamamam');

	var p = new Slide(JSON2.stringify(request.params));
	console.log('chummamamam');
	console.log(p);
	p.init().then(
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

	var obj = Parse.Object.extend('Slide');
	var query = new Parse.Query(obj);

	query.get(request.params['id']).then(function (result) {
		console.log(result);
	}, function (error) {
		console.log(error);
	});
});
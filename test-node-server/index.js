var Parse = require('parse/node').Parse;
var fs = require('fs');

Parse.initialize('app', 'id', 'master');
Parse.serverURL = 'http://localhost:1337/parse';

// var id = "ZsMHSSftPf";
// var json = {
// 	"id": id,
// 	"parent": id,
// 	"original_parent": id,
// 	"category": "S5i3Ou2206",
// 	"language": "s1L99KeQ1z",
// 	"author": "FGyRgBiBw5",
// 	"name": "one two ka four",
// 	"description": "hello",
// 	"tags": ["hello", "world"],
// 	"is_dubbed": true,
// 	"is_edited": false,
// 	"resolution_x": 1080,
// 	"resolution_y": 721,
// 	"slide_ordering_sequence": [1, 2, 3, 3, 4],
// 	// "slides": [
// 	// 	{
// 	// 		"id": 'jGUWtZJEDb',
// 	// 		"project_slide_id": 1,
// 	// 		"layering_objects": [],
// 	// 		"hyperlinks": [],
// 	// 		"type": "Image",
// 	// 		"resource": {
// 	// 			"id": "XMlbSkT4kI",
// 	// 			"type": "Image",
// 	// 			"url": '',
// 	// 			"is_edited": false
// 	// 		},
// 	// 		"is_edited": false
// 	// 	}
// 	// ]
// };
//
// Parse.Cloud.run('uploadProject', json).then(
// 	function(o) {
// 		console.log(o);
// 	}, function(error) {
// 		console.log(error);
// 	}
// );

var json = {
	"id": "jGUWtZJEDb",
	"project_slide_id": 0,
	"layering_objects": [],
	"hyperlinks": ["jGUWtZJEDb"],
	"type": "Question",
	"resource": {
		"id": "tE35iGgT21",
		"type": "uestion",
		"url": "",
		"children_resources": [
			{
				"id": "tE35iGgT21",
				"type": "Question",
				"url": "",
				"children_resources": [
					{
						"id": "tE35iGgT21",
						"type": 10,
						"url": "",
						"children_resources": [],
						"is_edited": false
					}
				],
				"is_edited": false
			}
		],
		"is_edited": false
	},
	"is_edited": false
}

Parse.Cloud.run('uploadSlide', json).then(
	function(o) {
		console.log(o);
	}, function(error) {
		console.log(error);
	}
)

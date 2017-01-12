var json = require('./json');

var jsonObject = new json.validateJson.projectJsonObject('{"id": 10}');
console.log(jsonObject.object);

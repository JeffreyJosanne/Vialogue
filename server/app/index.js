var ParseServer = require('parse-server').ParseServer;
var express = require('express');
var fs = require('fs');

var data = fs.readFileSync('./config/config.json');
var config;

try {
	config = JSON.parse(data);
} catch (err) {
	console.log('config.json is corrputed')
	throw(err);
}

var databaseUri = config.MONGO_DB_URL;
var api = new ParseServer({
	databaseURI: databaseUri,
	cloud: config.CLOUD_URL,
	appId: 'app',
	masterKey: 'master',
	serverURL: config.PARSE_SERVER_URL,
	liveQuery: {
		classNames: ["posts", "comments"]
	}
});

// instantiate express route for parse
var app = express();
app.use('/parse', api);

// start http server
var httpServer = require('http').createServer(app);
httpServer.listen(config.HTTP_SERVER_PORT_NO, function() {
	console.log('parse server running on port ' + config.HTTP_SERVER_PORT_NO);
});

// start parse liveQuery server
ParseServer.createLiveQueryServer(httpServer);
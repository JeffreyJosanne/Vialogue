var Mocha = require('mocha'),
    fs = require('fs'),
    path = require('path');

var exec = require('child_process').exec;
exec('clear');

// Instantiate a Mocha instance.
var mocha = new Mocha();

var testDir = './build/'

var parseDirectory = function(dir) {
    fs.readdirSync(dir).filter(function(file) {
        // get filename with complete path
        var fileWithPath = path.join(dir, file);

        if(fs.lstatSync(fileWithPath).isDirectory()) {
            parseDirectory(fileWithPath);
        } else {
            if(fileWithPath.substr(-8) === '.spec.js') {
                mocha.addFile(fileWithPath);
            }
        }
    });
}

parseDirectory(testDir);

// Run the tests.
mocha.run(function(failures){
  process.on('exit', function () {
    process.exit(failures);  // exit with non-zero status if there were failures
  });
});

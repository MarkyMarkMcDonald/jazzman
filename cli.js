var split = require('lodash/fp/split');
var run = require('./run');

var fileAndLineToRun = split(':', process.argv[2]);
var fileToRun = fileAndLineToRun[0];
var lineToRun = fileAndLineToRun[1] ? parseInt(fileAndLineToRun[1]) : undefined;

var suite = require('./' + fileToRun);

run(suite, lineToRun);

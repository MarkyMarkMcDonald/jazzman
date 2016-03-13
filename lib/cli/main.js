var cli = require('cli').enable('glob');

var runAll = require('./run-all-and-send-summary');
var printReport = require('./print-report');

cli.main(runAll(printReport));

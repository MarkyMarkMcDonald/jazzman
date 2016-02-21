var _ = require('lodash/fp');

var fileAndLineToRun = _.split(':', process.argv[2]);
var fileToRun = fileAndLineToRun[0];
var lineToRun = fileAndLineToRun[1] ? parseInt(fileAndLineToRun[1]) : undefined;

var suite = require('./' + fileToRun)('END');

var globalContext = {};
var report = suite(function() { return globalContext; }, lineToRun);

function printReport(report, indent) {
  indent = indent || 0;
  var padding = Array(indent+1).join(' ');

  if(report.status !== 'OMITTED') {
    console.log(padding + report.name);

    _.each(function(result) {
      if(typeof(result) === 'string') {
        console.log(padding + '  ' + result);
      } else {
        printReport(result, indent+2);
      }
    }, report.results);
  }
}

printReport(report);

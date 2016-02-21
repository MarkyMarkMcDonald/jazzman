var _ = require('lodash/fp');
var colors = require('colors/safe');

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
    console.log(padding + formattedForStatus(report.status, report.name + ' (' + report.status + ')'));

    _.each(function(result) {
      if(result.results) {
        printReport(result, indent+2);
      } else {
        if(result.status === 'FAIL') {
          console.log(padding + '  ' + formattedForStatus(result.status, result.status));
        }
      }
    }, report.results);
  }
}

function formattedForStatus(status, text) {
  var formatter = colors.yellow;
  if(status === 'PASS') formatter = colors.green;
  if(status === 'FAIL') formatter = colors.red;

  return formatter(text);
}

printReport(report);

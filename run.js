var _ = require('lodash/fp');

var fileToRun = process.argv[2];

var suite = require('./' + fileToRun);

var report = suite();

function printReport(report, indent) {
  indent = indent || 0;
  var padding = Array(indent+1).join(' ');

  console.log(padding + report.name);

  _.each(function(result) {
    if(typeof(result) === 'string') {
      console.log(padding + '  ' + result);
    } else {
      printReport(result, indent+2);
    }
  }, report.results);
}

printReport(report);

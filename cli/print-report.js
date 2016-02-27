var colors = require('colors/safe');
var each = require('lodash/fp/each');

function formattedForStatus(status, text) {
  var formatter = colors.yellow;
  if(status === 'PASS') formatter = colors.green;
  if(status === 'FAIL') formatter = colors.red;

  return formatter(text);
}

module.exports = function printReport(report, indent) {
  indent = indent || 0;
  var padding = Array(indent+1).join(' ');

  if(report.status !== 'OMITTED') {
    console.log(padding + formattedForStatus(report.status, report.name + ' (' + report.status + ')'));

    each(function(result) {
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


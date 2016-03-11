var colors = require('chalk');
var each = require('lodash/fp/each');

function formattedForStatus(status, text) {
  var formatter = colors.yellow;
  if(status === 'PASS') formatter = colors.green;
  if(status === 'FAIL') formatter = colors.red;

  return formatter(text);
}

function resultMessageWithLocation(result) {
  return formattedForStatus(result.status,
    result.message + ' @ ' + result.location.getFileName() + ':' + result.location.getLineNumber()
  );
}

function printDetail(result, padding) {
  if(result.status === 'FAIL') {
    console.log(padding + '  ' + resultMessageWithLocation(result));
  }
}

function hasNestedResults(result) {
  return !!result.results;
}

module.exports = function printReport(report, indent) {
  indent = indent || 0;
  var padding = Array(indent+1).join(' ');

  if(report.status !== 'OMITTED') {
    console.log(padding + formattedForStatus(report.status, report.name + ' (' + report.status + ')'));

    each(function(result) {
      hasNestedResults(result) ?
        printReport(result, indent+2):
        printDetail(result, padding);
    }, report.results);
  }
}


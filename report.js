var _ = require('lodash/fp');

function Report(name, results) {
  results = _.flatten([results]);

  return {
    name: name,
    status: aggregateStatus(_.map('status', results)),
    results: results
  };
}

Report.omitted = function(name) {
  return {
    name: name,
    status: 'OMITTED',
    results: []
  };
}

function aggregateStatus(results) {
  if(_.some(function(result) { return result === 'FAIL'; }, results)) return 'FAIL';
  if(_.every(function(result) { return result === 'OMITTED'; }, results)) return 'OMITTED';
  return 'PASS';
}

module.exports = Report;

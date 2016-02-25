var printReport = require('./print-report');

function globalContext() { return {}; }

module.exports = function(suite, lineToRun) {
  var preparedSuite = suite('END');
  printReport(preparedSuite(globalContext, lineToRun));
};

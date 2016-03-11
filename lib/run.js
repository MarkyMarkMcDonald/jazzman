
function globalContext() { return {}; }

module.exports = function(suite, lineToRun) {
  var preparedSuite = suite.definition(suite.startLine, 'END');
  return preparedSuite(globalContext, lineToRun);
};

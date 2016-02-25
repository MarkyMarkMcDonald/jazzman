
function globalContext() { return {}; }

module.exports = function(suite, lineToRun) {
  var preparedSuite = suite('END');
  return preparedSuite(globalContext, lineToRun);
};

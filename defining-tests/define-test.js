var report = require('../report');

function buildFullContext(buildContext, buildSuperContext) {
  return function() {
    return buildContext(buildSuperContext());
  }
}

function testSuppressedByLineFocus(startLine, endLine, focusLine) {
  return focusLine && (startLine > focusLine || (endLine !== 'END' && endLine <= focusLine));
}

module.exports = function defineTest(name, execute, buildContext, startLine) {
  return function(startLine, endLine) {
    return function(buildSuperContext, focusLine) {
      return testSuppressedByLineFocus(startLine, endLine, focusLine) ?
        report.omitted(name) :
        execute(buildFullContext(buildContext, buildSuperContext), focusLine) ;
    };
  };
};

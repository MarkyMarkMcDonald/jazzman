var compose = require('lodash/fp/compose');
var report = require('../report');

module.exports = function defineTest(name, execute, buildContext) {
  return function situateTestBetweenLines(startLine, endLine) {
    return function run(buildSuperContext, focusLine) {
      var buildFullContext = compose(buildContext, buildSuperContext);
      var suppressTest = focusLineOutOfBounds(startLine, endLine, focusLine);

      return suppressTest ? report.omitted(name) : execute(buildFullContext, focusLine);
    };
  };
};

function focusLineOutOfBounds(startLine, endLine, focusLine) {
  return focusLine && (startLine > focusLine || (endLine !== 'END' && endLine <= focusLine));
}

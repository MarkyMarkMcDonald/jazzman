var _ = require('lodash/fp');
var map = _.map;
var stack = require('stack-trace');

var report = require('../report');
var defineTest = require('./define-test');

module.exports = function describe(name, config) {
  var startLine = stack.get()[1].getLineNumber();
  var buildContext = config.context || _.identity;
  var testDefinitions = config.tests || [];

  return {
    startLine: startLine,
    definition: defineTest(
      name,
      executeFor(name, testDefinitions, startLine),
      buildContext
    )
  };
};

function executeFor(name, testDefinitions, startLine) {
  var firstTestStart = testDefinitions[0].startLine
  var relevantFocus = focusLineUnlessInPreamble(startLine, firstTestStart);

  return function executeDescribe(context, focusLine) {
    var results = map(
      function(test) { return test(context, relevantFocus(focusLine)); },
      scopeTestsByLineNumber(testDefinitions)
    );

    return report(name, results);
  };
}

function focusLineUnlessInPreamble(describeStart, firstTestStart) {
  return function(focusLine) {
    return (focusLine >= describeStart &&
            focusLine < firstTestStart) ?
      undefined:
      focusLine;
  }
}

function scopeTestsByLineNumber(testDefinitions) {
  return map(
    _.spread(scopeTestByLineNumber),
    staggerredZip(testDefinitions, {startLine: 'END'})
  );
}

function scopeTestByLineNumber(test, followingTest) {
  var endLine = followingTest.startLine;
  return test.definition(test.startLine, endLine);
}

function staggerredZip(array, finalElement) {
  return _.zip(array, _.concat(_.tail(array), [finalElement]));
}

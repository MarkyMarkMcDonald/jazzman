var _ = require('lodash/fp');
var stack = require('stack-trace');

var report = require('../report');
var defineTest = require('./define-test');

function staggerredZip(array, finalElement) {
  return _.zip(array, _.concat(_.tail(array), [finalElement]));
}

module.exports = function describe(name, config) {
  var definedAt = stack.get()[1];
  var buildContext = config.context || _.identity;
  var testDefinitions = config.tests || [];

  var tests = _.map(function(testPair) {
    return testPair[0].definition(
      testPair[0].startLine,
      testPair[1].startLine
    );
  }, staggerredZip(testDefinitions, 'END'));

  function executeDescribe(context, focusLine) {
    if(focusLine >= definedAt.getLineNumber() && focusLine < testDefinitions[0].startLine) {
      focusLine = undefined;
    }

    var results = _.map(function(test) {
      return test(context, focusLine);
    }, tests);

    return report(name, results);
  }

  return {
    startLine: definedAt.getLineNumber(),
    definition: defineTest(name, executeDescribe, buildContext)
  };
}

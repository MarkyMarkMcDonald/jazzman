var _ = require('lodash/fp');
var stack = require('stack-trace');

var report = require('../report');
var defineTest = require('./define-test');

module.exports = function describe(name, config) {
  var definedAt = stack.get()[1];
  var buildContext = config.context || _.identity;
  var testDefinitions = config.tests || [];

  var tests = scopeAllTestsByLineNumber(testDefinitions);

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
};

function scopeAllTestsByLineNumber(testDefinitions) {
  return _.map(
    _.spread(scopeTestByLineNumber),
    staggerredZip(testDefinitions, 'END')
  );
}

function scopeTestByLineNumber(test, followingTest) {
  var definition = test.definition;
  var startLine = test.startLine;
  var endLine = followingTest === 'END' ? 'END' : followingTest.startLine;

  return definition(startLine, endLine);
}

function staggerredZip(array, finalElement) {
  return _.zip(array, _.concat(_.tail(array), [finalElement]));
}

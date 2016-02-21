var _ = require('lodash/fp');
var stack = require('stack-trace');

var Report = require('./report');
var defineTest = require('./define-test');

function describe(name, config) {
  var definedAt = stack.get()[1];
  var buildContext = config.context || _.identity;
  var testDefinitions = config.tests || [];

  var tests = _.map(function(testPair) {
    return testPair[0](testPair[1].startLine);
  }, staggerredZip(testDefinitions, 'END'));

  function executeDescribe(context, focusLine) {
    if(focusLine >= definedAt.getLineNumber() && focusLine < testDefinitions[0].startLine) {
      focusLine = undefined;
    }

    var results = _.map(function(test) {
      return test(context, focusLine);
    }, tests);

    return Report(name, results);
  }

  return defineTest(name, executeDescribe, buildContext, definedAt.getLineNumber());
}

function staggerredZip(array, finalElement) {
  return _.zip(array, _.concat(_.tail(array), [finalElement]));
}

function it(name, test) {
  function executeIt(buildContext, focusLine) {
    return Report(name, test(buildContext()));
  }

  return defineTest(name, executeIt, _.identity, stack.get()[1].getLineNumber());
}

function expect(subject) {
  return {
    toEqual: function(expected) {
      return subject === expected ?
        {status: 'PASS'}:
        {status: 'FAIL'};
    }
  }
}

function sequence(tests) {
  return function(context) {
    return _.flatMap(function(test) { return test(context); }, tests);
  };
}

module.exports = {
  describe: describe,
  it: it,
  expect: expect,
  sequence: sequence
}
